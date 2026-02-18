import React, { useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ArrowLeft, MessageSquare, Brain, ClipboardList, Users,
  Send, Upload, Loader2, CheckCircle, Copy,
  AlertCircle, UserCheck, UserX, RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClassData {
  time: string;
  subject: string;
  section: string;
  room: string;
  students: number;
}

interface ClassManagementProps {
  classData: ClassData;
  onBack: () => void;
}

const demoStudents = [
  { id: "1", name: "Arjun Reddy", roll: "22CS001", attendance: "present" as const },
  { id: "2", name: "Sneha Patel", roll: "22CS002", attendance: "absent" as const },
  { id: "3", name: "Rahul Sharma", roll: "22CS003", attendance: "present" as const },
  { id: "4", name: "Divya Krishna", roll: "22CS004", attendance: "present" as const },
  { id: "5", name: "Kiran Rao", roll: "22CS005", attendance: "absent" as const },
  { id: "6", name: "Pooja Verma", roll: "22CS006", attendance: "present" as const },
  { id: "7", name: "Amit Singh", roll: "22CS007", attendance: "present" as const },
  { id: "8", name: "Lalitha Devi", roll: "22CS008", attendance: "absent" as const },
];

const demoMessages = [
  { id: "1", text: "Please complete Chapter 5 before next class.", time: "9:15 AM", sender: "faculty" },
  { id: "2", text: "Quiz tomorrow covering Arrays and Linked Lists.", time: "Yesterday", sender: "faculty" },
];

const demoQuizQuestions = [
  { q: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], ans: 1 },
  { q: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Array", "Tree"], ans: 1 },
  { q: "What is a doubly linked list?", options: ["Has two values", "Has two pointers", "Has two heads", "Sorted list"], ans: 1 },
  { q: "AVL tree is a type of?", options: ["Binary tree", "B-tree", "Self-balancing BST", "Heap"], ans: 2 },
  { q: "Hash table average lookup is?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], ans: 2 },
];

type AttendanceStatus = "present" | "absent";

export default function ClassManagement({ classData, onBack }: ClassManagementProps) {
  const [activeTab, setActiveTab] = useState<"message" | "quiz" | "attendance" | "students">("attendance");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(demoMessages);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "generating" | "done" | "error">("idle");
  const [quizCode, setQuizCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<typeof demoQuizQuestions>([]);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(
    Object.fromEntries(demoStudents.map(s => [s.id, s.attendance]))
  );
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), text: message, time: "Just now", sender: "faculty" }]);
    setMessage("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setErrorMessage("");
    setUploadState("uploading");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("subject", classData.subject);
      formData.append("section", classData.section);

      setUploadState("generating");

      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-quiz`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate quiz");
      }

      setQuizCode(data.quizCode);
      setGeneratedQuestions(data.questions || []);
      setUploadState("done");

      toast({
        title: "Quiz Generated!",
        description: `${data.questionCount} MCQ questions created. Code: ${data.quizCode}`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setErrorMessage(msg);
      setUploadState("error");
      toast({
        title: "Quiz Generation Failed",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(quizCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const toggleAttendance = (id: string) => {
    setAttendance(prev => ({ ...prev, [id]: prev[id] === "present" ? "absent" : "present" }));
  };

  const saveAttendance = () => {
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 3000);
  };

  const presentCount = Object.values(attendance).filter(v => v === "present").length;
  const absentCount = demoStudents.length - presentCount;

  const tabs = [
    { key: "attendance", label: "Attendance", icon: ClipboardList },
    { key: "message", label: "Messages", icon: MessageSquare },
    { key: "quiz", label: "AI Quiz", icon: Brain },
    { key: "students", label: "Students", icon: Users },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{classData.subject}</h2>
            <p className="text-sm text-muted-foreground">
              Section {classData.section} · {classData.room} · {classData.time} · {classData.students} students
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-card overflow-x-auto" style={{ boxShadow: "var(--shadow-card)" }}>
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => setActiveTab(t.key as any)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center"
                style={{
                  background: activeTab === t.key ? "hsl(var(--orange))" : "transparent",
                  color: activeTab === t.key ? "hsl(var(--navy-dark))" : "hsl(var(--muted-foreground))",
                }}>
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Attendance Tab */}
        {activeTab === "attendance" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="stat-card text-center">
                <div className="text-2xl font-bold" style={{ color: "hsl(var(--success))" }}>{presentCount}</div>
                <div className="text-xs text-muted-foreground">Present</div>
              </div>
              <div className="stat-card text-center">
                <div className="text-2xl font-bold" style={{ color: "hsl(var(--destructive))" }}>{absentCount}</div>
                <div className="text-xs text-muted-foreground">Absent</div>
              </div>
              <div className="stat-card text-center">
                <div className="text-2xl font-bold" style={{ color: "hsl(var(--orange))" }}>
                  {Math.round((presentCount / demoStudents.length) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Attendance</div>
              </div>
            </div>

            {attendanceSaved && (
              <div className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium"
                style={{ background: "hsl(var(--success) / 0.1)", color: "hsl(var(--success))" }}>
                <CheckCircle className="w-4 h-4" /> Attendance saved! Absent alerts sent to parents.
              </div>
            )}

            <div className="bg-card rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground">Mark Attendance</h3>
                <div className="flex gap-2">
                  <button onClick={() => setAttendance(Object.fromEntries(demoStudents.map(s => [s.id, "present"])))}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                    style={{ background: "hsl(var(--success) / 0.1)", color: "hsl(var(--success))" }}>
                    All Present
                  </button>
                  <button onClick={saveAttendance} className="btn-primary text-sm py-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {demoStudents.map(s => {
                  const isPresent = attendance[s.id] === "present";
                  return (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border transition-all"
                      style={{ borderColor: isPresent ? "hsl(var(--success) / 0.3)" : "hsl(var(--destructive) / 0.3)", background: isPresent ? "hsl(var(--success) / 0.04)" : "hsl(var(--destructive) / 0.04)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: isPresent ? "hsl(var(--success) / 0.15)" : "hsl(var(--destructive) / 0.15)", color: isPresent ? "hsl(var(--success))" : "hsl(var(--destructive))" }}>
                          {s.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{s.name}</div>
                          <div className="text-xs text-muted-foreground">{s.roll}</div>
                        </div>
                      </div>
                      <button onClick={() => toggleAttendance(s.id)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          background: isPresent ? "hsl(var(--success))" : "hsl(var(--destructive))",
                          color: "white",
                        }}>
                        {isPresent ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                        {isPresent ? "Present" : "Absent"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Message Tab */}
        {activeTab === "message" && (
          <div className="bg-card rounded-2xl" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="p-5 border-b border-border">
              <h3 className="font-bold text-foreground">Class Messages</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Broadcast to all {classData.students} students</p>
            </div>
            <div className="p-5 space-y-3 min-h-48">
              {messages.map(m => (
                <div key={m.id} className="p-3 rounded-xl text-sm" style={{ background: "hsl(var(--navy) / 0.06)" }}>
                  <p className="text-foreground">{m.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{m.time}</p>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-border">
              <div className="flex gap-3">
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type a message to broadcast to all students..."
                  rows={2}
                  className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all"
                  style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted) / 0.3)" }}
                  onFocus={e => (e.target.style.borderColor = "hsl(var(--orange))")}
                  onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")}
                />
                <button onClick={sendMessage} className="btn-primary self-end">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Quiz Tab */}
        {activeTab === "quiz" && (
          <div className="space-y-4">
            <div className="bg-card rounded-2xl p-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
                <Brain className="w-5 h-5" style={{ color: "hsl(var(--orange))" }} />
                AI Quiz Generator
              </h3>
              <p className="text-sm text-muted-foreground mb-5">Upload study material and AI will auto-generate 20 MCQ questions</p>

              {uploadState === "idle" && (
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all"
                  style={{ borderColor: "hsl(var(--border))" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "hsl(var(--orange))")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "hsl(var(--border))")}>
                  <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <div className="text-sm font-semibold text-foreground mb-1">Drop files here or click to upload</div>
                  <div className="text-xs text-muted-foreground">Supports PDF, DOCX, PPT, Images, TXT</div>
                  <input ref={fileRef} type="file" className="hidden" accept=".pdf,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.txt,.md" onChange={handleFileUpload} />
                </div>
              )}

              {uploadState === "uploading" && (
                <div className="text-center py-10">
                  <Loader2 className="w-10 h-10 mx-auto animate-spin mb-3" style={{ color: "hsl(var(--orange))" }} />
                  <div className="text-sm font-semibold text-foreground">Uploading {uploadedFileName}...</div>
                  <div className="text-xs text-muted-foreground mt-1">Preparing file for AI analysis</div>
                </div>
              )}

              {uploadState === "generating" && (
                <div className="text-center py-10">
                  <Brain className="w-10 h-10 mx-auto mb-3 animate-pulse" style={{ color: "hsl(var(--orange))" }} />
                  <div className="text-sm font-semibold text-foreground">Gemini AI is generating 20 MCQ questions...</div>
                  <div className="text-xs text-muted-foreground mt-1">Analyzing content from {uploadedFileName}</div>
                  <div className="flex justify-center gap-1 mt-4">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: "hsl(var(--orange))", animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}

              {uploadState === "error" && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: "hsl(var(--destructive) / 0.08)", border: "1px solid hsl(var(--destructive) / 0.3)" }}>
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--destructive))" }} />
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "hsl(var(--destructive))" }}>Generation Failed</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{errorMessage}</div>
                    </div>
                  </div>
                  <button onClick={() => { setUploadState("idle"); setErrorMessage(""); if (fileRef.current) fileRef.current.value = ""; }}
                    className="btn-navy w-full justify-center">
                    <RefreshCw className="w-4 h-4" /> Try Again
                  </button>
                </div>
              )}

              {uploadState === "done" && quizCode && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium"
                    style={{ background: "hsl(var(--success) / 0.1)", color: "hsl(var(--success))" }}>
                    <CheckCircle className="w-4 h-4" /> {generatedQuestions.length} questions generated from {uploadedFileName}!
                  </div>
                  <div className="p-5 rounded-2xl text-center" style={{ background: "hsl(var(--navy) / 0.05)", border: "2px dashed hsl(var(--navy) / 0.2)" }}>
                    <div className="text-xs font-semibold text-muted-foreground mb-2">QUIZ CODE — Share with students</div>
                    <div className="text-4xl font-bold tracking-widest mb-3" style={{ color: "hsl(var(--navy))", fontFamily: "monospace" }}>
                      {quizCode}
                    </div>
                    <button onClick={copyCode} className="btn-primary text-sm mx-auto">
                      {codeCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {codeCopied ? "Copied!" : "Copy Code"}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="p-3 rounded-xl text-center" style={{ background: "hsl(var(--muted))" }}>
                      <div className="text-sm font-bold text-foreground">{generatedQuestions.length}</div>
                      <div className="text-xs text-muted-foreground">Questions</div>
                    </div>
                    <div className="p-3 rounded-xl text-center" style={{ background: "hsl(var(--muted))" }}>
                      <div className="text-sm font-bold text-foreground">10 min</div>
                      <div className="text-xs text-muted-foreground">Time Limit</div>
                    </div>
                  </div>
                  <button onClick={() => { setUploadState("idle"); setQuizCode(""); setGeneratedQuestions([]); if (fileRef.current) fileRef.current.value = ""; }} className="btn-navy w-full justify-center">
                    <RefreshCw className="w-4 h-4" /> Generate New Quiz
                  </button>
                </div>
              )}
            </div>

            {uploadState === "done" && generatedQuestions.length > 0 && (
              <div className="bg-card rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
                <h4 className="font-bold text-foreground mb-3">AI-Generated Preview ({generatedQuestions.length} Questions)</h4>
                <div className="space-y-3">
                  {generatedQuestions.slice(0, 5).map((q, i) => (
                    <div key={i} className="p-3 rounded-xl" style={{ background: "hsl(var(--muted) / 0.5)" }}>
                      <div className="text-sm font-medium text-foreground mb-2">Q{i + 1}. {q.q}</div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {q.options.map((opt, j) => (
                          <div key={j} className="text-xs px-2.5 py-1.5 rounded-lg"
                            style={{ background: j === q.ans ? "hsl(var(--success) / 0.15)" : "hsl(var(--card))", color: j === q.ans ? "hsl(var(--success))" : "hsl(var(--foreground))" }}>
                            {String.fromCharCode(65 + j)}. {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {generatedQuestions.length > 5 && (
                    <div className="text-center text-xs text-muted-foreground py-2">
                      + {generatedQuestions.length - 5} more questions saved in the quiz
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="bg-card rounded-2xl" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="p-5 border-b border-border">
              <h3 className="font-bold text-foreground">Section {classData.section} — Students</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{demoStudents.length} enrolled</p>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll No.</th>
                    <th>Attendance %</th>
                    <th>Last Quiz</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {demoStudents.map((s, i) => {
                    const pct = Math.floor(65 + Math.random() * 30);
                    const quiz = Math.floor(8 + Math.random() * 12);
                    return (
                      <tr key={s.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ background: "hsl(var(--navy) / 0.1)", color: "hsl(var(--navy))" }}>
                              {s.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <span className="font-semibold text-foreground text-sm">{s.name}</span>
                          </div>
                        </td>
                        <td><span className="font-mono text-xs">{s.roll}</span></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="progress-bar w-16">
                              <div className={`progress-fill ${pct >= 75 ? "success" : pct >= 50 ? "" : "danger"}`} style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs font-medium">{pct}%</span>
                          </div>
                        </td>
                        <td><span className="text-sm font-medium">{quiz}/20</span></td>
                        <td>
                          {pct >= 75 ? <span className="badge-success">Regular</span> :
                            pct >= 50 ? <span className="badge-warning">At Risk</span> :
                              <span className="badge-danger">Detained</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
