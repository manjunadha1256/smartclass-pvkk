import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, Users, Clock, MessageSquare, Brain, ClipboardList, ChevronRight, Calendar } from "lucide-react";
import ClassManagement from "./ClassManagement";

const schedule = [
  { time: "09:00 AM", subject: "Data Structures", section: "CSE-A", room: "LH-101", students: 72 },
  { time: "11:00 AM", subject: "Data Structures", section: "CSE-B", room: "LH-203", students: 68 },
  { time: "02:00 PM", subject: "Data Structures", section: "CSE-C", room: "LH-105", students: 75 },
  { time: "04:00 PM", subject: "Algorithm Lab", section: "CSE-A", room: "Lab-01", students: 72 },
];

const classStats = [
  { label: "Today's Classes", value: "4", icon: BookOpen },
  { label: "Total Students", value: "215", icon: Users },
  { label: "Avg. Attendance", value: "87%", icon: ClipboardList },
  { label: "Quizzes Created", value: "12", icon: Brain },
];

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState<typeof schedule[0] | null>(null);

  if (selectedClass) {
    return <ClassManagement classData={selectedClass} onBack={() => setSelectedClass(null)} />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Banner */}
        <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: "var(--gradient-navy)" }}>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "hsl(var(--success))" }} />
              <span className="text-xs opacity-70">Active Session</span>
            </div>
            <h2 className="text-xl font-bold">Welcome, {user?.name}</h2>
            <p className="text-sm opacity-70 mt-0.5">
              {user?.subject} · Section {user?.section} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-5" style={{ background: "hsl(var(--orange))" }} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {classStats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="stat-card">
                <Icon className="w-5 h-5 mb-3" style={{ color: "hsl(var(--orange))" }} />
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Today's Schedule */}
        <div className="bg-card rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: "hsl(var(--orange))" }} />
              Today's Class Schedule
            </h3>
            <span className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="space-y-3">
            {schedule.map((cls, i) => (
              <button
                key={i}
                onClick={() => setSelectedClass(cls)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:border-orange-DEFAULT transition-all group text-left"
                style={{ borderColor: "hsl(var(--border))" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "hsl(var(--orange))")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "hsl(var(--border))")}>
                <div className="flex-shrink-0 text-center">
                  <div className="text-sm font-bold text-foreground">{cls.time.split(" ")[0]}</div>
                  <div className="text-xs text-muted-foreground">{cls.time.split(" ")[1]}</div>
                </div>
                <div className="w-px h-10 rounded-full flex-shrink-0" style={{ background: "hsl(var(--orange))" }} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-sm">{cls.subject}</div>
                  <div className="text-xs text-muted-foreground">Section {cls.section} · {cls.room} · {cls.students} students</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="badge-success hidden sm:inline-flex">Open Class</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-DEFAULT transition-colors"
                    style={{ color: "hsl(var(--muted-foreground))" }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Create AI Quiz", icon: Brain, desc: "Upload PDF & auto-generate questions" },
            { label: "Mark Attendance", icon: ClipboardList, desc: "Manual attendance for today's class" },
            { label: "Send Message", icon: MessageSquare, desc: "Broadcast to all students" },
          ].map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className="stat-card cursor-pointer group" onClick={() => {}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all"
                  style={{ background: "hsl(var(--orange) / 0.1)" }}>
                  <Icon className="w-5 h-5 transition-colors" style={{ color: "hsl(var(--orange))" }} />
                </div>
                <div className="text-sm font-bold text-foreground">{a.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{a.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
