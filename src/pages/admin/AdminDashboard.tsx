import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Users, GraduationCap, BookOpen, CreditCard, TrendingUp,
  AlertCircle, CheckCircle, Clock, ChevronRight, UserPlus,
  ClipboardList, BarChart3
} from "lucide-react";

const stats = [
  { label: "Total Students", value: "1,240", change: "+12 this month", icon: GraduationCap, color: "navy" },
  { label: "Faculty Members", value: "68", change: "+3 this month", icon: Users, color: "orange" },
  { label: "Active Sections", value: "21", change: "Across 4 years", icon: BookOpen, color: "success" },
  { label: "Fee Collection", value: "₹24.8L", change: "+8% this semester", icon: CreditCard, color: "info" },
];

const recentActivity = [
  { type: "quiz", text: "Prof. Ravi created AI Quiz for CSE-A", time: "5 min ago", status: "info" },
  { type: "fee", text: "Student Arjun Reddy paid ₹42,000 fee", time: "20 min ago", status: "success" },
  { type: "attendance", text: "Absent alert sent to 8 parents - ECE-B", time: "1 hr ago", status: "warning" },
  { type: "student", text: "5 new students enrolled in 1st Year", time: "2 hrs ago", status: "success" },
  { type: "faculty", text: "Prof. Priya assigned to Mathematics", time: "3 hrs ago", status: "info" },
];

const yearData = [
  { year: "1st Year", sections: 4, subjects: 6, students: 280, fee: "₹6.2L" },
  { year: "2nd Year", sections: 6, subjects: 5, students: 480, fee: "₹8.5L" },
  { year: "3rd Year", sections: 5, subjects: 5, students: 450, fee: "₹7.8L" },
  { year: "4th Year", sections: 6, subjects: 3, students: 600, fee: "₹9.3L" },
];

const defaulters = [
  { name: "Ravi Kumar", roll: "21CS045", year: "3rd", amount: "₹15,000" },
  { name: "Priya Singh", roll: "22EC012", year: "2nd", amount: "₹28,500" },
  { name: "Kiran Rao", roll: "20ME007", year: "4th", amount: "₹9,000" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Banner */}
        <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: "var(--gradient-navy)" }}>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-1">Admin Control Panel</h2>
            <p className="text-sm opacity-70">PVKK Institute of Technology — Full ERP System</p>
            <div className="flex gap-3 mt-4">
              <button className="btn-primary text-sm py-2">
                <UserPlus className="w-4 h-4" /> Add Student
              </button>
              <button className="btn-primary text-sm py-2">
                <Users className="w-4 h-4" /> Add Faculty
              </button>
            </div>
          </div>
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-5" style={{ background: "hsl(var(--orange))" }} />
          <div className="absolute -right-4 -bottom-12 w-32 h-32 rounded-full opacity-10" style={{ background: "hsl(var(--orange))" }} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="stat-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: s.color === "navy" ? "hsl(var(--navy) / 0.1)" :
                        s.color === "orange" ? "hsl(var(--orange) / 0.1)" :
                          s.color === "success" ? "hsl(var(--success) / 0.1)" : "hsl(var(--info) / 0.1)"
                    }}>
                    <Icon className="w-5 h-5" style={{
                      color: s.color === "navy" ? "hsl(var(--navy))" :
                        s.color === "orange" ? "hsl(var(--orange))" :
                          s.color === "success" ? "hsl(var(--success))" : "hsl(var(--info))"
                    }} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs font-medium text-muted-foreground mt-0.5">{s.label}</div>
                <div className="text-xs mt-1" style={{ color: "hsl(var(--success))" }}>{s.change}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Academic Structure */}
          <div className="lg:col-span-2 bg-card rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">Academic Structure</h3>
              <button className="text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-muted transition-colors" style={{ color: "hsl(var(--orange))" }}>
                Manage →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Sections</th>
                    <th>Subjects</th>
                    <th>Students</th>
                    <th>Fee Collected</th>
                  </tr>
                </thead>
                <tbody>
                  {yearData.map(y => (
                    <tr key={y.year}>
                      <td><span className="font-semibold text-foreground">{y.year}</span></td>
                      <td>{y.sections}</td>
                      <td>{y.subjects}</td>
                      <td>
                        <span className="font-medium">{y.students}</span>
                        <div className="progress-bar mt-1 w-24">
                          <div className="progress-fill" style={{ width: `${(y.students / 600) * 100}%` }} />
                        </div>
                      </td>
                      <td><span className="font-semibold" style={{ color: "hsl(var(--success))" }}>{y.fee}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <h3 className="font-bold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{
                      background: a.status === "success" ? "hsl(var(--success))" :
                        a.status === "warning" ? "hsl(var(--orange))" : "hsl(var(--info))"
                    }} />
                  <div className="min-w-0">
                    <p className="text-xs text-foreground leading-snug">{a.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Fee Defaulters */}
          <div className="bg-card rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" style={{ color: "hsl(var(--destructive))" }} />
                <h3 className="font-bold text-foreground">Fee Defaulters</h3>
              </div>
              <span className="badge-danger">3 pending</span>
            </div>
            <div className="space-y-3">
              {defaulters.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "hsl(var(--destructive) / 0.04)" }}>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{d.roll} • {d.year} Year</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold" style={{ color: "hsl(var(--destructive))" }}>{d.amount}</div>
                    <button className="text-xs" style={{ color: "hsl(var(--orange))" }}>Send Notice</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <h3 className="font-bold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "View All Students", icon: GraduationCap, path: "/admin/add-student" },
                { label: "View Faculty List", icon: Users, path: "/admin/add-faculty" },
                { label: "Attendance Report", icon: ClipboardList, path: "/admin/attendance" },
                { label: "Fee Reports", icon: CreditCard, path: "/admin/fees" },
                { label: "Pass/Fail List", icon: CheckCircle, path: "/admin/analytics" },
                { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
              ].map((a, i) => {
                const Icon = a.icon;
                return (
                  <button key={i}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-border hover:border-orange-DEFAULT transition-all text-left group"
                    style={{ borderColor: "hsl(var(--border))" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "hsl(var(--orange))")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "hsl(var(--border))")}>
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(var(--navy))" }} />
                    <span className="text-xs font-medium text-foreground">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
