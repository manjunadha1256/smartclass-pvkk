import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CreditCard, Plus, CheckCircle, Clock, AlertCircle, Download, DollarSign, TrendingUp } from "lucide-react";

const feeStructure = [
  { category: "Tuition Fee", year1: 45000, year2: 48000, year3: 50000, year4: 52000 },
  { category: "Exam Fee", year1: 3000, year2: 3000, year3: 3500, year4: 3500 },
  { category: "Transport Fee", year1: 8000, year2: 8000, year3: 8000, year4: 8000 },
  { category: "Hostel Fee", year1: 30000, year2: 30000, year3: 30000, year4: 30000 },
  { category: "Lab Fee", year1: 5000, year2: 6000, year3: 6000, year4: 4000 },
];

const recentPayments = [
  { name: "Arjun Reddy", roll: "22CS001", amount: 42000, date: "Feb 14, 2025", status: "success", txnId: "TXN2025001" },
  { name: "Sneha Patel", roll: "23EC021", amount: 38000, date: "Feb 13, 2025", status: "success", txnId: "TXN2025002" },
  { name: "Rahul Sharma", roll: "21ME007", amount: 0, date: "—", status: "pending", txnId: "—" },
  { name: "Divya Krishna", roll: "20CV003", amount: 52000, date: "Feb 12, 2025", status: "success", txnId: "TXN2025003" },
  { name: "Kiran Rao", roll: "21ME012", amount: 15000, date: "Jan 30, 2025", status: "partial", txnId: "TXN2025004" },
];

export default function FeeManagement() {
  const [activeTab, setActiveTab] = useState<"structure" | "payments" | "reports">("payments");

  const totals = feeStructure.map(f => ({ ...f, total: f.year1 + f.year2 + f.year3 + f.year4 }));
  const grandTotal = (year: number) => feeStructure.reduce((sum, f) => sum + (f as any)[`year${year}`], 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Fee Management</h2>
            <p className="text-sm text-muted-foreground">Digital billing & payment tracking</p>
          </div>
          <button className="btn-primary"><Plus className="w-4 h-4" /> Add Fee Structure</button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Expected", value: "₹31.2L", icon: DollarSign, color: "navy" },
            { label: "Collected", value: "₹24.8L", icon: CheckCircle, color: "success" },
            { label: "Pending", value: "₹6.4L", icon: Clock, color: "warning" },
            { label: "Defaulters", value: "23", icon: AlertCircle, color: "destructive" },
          ].map(s => {
            const Icon = s.icon;
            const colorMap: Record<string, string> = {
              navy: "hsl(var(--navy))", success: "hsl(var(--success))",
              warning: "hsl(var(--orange))", destructive: "hsl(var(--destructive))"
            };
            return (
              <div key={s.label} className="stat-card">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5" style={{ color: colorMap[s.color] }} />
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "hsl(var(--muted))" }}>
          {[
            { key: "payments", label: "Payment Records" },
            { key: "structure", label: "Fee Structure" },
            { key: "reports", label: "Reports" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.key ? "hsl(var(--card))" : "transparent",
                color: activeTab === tab.key ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                boxShadow: activeTab === tab.key ? "var(--shadow-card)" : "none",
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "payments" && (
          <div className="bg-card rounded-2xl" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="p-5 border-b border-border">
              <h3 className="font-bold text-foreground">Recent Payments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Amount Paid</th>
                    <th>Date</th>
                    <th>Transaction ID</th>
                    <th>Status</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((p, i) => (
                    <tr key={i}>
                      <td>
                        <div className="font-semibold text-foreground text-sm">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.roll}</div>
                      </td>
                      <td>
                        <span className="font-bold text-sm">
                          {p.amount > 0 ? `₹${p.amount.toLocaleString()}` : "—"}
                        </span>
                      </td>
                      <td className="text-sm text-muted-foreground">{p.date}</td>
                      <td><span className="font-mono text-xs">{p.txnId}</span></td>
                      <td>
                        {p.status === "success" && <span className="badge-success">Paid</span>}
                        {p.status === "pending" && <span className="badge-danger">Pending</span>}
                        {p.status === "partial" && <span className="badge-warning">Partial</span>}
                      </td>
                      <td>
                        {p.status !== "pending" && (
                          <button className="flex items-center gap-1 text-xs font-medium" style={{ color: "hsl(var(--orange))" }}>
                            <Download className="w-3 h-3" /> PDF
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "structure" && (
          <div className="bg-card rounded-2xl" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="p-5 border-b border-border">
              <h3 className="font-bold text-foreground">Year-wise Fee Structure (Annual)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fee Category</th>
                    <th>1st Year</th>
                    <th>2nd Year</th>
                    <th>3rd Year</th>
                    <th>4th Year</th>
                  </tr>
                </thead>
                <tbody>
                  {feeStructure.map((f, i) => (
                    <tr key={i}>
                      <td><span className="font-semibold text-foreground">{f.category}</span></td>
                      {[f.year1, f.year2, f.year3, f.year4].map((v, j) => (
                        <td key={j} className="text-sm">₹{v.toLocaleString()}</td>
                      ))}
                    </tr>
                  ))}
                  <tr style={{ background: "hsl(var(--navy) / 0.05)" }}>
                    <td><span className="font-bold text-foreground">Total per Year</span></td>
                    {[1, 2, 3, 4].map(y => (
                      <td key={y}><span className="font-bold" style={{ color: "hsl(var(--orange))" }}>₹{grandTotal(y).toLocaleString()}</span></td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {[
              { title: "1st Year Collection", collected: 70, total: "₹2.5L", color: "navy" },
              { title: "2nd Year Collection", collected: 85, total: "₹6.8L", color: "orange" },
              { title: "3rd Year Collection", collected: 60, total: "₹7.1L", color: "success" },
              { title: "4th Year Collection", collected: 92, total: "₹9.3L", color: "info" },
            ].map((r, i) => (
              <div key={i} className="bg-card rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">{r.title}</h4>
                  <span className="text-lg font-bold" style={{ color: "hsl(var(--orange))" }}>{r.total}</span>
                </div>
                <div className="progress-bar mb-2">
                  <div className="progress-fill" style={{ width: `${r.collected}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{r.collected}% collected</span>
                  <span>{100 - r.collected}% pending</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
