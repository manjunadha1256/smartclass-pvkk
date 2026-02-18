import React, { useState, useEffect, useRef, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import {
  Clock, AlertTriangle, CheckCircle, ArrowRight, Shield,
  Maximize, Trophy, BarChart3, RotateCcw, XCircle
} from "lucide-react";

const sampleQuestions = [
  { q: "What is the time complexity of binary search?", opts: ["O(n)", "O(log n)", "O(n²)", "O(1)"], ans: 1 },
  { q: "Which data structure uses LIFO principle?", opts: ["Queue", "Stack", "Array", "Tree"], ans: 1 },
  { q: "In a doubly linked list, each node has:", opts: ["One pointer", "Two pointers", "Three pointers", "No pointers"], ans: 1 },
  { q: "What does AVL stand for in AVL tree?", opts: ["Advanced Variable Length", "Adelson-Velsky and Landis", "Array Value List", "Auto Variable Link"], ans: 1 },
  { q: "Average case time complexity of hash table lookup:", opts: ["O(n)", "O(log n)", "O(1)", "O(n²)"], ans: 2 },
  { q: "Which sorting algorithm has the best average case?", opts: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"], ans: 2 },
  { q: "Stack overflow occurs when:", opts: ["Memory is full", "Recursion is too deep", "Array index out of bounds", "Null pointer"], ans: 1 },
  { q: "Inorder traversal of BST gives:", opts: ["Random order", "Descending order", "Ascending order", "Level order"], ans: 2 },
  { q: "What is the height of a balanced BST with n nodes?", opts: ["O(n)", "O(log n)", "O(n²)", "O(1)"], ans: 1 },
  { q: "Which is NOT a linear data structure?", opts: ["Array", "Stack", "Queue", "Tree"], ans: 3 },
  { q: "Graph BFS uses which data structure internally?", opts: ["Stack", "Queue", "Tree", "Heap"], ans: 1 },
  { q: "Dijkstra's algorithm finds:", opts: ["Minimum spanning tree", "Shortest path", "Topological sort", "DFS order"], ans: 1 },
  { q: "A complete binary tree with 7 nodes has height:", opts: ["1", "2", "3", "4"], ans: 2 },
  { q: "Which collision resolution uses linked lists?", opts: ["Open addressing", "Linear probing", "Chaining", "Double hashing"], ans: 2 },
  { q: "Heap data structure satisfies:", opts: ["BST property", "Heap property", "AVL property", "B-tree property"], ans: 1 },
  { q: "Postfix notation for A+B*C is:", opts: ["A+BC*", "AB+C*", "ABC*+", "A+B*C"], ans: 2 },
  { q: "Quick sort worst case is:", opts: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], ans: 2 },
  { q: "DFS uses which data structure?", opts: ["Queue", "Stack", "Heap", "Array"], ans: 1 },
  { q: "Minimum number of nodes in AVL tree of height h:", opts: ["h+1", "2h", "N(h-1)+N(h-2)+1", "2^h"], ans: 2 },
  { q: "Which is an in-place sorting algorithm?", opts: ["Merge Sort", "Quick Sort", "Counting Sort", "Radix Sort"], ans: 1 },
];

type QuizState = "enter-code" | "rules" | "active" | "submitted" | "violation";

export default function StudentQuiz() {
  const { user } = useAuth();
  const [state, setState] = useState<QuizState>("enter-code");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [violations, setViolations] = useState(0);
  const [score, setScore] = useState(0);
  const [violationMsg, setViolationMsg] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Anti-cheat: tab visibility detection
  useEffect(() => {
    if (state !== "active") return;
    const handleVisibility = () => {
      if (document.hidden) {
        const newViolations = violations + 1;
        setViolations(newViolations);
        setViolationMsg("⚠️ Tab switch detected! Warning: " + newViolations + "/3");
        if (newViolations >= 3) {
          handleSubmit(true);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [state, violations]);

  // Anti-cheat: disable right click & copy
  useEffect(() => {
    if (state !== "active") return;
    const preventContext = (e: MouseEvent) => e.preventDefault();
    const preventCopy = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "a" || e.key === "p")) e.preventDefault();
    };
    document.addEventListener("contextmenu", preventContext);
    document.addEventListener("keydown", preventCopy);
    return () => {
      document.removeEventListener("contextmenu", preventContext);
      document.removeEventListener("keydown", preventCopy);
    };
  }, [state]);

  // Timer
  useEffect(() => {
    if (state !== "active") return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [state]);

  const handleSubmit = useCallback((forced = false) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const correct = sampleQuestions.filter((q, i) => answers[i] === q.ans).length;
    setScore(correct);
    setState(forced ? "violation" : "submitted");
  }, [answers]);

  const enterQuiz = () => {
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setCodeError("Please enter a valid 6-digit quiz code.");
      return;
    }
    setCodeError("");
    setState("rules");
  };

  const startQuiz = () => {
    setState("active");
    setTimeLeft(600);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const pct = Math.round((timeLeft / 600) * 100);
  const isUrgent = timeLeft < 120;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        {/* Enter Code */}
        {state === "enter-code" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Join Quiz</h2>
              <p className="text-sm text-muted-foreground">Enter the 6-digit code provided by your faculty</p>
            </div>
            <div className="bg-card rounded-2xl p-8 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "hsl(var(--orange) / 0.1)" }}>
                <Trophy className="w-8 h-8" style={{ color: "hsl(var(--orange))" }} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">Enter Quiz Code</h3>
              <p className="text-sm text-muted-foreground mb-6">Get the code from your faculty</p>
              <input
                className="w-full text-center text-2xl font-bold tracking-[0.5em] px-4 py-3 rounded-xl border outline-none transition-all mb-2"
                style={{ borderColor: codeError ? "hsl(var(--destructive))" : "hsl(var(--border))", fontFamily: "monospace", background: "hsl(var(--muted) / 0.3)" }}
                placeholder="000000"
                maxLength={6}
                value={code}
                onChange={e => { setCode(e.target.value.replace(/\D/g, "")); setCodeError(""); }}
                onFocus={e => !codeError && (e.target.style.borderColor = "hsl(var(--orange))")}
                onBlur={e => !codeError && (e.target.style.borderColor = "hsl(var(--border))")}
              />
              {codeError && <p className="text-xs text-destructive mb-3">{codeError}</p>}
              <button onClick={enterQuiz} className="btn-primary w-full justify-center mt-3">
                Join Quiz <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-muted-foreground mt-3">Try demo code: <strong>123456</strong></p>
            </div>
          </div>
        )}

        {/* Rules */}
        {state === "rules" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Quiz Rules</h2>
              <p className="text-sm text-muted-foreground">Read carefully before starting</p>
            </div>
            <div className="bg-card rounded-2xl p-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: "Questions", value: "20 MCQs" },
                  { label: "Duration", value: "10 Minutes" },
                  { label: "Auto Submit", value: "On Timeout" },
                  { label: "Result", value: "Immediate" },
                ].map((s, i) => (
                  <div key={i} className="p-3 rounded-xl text-center" style={{ background: "hsl(var(--muted))" }}>
                    <div className="text-sm font-bold text-foreground">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl mb-5" style={{ background: "hsl(var(--destructive) / 0.06)", border: "1px solid hsl(var(--destructive) / 0.2)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4" style={{ color: "hsl(var(--destructive))" }} />
                  <span className="text-sm font-bold" style={{ color: "hsl(var(--destructive))" }}>Anti-Cheating Active</span>
                </div>
                <ul className="text-xs space-y-1" style={{ color: "hsl(var(--destructive))" }}>
                  <li>• Right-click is disabled during quiz</li>
                  <li>• Copy/Paste keyboard shortcuts are blocked</li>
                  <li>• Tab switching is monitored (3 violations = auto submit)</li>
                  <li>• Quiz auto-submits when timer expires</li>
                </ul>
              </div>
              <div className="p-3 rounded-xl mb-5" style={{ background: "hsl(var(--success) / 0.07)", border: "1px solid hsl(var(--success) / 0.2)" }}>
                <div className="flex items-center gap-2 text-sm" style={{ color: "hsl(var(--success))" }}>
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Score ≥ 16/20 → Attendance marked Present</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={startQuiz} className="btn-primary flex-1 justify-center">
                  <Maximize className="w-4 h-4" /> Start Quiz
                </button>
                <button onClick={() => setState("enter-code")} className="btn-navy flex-1 justify-center">
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Quiz */}
        {state === "active" && (
          <div className="space-y-4 select-none" style={{ userSelect: "none" }}>
            {/* Header */}
            <div className="bg-card rounded-2xl p-4 flex items-center justify-between" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="text-sm font-medium text-muted-foreground">
                Question <span className="font-bold text-foreground">{currentQ + 1}</span>/20
              </div>
              <div className="flex items-center gap-3">
                {violationMsg && (
                  <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ background: "hsl(var(--warning) / 0.15)", color: "hsl(var(--orange-dark))" }}>
                    {violationMsg}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: isUrgent ? "hsl(var(--destructive))" : "hsl(var(--success))" }} />
                  <span className="font-bold text-lg font-mono" style={{ color: isUrgent ? "hsl(var(--destructive))" : "hsl(var(--foreground))" }}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentQ + 1) / 20) * 100}%` }} />
            </div>

            {/* Question */}
            <div className="bg-card rounded-2xl p-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="text-base font-bold text-foreground mb-5">
                {currentQ + 1}. {sampleQuestions[currentQ].q}
              </h3>
              <div className="space-y-3">
                {sampleQuestions[currentQ].opts.map((opt, j) => {
                  const selected = answers[currentQ] === j;
                  return (
                    <button key={j} onClick={() => setAnswers(prev => ({ ...prev, [currentQ]: j }))}
                      className="w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all"
                      style={{
                        borderColor: selected ? "hsl(var(--orange))" : "hsl(var(--border))",
                        background: selected ? "hsl(var(--orange) / 0.08)" : "hsl(var(--card))",
                        color: selected ? "hsl(var(--orange-dark))" : "hsl(var(--foreground))",
                      }}>
                      <span className="inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-bold mr-3"
                        style={{ background: selected ? "hsl(var(--orange))" : "hsl(var(--muted))", color: selected ? "hsl(var(--navy-dark))" : "hsl(var(--muted-foreground))" }}>
                        {String.fromCharCode(65 + j)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <button onClick={() => setCurrentQ(p => Math.max(0, p - 1))} disabled={currentQ === 0}
                className="btn-navy flex-1 justify-center disabled:opacity-50">← Prev</button>
              {currentQ < 19 ? (
                <button onClick={() => setCurrentQ(p => p + 1)} className="btn-primary flex-1 justify-center">Next →</button>
              ) : (
                <button onClick={() => handleSubmit(false)} className="btn-primary flex-1 justify-center">
                  <CheckCircle className="w-4 h-4" /> Submit Quiz
                </button>
              )}
            </div>

            {/* Question Navigator */}
            <div className="bg-card rounded-2xl p-4" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="text-xs font-semibold text-muted-foreground mb-3">Question Navigator</div>
              <div className="flex flex-wrap gap-2">
                {sampleQuestions.map((_, i) => (
                  <button key={i} onClick={() => setCurrentQ(i)}
                    className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: i === currentQ ? "hsl(var(--orange))" : answers[i] !== undefined ? "hsl(var(--success) / 0.15)" : "hsl(var(--muted))",
                      color: i === currentQ ? "hsl(var(--navy-dark))" : answers[i] !== undefined ? "hsl(var(--success))" : "hsl(var(--muted-foreground))",
                    }}>
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: "hsl(var(--success) / 0.15)" }} /> Answered ({Object.keys(answers).length})</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: "hsl(var(--muted))" }} /> Unanswered ({20 - Object.keys(answers).length})</span>
              </div>
            </div>
          </div>
        )}

        {/* Result / Violation */}
        {(state === "submitted" || state === "violation") && (
          <div className="space-y-6">
            {state === "violation" && (
              <div className="flex items-center gap-3 p-4 rounded-2xl"
                style={{ background: "hsl(var(--destructive) / 0.1)", border: "1px solid hsl(var(--destructive) / 0.3)" }}>
                <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: "hsl(var(--destructive))" }} />
                <div>
                  <div className="text-sm font-bold" style={{ color: "hsl(var(--destructive))" }}>Quiz Auto-Submitted</div>
                  <div className="text-xs" style={{ color: "hsl(var(--destructive))" }}>Too many tab switching violations detected.</div>
                </div>
              </div>
            )}
            <div className="bg-card rounded-2xl p-8 text-center" style={{ boxShadow: "var(--shadow-elevated)" }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: score >= 16 ? "hsl(var(--success) / 0.12)" : "hsl(var(--destructive) / 0.1)" }}>
                <span className="text-3xl font-black" style={{ color: score >= 16 ? "hsl(var(--success))" : "hsl(var(--destructive))" }}>
                  {score}
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">Quiz Complete!</h3>
              <p className="text-sm text-muted-foreground mb-5">{score} out of 20 correct</p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-xl" style={{ background: "hsl(var(--muted))" }}>
                  <div className="text-lg font-bold text-foreground">{score}/20</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
                <div className="p-3 rounded-xl" style={{ background: score >= 16 ? "hsl(var(--success) / 0.1)" : "hsl(var(--destructive) / 0.1)" }}>
                  <div className="text-lg font-bold" style={{ color: score >= 16 ? "hsl(var(--success))" : "hsl(var(--destructive))" }}>
                    {score >= 16 ? "Present" : "Absent"}
                  </div>
                  <div className="text-xs text-muted-foreground">Attendance</div>
                </div>
                <div className="p-3 rounded-xl" style={{ background: score >= 12 ? "hsl(var(--success) / 0.1)" : "hsl(var(--destructive) / 0.1)" }}>
                  <div className="text-lg font-bold" style={{ color: score >= 12 ? "hsl(var(--success))" : "hsl(var(--destructive))" }}>
                    {score >= 12 ? "Pass" : "Fail"}
                  </div>
                  <div className="text-xs text-muted-foreground">Result</div>
                </div>
              </div>

              <div className="p-3 rounded-xl mb-5" style={{ background: score >= 16 ? "hsl(var(--success) / 0.08)" : "hsl(var(--warning) / 0.08)" }}>
                <p className="text-sm font-medium" style={{ color: score >= 16 ? "hsl(var(--success))" : "hsl(var(--orange-dark))" }}>
                  {score >= 16 ? "✅ Attendance automatically marked Present!" : "❌ Score below threshold. Attendance marked Absent."}
                </p>
              </div>

              <button onClick={() => { setState("enter-code"); setCode(""); setAnswers({}); setCurrentQ(0); setTimeLeft(600); setViolations(0); setViolationMsg(""); }}
                className="btn-primary mx-auto">
                <RotateCcw className="w-4 h-4" /> Attempt Another Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
