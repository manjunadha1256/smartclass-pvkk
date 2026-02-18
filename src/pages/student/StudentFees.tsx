import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CreditCard, CheckCircle, Clock, AlertCircle, Download, Shield, Smartphone, Globe, Plus, X } from "lucide-react";

const feeDetails = [
  { category: "Tuition Fee", total: 48000, paid: 48000, due: "Paid" },
  { category: "Exam Fee", total: 3000, paid: 3000, due: "Paid" },
  { category: "Transport Fee", total: 8000, paid: 0, due: "Mar 1, 2025" },
  { category: "Lab Fee", total: 6000, paid: 6000, due: "Paid" },
  { category: "Other Charges", total: 2000, paid: 0, due: "Mar 15, 2025" },
];

const paymentHistory = [
  { desc: "Tuition Fee - Sem 1", amount: 24000, date: "Aug 10, 2024", txnId: "TXN2024001", method: "UPI", status: "success" },
  { desc: "Tuition Fee - Sem 2", amount: 24000, date: "Jan 12, 2025", txnId: "TXN2025001", method: "Net Banking", status: "success" },
  { desc: "Exam Fee", amount: 3000, date: "Jan 20, 2025", txnId: "TXN2025002", method: "Card", status: "success" },
  { desc: "Lab Fee", amount: 6000, date: "Feb 2, 2025", txnId: "TXN2025003", method: "UPI", status: "success" },
];

type PaymentView = "dashboard" | "pay";

