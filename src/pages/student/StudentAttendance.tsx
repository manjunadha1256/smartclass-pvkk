import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";

const subjectAttendance = [
  { subject: "Data Structures", faculty: "Prof. Ravi Shankar", classes: 45, attended: 40, pct: 89 },
  { subject: "Mathematics", faculty: "Dr. Priya Nair", classes: 38, attended: 30, pct: 79 },
  { subject: "Physics", faculty: "Prof. Suresh Kumar", classes: 32, attended: 22, pct: 69 },
  { subject: "DBMS", faculty: "Dr. Kavitha Reddy", classes: 28, attended: 26, pct: 93 },
  { subject: "Networks", faculty: "Prof. Ravi Shankar", classes: 30, attended: 25, pct: 83 },
];

export default function StudentAttendance() {
  const totalClasses = subjectAttendance.reduce((s, a) => s + a.classes, 0);
  const totalAttended = subjectAttendance.reduce((s, a) => s + a.attended, 0);
  const overall = Math.round((totalAttended / totalClasses) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold text-foreground">Attendance Report</h2>
          <p className="text-sm text-muted-foreground">Your attendance across all subjects</p>
        </div>

        <div className="bg-card rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none"
                stroke={overall >= 75 ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                strokeWidth="3"
                strokeDasharray={`${overall} ${100 - overall}`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-foreground">{overall}%</span>
              <span className="text-xs text-muted-foreground">Overall</span>
            </div>
          </div>
          <div className="flex-1 space-y-2 w-full">
            <h3 className="font-bold text-foreground">Overall Attendance</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total Classes", value: totalClasses },
                { label: "Attended", value: totalAttended },
                { label: "Absent", value: totalClasses - totalAttended },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: "hsl(var(--muted))" }}>
                  <div className="text-lg font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
            <div className={`flex items-center gap-2 text-sm font-medium p-2 rounded-lg ${overall >= 75 ? "" : ""}`}
              style={{ color: overall >= 75 ? "hsl(var(--success))" : "hsl(var(--destructive))" }}>
              {overall >= 75
                ? <><CheckCircle className="w-4 h-4" /> Eligible for examinations (≥75%)</>
                : <><AlertCircle className="w-4 h-4" /> Below required 75% — Not eligible</>}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {subjectAttendance.map((s, i) => (
            <div key={i} className="bg-card rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-foreground text-sm">{s.subject}</h4>
                  <p className="text-xs text-muted-foreground">{s.faculty}</p>
                </div>
                <div className="flex items-center gap-2">
                  {s.pct >= 75
                    ? <span className="badge-success">Eligible</span>
                    : s.pct >= 65
                      ? <span className="badge-warning">At Risk</span>
                      : <span className="badge-danger">Detained</span>}
                  <span className="text-lg font-black" style={{ color: s.pct >= 75 ? "hsl(var(--success))" : "hsl(var(--destructive))" }}>
                    {s.pct}%
                  </span>
                </div>
              </div>
              <div className="progress-bar mb-2">
                <div className={`progress-fill ${s.pct >= 75 ? "success" : "danger"}`} style={{ width: `${s.pct}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{s.attended} attended</span>
                <span>{s.classes - s.attended} absent</span>
                <span>{s.classes} total classes</span>
              </div>
              {s.pct < 75 && (
                <div className="mt-3 p-2.5 rounded-lg text-xs" style={{ background: "hsl(var(--warning) / 0.1)", color: "hsl(var(--orange-dark))" }}>
                  <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                  Need {Math.ceil((75 * s.classes - 100 * s.attended) / 25)} more classes to reach 75%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
