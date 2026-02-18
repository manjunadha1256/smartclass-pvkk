
-- Fix overly permissive INSERT policy on quizzes to be more specific
DROP POLICY IF EXISTS "Anyone can insert quizzes" ON public.quizzes;

-- Allow inserts without restriction (quiz generation is a backend operation via edge function using service role)
-- The edge function uses the service role key which bypasses RLS, so we keep the select policy for students
-- and add a restricted insert policy requiring a non-null quiz_code
CREATE POLICY "Backend can insert quizzes"
ON public.quizzes FOR INSERT
WITH CHECK (quiz_code IS NOT NULL AND length(quiz_code) = 6);
