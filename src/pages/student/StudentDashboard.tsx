import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import {
  MessageSquare, Brain, ClipboardList, CreditCard, BarChart3,
  BookOpen, TrendingUp, CheckCircle, Clock, AlertCircle, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const subjectAttendance = [
  { subject: "Data Structures", classes: 45, attended: 40, pct: 89 },
  { subject: "Mathematics", classes: 38, attended: 30, pct: 79 },
  { subject: "Physics", classes: 32, attended: 22, pct: 69 },
  { subject: "DBMS", classes: 28, attended: 26, pct: 93 },
  { subject: "Networks", classes: 30, attended: 25, pct: 83 },
];

const recentMessages = [
  { faculty: "Prof. Ravi", subject: "Data Structures", msg: "Please complete Chapter 5 before next class.", time: "1 hr ago" },
  { faculty: "Dr. Priya", subject: "Mathematics", msg: "Assignment submission deadline extended to Friday.", time: "3 hrs ago" },
  { faculty: "Prof. Suresh", subject: "Physics", msg: "Lab report submission tomorrow.", time: "Yesterday" },
];

const quizResults = [
  { subject: "Data Structures", score: 18, total: 20, date: "Feb 14", status: "present" },
  { subject: "Mathematics", score: 14, total: 20, date: "Feb 12", status: "absent" },
  { subject: "Networks", score: 17, total: 20, date: "Feb 10", status: "present" },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const totalClasses = subjectAttendance.reduce((s, a) => s + a.classes, 0);
  const totalAttended = subjectAttendance.reduce((s, a) => s + a.attended, 0);
  const overallPct = Math.round((totalAttended / totalClasses) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Banner */}
        <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: "var(--gradient-navy)" }}>
          <div className="relative z-10">
            <div className="text-xs opacity-60 mb-1 uppercase tracking-wider">Student Dashboard</div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-sm opacity-70 mt-0.5">
              {user?.year} Year · {user?.branch} · Section {user?.section} · Roll: {user?.rollNumber}
            </p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => navigate("/student/quiz")} className="btn-primary text-sm py-2">
                <Brain className="w-4 h-4" /> Join Quiz
              </button>
              <button onClick={() => navigate("/student/fees")} className="btn-primary text-sm py-2">
                <CreditCard className="w-4 h-4" /> Pay Fees
              </button>
            </div>
          </div>
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-5" style={{ background: "hsl(var(--orange))" }} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Overall Attendance", value: `${overallPct}%`, icon: ClipboardList, status: overallPct >= 75 ? "success" : "danger" },
            { label: "Quizzes Taken", value: "8", icon: Brain, status: "info" },
            { label: "Avg. Score", value: "16.4", icon: BarChart3, status: "success" },
            { label: "Fee Pending", value: "₹8,500", icon: CreditCard, status: "warning" },
          ].map(s => {
            const Icon = s.icon;
            const colorMap: Record<string, string> = {
              success: "hsl(var(--success))", danger: "hsl(var(--destructive))",
              info: "hsl(var(--info))", warning: "hsl(var(--orange))"
            };
            return (
              <div key={s.label} className="stat-card">
                <Icon className="w-5 h-5 mb-3" style={{ color: colorMap[s.status] }} />
                <div className="text-2xl font-bold" style={{ color: colorMap[s.status] }}>{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Attendance by Subject */}
          <div className="bg-card rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <ClipboardList className="w-4 h-4" style={{ color: "hsl(var(--orange))" }} />
                Subject-wise Attendance
              </h3>
              <button onClick={() => navigate("/student/attendance")} className="text-xs font-medium" style={{ color: "hsl(var(--orange))" }}>
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {subjectAttendance.map(s => (
                <div key={s.subject}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">{s.subject}</span>
                    <span className="text-xs font-bold" style={{ color: s.pct >= 75 ? "hsl(var(--success))" : "hsl(var(--destructive))" }}>
                      {s.attended}/{s.classes} ({s.pct}%)
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className={`progress-fill ${s.pct >= 75 ? "success" : "danger"}`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl" style={{ background: overallPct >= 75 ? "hsl(var(--success) / 0.08)" : "hsl(var(--destructive) / 0.06)" }}>
              <div className="flex items-center gap-2 text-sm font-medium">
                {overallPct >= 75
                  ? <><CheckCircle className="w-4 h-4" style={{ color: "hsl(var(--success))" }} /><span style={{ color: "hsl(var(--success))" }}>Overall: {overallPct}% — Eligible for exams ✓</span></>
                  : <><AlertCircle className="w-4 h-4" style={{ color: "hsl(var(--destructive))" }} /><span style={{ color: "hsl(var(--destructive))" }}>Overall: {overallPct}% — Below required 75%</span></>}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-card rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4" style={{ color: "hsl(var(--orange))" }} />
                Faculty Messages
              </h3>
              <button onClick={() => navigate("/student/messages")} className="text-xs font-medium" style={{ color: "hsl(var(--orange))" }}>
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {recentMessages.map((m, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: "hsl(var(--muted) / 0.5)" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: "hsl(var(--navy))" }}>{m.faculty}</span>
                    <span className="text-xs text-muted-foreground">{m.time}</span>
                  </div>
                  <span className="badge-info text-xs mb-1">{m.subject}</span>
                  <p className="text-xs text-foreground mt-1">{m.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quiz Results */}
        <div className="bg-card rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Brain className="w-4 h-4" style={{ color: "hsl(var(--orange))" }} />
              Recent Quiz Results
            </h3>
            <button onClick={() => navigate("/student/results")} className="text-xs font-medium" style={{ color: "hsl(var(--orange))" }}>
              All Results →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Score</th>
                  <th>Date</th>
                  <th>Attendance</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {quizResults.map((r, i) => (
                  <tr key={i}>
                    <td><span className="font-medium text-foreground text-sm">{r.subject}</span></td>
                    <td>
                      <span className="font-bold text-sm">{r.score}/{r.total}</span>
                      <div className="progress-bar w-20 mt-1">
                        <div className={`progress-fill ${r.score >= 16 ? "success" : ""}`} style={{ width: `${(r.score / r.total) * 100}%` }} />
                      </div>
                    </td>
                    <td className="text-sm text-muted-foreground">{r.date}</td>
                    <td>{r.status === "present" ? <span className="badge-success">Present</span> : <span className="badge-danger">Absent</span>}</td>
                    <td>{r.score >= 12 ? <span className="badge-success">Pass</span> : <span className="badge-danger">Fail</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Join Quiz", icon: Brain, path: "/student/quiz", desc: "Enter quiz code" },
            { label: "Pay Fees", icon: CreditCard, path: "/student/fees", desc: "View & pay dues" },
            { label: "Attendance", icon: ClipboardList, path: "/student/attendance", desc: "Subject-wise report" },
            { label: "My Results", icon: BarChart3, path: "/student/results", desc: "Marks & pass/fail" },
          ].map((a, i) => {
            const Icon = a.icon;
            return (
              <button key={i} onClick={() => navigate(a.path)} className="stat-card text-left group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: "hsl(var(--orange) / 0.1)" }}>
                  <Icon className="w-5 h-5" style={{ color: "hsl(var(--orange))" }} />
                </div>
                <div className="text-sm font-bold text-foreground">{a.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{a.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