export default function StudentFees() {
  const [view, setView] = useState<PaymentView>("dashboard");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedFee, setSelectedFee] = useState<string>("");

  const totalFee = feeDetails.reduce((s, f) => s + f.total, 0);
  const paidFee = feeDetails.reduce((s, f) => s + f.paid, 0);
  const pendingFee = totalFee - paidFee;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setSuccess(true); }, 2500);
  };

  if (success) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto mt-8 animate-scale-in">
          <div className="bg-card rounded-2xl p-8 text-center" style={{ boxShadow: "var(--shadow-elevated)" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "hsl(var(--success) / 0.12)" }}>
              <CheckCircle className="w-8 h-8" style={{ color: "hsl(var(--success))" }} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1">Payment Successful!</h3>
            <p className="text-sm text-muted-foreground mb-5">Your payment has been processed.</p>
            <div className="p-4 rounded-xl mb-5 text-left space-y-2" style={{ background: "hsl(var(--muted))" }}>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono font-bold text-foreground">TXN{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-foreground">₹{selectedFee === "transport" ? "8,000" : "2,000"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="badge-success">Success</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn-primary flex-1 justify-center">
                <Download className="w-4 h-4" /> Download Receipt
              </button>
              <button onClick={() => { setSuccess(false); setView("dashboard"); }} className="btn-navy flex-1 justify-center">
                Back
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Fee Payment</h2>
            <p className="text-sm text-muted-foreground">View and pay your college fees online</p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Fee", value: `₹${totalFee.toLocaleString()}`, icon: CreditCard, color: "navy" },
            { label: "Amount Paid", value: `₹${paidFee.toLocaleString()}`, icon: CheckCircle, color: "success" },
            { label: "Pending", value: `₹${pendingFee.toLocaleString()}`, icon: Clock, color: pendingFee > 0 ? "warning" : "success" },
          ].map(s => {
            const Icon = s.icon;
            const colorMap: Record<string, string> = { navy: "hsl(var(--navy))", success: "hsl(var(--success))", warning: "hsl(var(--orange))" };
            return (
              <div key={s.label} className="stat-card text-center">
                <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: colorMap[s.color] }} />
                <div className="text-xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Fee Breakdown */}
        <div className="bg-card rounded-2xl" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-foreground">Fee Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Category</th><th>Total</th><th>Paid</th><th>Pending</th><th>Due Date</th><th>Action</th></tr>
              </thead>
              <tbody>
                {feeDetails.map((f, i) => {
                  const pending = f.total - f.paid;
                  return (
                    <tr key={i}>
                      <td><span className="font-medium text-foreground text-sm">{f.category}</span></td>
                      <td className="text-sm">₹{f.total.toLocaleString()}</td>
                      <td><span className="text-sm font-medium" style={{ color: "hsl(var(--success))" }}>₹{f.paid.toLocaleString()}</span></td>
                      <td>
                        {pending > 0
                          ? <span className="text-sm font-bold" style={{ color: "hsl(var(--destructive))" }}>₹{pending.toLocaleString()}</span>
                          : <span className="badge-success">Cleared</span>}
                      </td>
                      <td className="text-sm text-muted-foreground">{f.due}</td>
                      <td>
                        {pending > 0 && (
                          <button onClick={() => { setSelectedFee(f.category.toLowerCase().replace(" ", "")); setView("pay"); }}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                            style={{ background: "hsl(var(--orange))", color: "hsl(var(--navy-dark))" }}>
                            Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Modal */}
        {view === "pay" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="bg-card rounded-2xl w-full max-w-md p-6 animate-scale-in" style={{ boxShadow: "var(--shadow-elevated)" }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-foreground">Online Payment</h3>
                <button onClick={() => setView("dashboard")} className="p-1.5 rounded-lg hover:bg-muted">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Payment Method */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { key: "upi" as const, label: "UPI", icon: Smartphone },
                  { key: "card" as const, label: "Card", icon: CreditCard },
                  { key: "netbanking" as const, label: "Net Banking", icon: Globe },
                ].map(m => {
                  const Icon = m.icon;
                  const active = paymentMethod === m.key;
                  return (
                    <button key={m.key} onClick={() => setPaymentMethod(m.key)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all"
                      style={{ borderColor: active ? "hsl(var(--orange))" : "hsl(var(--border))", background: active ? "hsl(var(--orange) / 0.07)" : "transparent" }}>
                      <Icon className="w-5 h-5" style={{ color: active ? "hsl(var(--orange))" : "hsl(var(--muted-foreground))" }} />
                      <span className="text-xs font-semibold" style={{ color: active ? "hsl(var(--orange-dark))" : "hsl(var(--muted-foreground))" }}>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handlePay} className="space-y-4">
                {paymentMethod === "upi" && (
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">UPI ID</label>
                    <input className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted) / 0.3)" }}
                      placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)}
                      onFocus={e => (e.target.style.borderColor = "hsl(var(--orange))")}
                      onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")} />
                  </div>
                )}
                {paymentMethod === "card" && (
                  <div className="space-y-3">
                    <input className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted) / 0.3)" }}
                      placeholder="Card Number" maxLength={19}
                      onFocus={e => (e.target.style.borderColor = "hsl(var(--orange))")}
                      onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")} />
                    <div className="grid grid-cols-2 gap-3">
                      <input className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted) / 0.3)" }}
                        placeholder="MM / YY"
                        onFocus={e => (e.target.style.borderColor = "hsl(var(--orange))")}
                        onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")} />
                      <input className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                        style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted) / 0.3)" }}
                        placeholder="CVV" maxLength={3} type="password"
                        onFocus={e => (e.target.style.borderColor = "hsl(var(--orange))")}
                        onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")} />
                    </div>
                  </div>
                )}
                {paymentMethod === "netbanking" && (
                  <select className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
                    <option value="">Select Your Bank</option>
                    {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB", "Bank of Baroda"].map(b => <option key={b}>{b}</option>)}
                  </select>
                )}

                <div className="p-3 rounded-xl flex items-center gap-2" style={{ background: "hsl(var(--muted))" }}>
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">256-bit SSL encrypted payment. Your data is safe.</span>
                </div>

                <button type="submit" disabled={processing} className="btn-primary w-full justify-center">
                  {processing ? "Processing..." : "Pay Securely"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Payment History */}
        <div className="bg-card rounded-2xl" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-foreground">Payment History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Description</th><th>Amount</th><th>Date</th><th>Method</th><th>Txn ID</th><th>Receipt</th></tr>
              </thead>
              <tbody>
                {paymentHistory.map((p, i) => (
                  <tr key={i}>
                    <td className="text-sm font-medium text-foreground">{p.desc}</td>
                    <td><span className="font-bold text-sm">₹{p.amount.toLocaleString()}</span></td>
                    <td className="text-sm text-muted-foreground">{p.date}</td>
                    <td><span className="badge-info">{p.method}</span></td>
                    <td><span className="font-mono text-xs">{p.txnId}</span></td>
                    <td>
                      <button className="flex items-center gap-1 text-xs font-medium" style={{ color: "hsl(var(--orange))" }}>
                        <Download className="w-3 h-3" /> PDF
                      </button>
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
