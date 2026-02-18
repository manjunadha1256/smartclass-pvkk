import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse form data (file upload)
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const subject = (formData.get("subject") as string) || "General";
    const section = (formData.get("section") as string) || "";

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Read file as text or base64 depending on type
    let fileContent = "";
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    if (
      fileType === "text/plain" ||
      fileName.endsWith(".txt") ||
      fileName.endsWith(".md")
    ) {
      fileContent = await file.text();
    } else {
      // For PDF, DOCX, PPT, Images — convert to base64 for multimodal Gemini
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < uint8Array.length; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      fileContent = btoa(binary);
    }

    // Build the prompt
    const systemPrompt = `You are an expert educational quiz creator for college students. 
Your task is to analyze study material and generate exactly 20 high-quality multiple choice questions (MCQs).

Rules:
- Generate exactly 20 MCQ questions
- Each question must have exactly 4 options (A, B, C, D)
- Only one option is correct
- Questions should test understanding, not just memorization
- Vary difficulty: 30% easy, 50% medium, 20% hard
- Questions must be directly based on the provided content
- Return ONLY valid JSON, no markdown, no explanation`;

    // Determine if it's a text or binary file
    const isTextFile =
      fileType === "text/plain" ||
      fileName.endsWith(".txt") ||
      fileName.endsWith(".md");

    let messages;

    if (isTextFile) {
      messages = [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate 20 MCQ questions from this study material about "${subject}":\n\n${fileContent}\n\nReturn ONLY this JSON format:\n{"questions":[{"q":"question text","options":["A option","B option","C option","D option"],"ans":0}]}\nwhere "ans" is the 0-based index of the correct answer.`,
        },
      ];
    } else {
      // Use multimodal for PDFs/images/docs
      const mimeType = fileType || "application/octet-stream";
      messages = [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Generate 20 MCQ questions from this study material about "${subject}". Return ONLY this JSON format:\n{"questions":[{"q":"question text","options":["A option","B option","C option","D option"],"ans":0}]}\nwhere "ans" is the 0-based index of the correct answer.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${fileContent}`,
              },
            },
          ],
        },
      ];
    }

    // Call Lovable AI Gateway with Gemini
    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages,
          temperature: 0.7,
        }),
      }
    );

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "AI rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add usage credits." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content || "";

    // Parse the JSON from AI response
    let questions = [];
    try {
      // Strip markdown code blocks if present
      const cleaned = rawContent
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      questions = parsed.questions || [];
    } catch (parseErr) {
      console.error("Failed to parse AI response:", rawContent);
      throw new Error("AI returned invalid JSON. Please try again.");
    }

    if (questions.length === 0) {
      throw new Error("AI could not generate questions from this content.");
    }

    // Generate unique 6-digit quiz code
    const quizCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save quiz to database
    const { error: dbError } = await supabase.from("quizzes").insert({
      quiz_code: quizCode,
      subject,
      section,
      questions,
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
      throw new Error("Failed to save quiz to database.");
    }

    return new Response(
      JSON.stringify({
        success: true,
        quizCode,
        questionCount: questions.length,
        questions,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("generate-quiz error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
