import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Trophy, CheckCircle, XCircle } from "lucide-react";

const results = [
  { subject: "Data Structures", quizDate: "Feb 14, 2025", score: 18, total: 20, attendance: "Present", result: "Pass" },
  { subject: "Mathematics", quizDate: "Feb 12, 2025", score: 14, total: 20, attendance: "Absent", result: "Fail" },
  { subject: "Networks", quizDate: "Feb 10, 2025", score: 17, total: 20, attendance: "Present", result: "Pass" },
  { subject: "DBMS", quizDate: "Feb 7, 2025", score: 19, total: 20, attendance: "Present", result: "Pass" },
  { subject: "Physics", quizDate: "Feb 5, 2025", score: 11, total: 20, attendance: "Absent", result: "Fail" },
  { subject: "Data Structures", quizDate: "Jan 28, 2025", score: 16, total: 20, attendance: "Present", result: "Pass" },
  { subject: "Mathematics", quizDate: "Jan 24, 2025", score: 15, total: 20, attendance: "Absent", result: "Pass" },
  { subject: "DBMS", quizDate: "Jan 20, 2025", score: 18, total: 20, attendance: "Present", result: "Pass" },
];

export default function StudentResults() {
  const avgScore = (results.reduce((s, r) => s + r.score, 0) / results.length).toFixed(1);
  const passes = results.filter(r => r.result === "Pass").length;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold text-foreground">Quiz Results</h2>
          <p className="text-sm text-muted-foreground">All your quiz scores and attendance</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Avg. Score", value: `${avgScore}/20`, color: "orange" },
            { label: "Pass Rate", value: `${Math.round((passes / results.length) * 100)}%`, color: "success" },
            { label: "Quizzes Taken", value: results.length.toString(), color: "navy" },
          ].map(s => (
            <div key={s.label} className="stat-card text-center">
              <div className="text-2xl font-bold mb-1" style={{
                color: s.color === "orange" ? "hsl(var(--orange))" : s.color === "success" ? "hsl(var(--success))" : "hsl(var(--navy))"
              }}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Quiz Date</th>
                  <th>Score</th>
                  <th>Performance</th>
                  <th>Attendance</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i}>
                    <td><span className="font-medium text-foreground text-sm">{r.subject}</span></td>
                    <td className="text-sm text-muted-foreground">{r.quizDate}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{r.score}/20</span>
                        <div className="progress-bar w-16">
                          <div className={`progress-fill ${r.score >= 16 ? "success" : ""}`} style={{ width: `${(r.score / 20) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 10 }).map((_, j) => (
                          <div key={j} className="w-1.5 h-4 rounded-sm"
                            style={{ background: j < Math.round(r.score / 2) ? (r.score >= 16 ? "hsl(var(--success))" : "hsl(var(--orange))") : "hsl(var(--muted))" }} />
                        ))}
                      </div>
                    </td>
                    <td>
                      {r.attendance === "Present"
                        ? <span className="badge-success">Present</span>
                        : <span className="badge-danger">Absent</span>}
                    </td>
                    <td>
                      {r.result === "Pass"
                        ? <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "hsl(var(--success))" }}><CheckCircle className="w-3.5 h-3.5" /> Pass</div>
                        : <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "hsl(var(--destructive))" }}><XCircle className="w-3.5 h-3.5" /> Fail</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
