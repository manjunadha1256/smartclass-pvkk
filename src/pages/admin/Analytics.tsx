import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BarChart3, Users, GraduationCap, TrendingUp, Download } from "lucide-react";

const yearStats = [
  { year: "1st Year", sections: 4, students: 280, avgAttendance: 82, passRate: 91 },
  { year: "2nd Year", sections: 6, students: 480, avgAttendance: 78, passRate: 87 },
  { year: "3rd Year", sections: 5, students: 450, avgAttendance: 73, passRate: 84 },
  { year: "4th Year", sections: 6, students: 600, avgAttendance: 69, passRate: 92 },
];

const topStudents = [
  { name: "Arjun Reddy", roll: "22CS001", section: "CSE-A", avgScore: 19.2, attendance: 96 },
  { name: "Divya Krishna", roll: "20CV003", section: "CIVIL-A", avgScore: 18.8, attendance: 94 },
  { name: "Sneha Patel", roll: "23EC021", section: "ECE-A", avgScore: 18.5, attendance: 91 },
  { name: "Rahul Sharma", roll: "21ME007", section: "MECH-A", avgScore: 17.9, attendance: 88 },
];

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Analytics & Reports</h2>
            <p className="text-sm text-muted-foreground">Pass/Fail lists, attendance reports, and performance</p>
          </div>
          <button className="btn-primary"><Download className="w-4 h-4" /> Export Report</button>
        </div>

        {/* Year-wise Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {yearStats.map(y => (
            <div key={y.year} className="stat-card">
              <div className="text-xs font-bold text-muted-foreground uppercase mb-3">{y.year}</div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Students</span>
                  <span className="text-sm font-bold text-foreground">{y.students}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Attendance</span>
                  <span className="text-sm font-bold" style={{ color: y.avgAttendance >= 75 ? "hsl(var(--success))" : "hsl(var(--orange))" }}>
                    {y.avgAttendance}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Pass Rate</span>
                  <span className="text-sm font-bold" style={{ color: "hsl(var(--success))" }}>{y.passRate}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill success" style={{ width: `${y.passRate}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Top Performers */}
        <div className="bg-card rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: "hsl(var(--orange))" }} />
            Top Performers
          </h3>
          <div className="space-y-3">
            {topStudents.map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: "hsl(var(--muted) / 0.5)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: i === 0 ? "hsl(var(--orange))" : "hsl(var(--muted))", color: i === 0 ? "hsl(var(--navy-dark))" : "hsl(var(--muted-foreground))" }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-foreground">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.roll} · {s.section}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold" style={{ color: "hsl(var(--success))" }}>{s.avgScore}/20</div>
                  <div className="text-xs text-muted-foreground">{s.attendance}% attendance</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pass/Fail Summary */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <h3 className="font-bold text-foreground mb-4">Pass/Fail Distribution</h3>
            {yearStats.map(y => (
              <div key={y.year} className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{y.year}</span>
                  <span>Pass: {y.passRate}% · Fail: {100 - y.passRate}%</span>
                </div>
                <div className="h-5 rounded-full overflow-hidden flex" style={{ background: "hsl(var(--muted))" }}>
                  <div className="h-full transition-all" style={{ width: `${y.passRate}%`, background: "hsl(var(--success))" }} />
                  <div className="h-full flex-1" style={{ background: "hsl(var(--destructive) / 0.4)" }} />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <h3 className="font-bold text-foreground mb-4">Attendance Risk Categories</h3>
            {[
              { label: "Above 75% (Safe)", count: 920, color: "success", pct: 74 },
              { label: "65-75% (At Risk)", count: 215, color: "warning", pct: 17 },
              { label: "Below 65% (Detained)", count: 105, color: "destructive", pct: 9 },
            ].map(r => (
              <div key={r.label} className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: `hsl(var(--${r.color}))` }} />
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground font-medium">{r.label}</span>
                    <span className="text-muted-foreground">{r.count} students</span>
                  </div>
                  <div className="progress-bar">
                    <div className={`progress-fill ${r.color === "success" ? "success" : r.color === "destructive" ? "danger" : ""}`}
                      style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
