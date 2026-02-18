import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import {
  UserPlus, Save, Eye, EyeOff, CheckCircle, ArrowLeft,
  Search, Trash2, Edit, GraduationCap, Phone, Mail, MapPin
} from "lucide-react";

interface Faculty {
  id: string;
  name: string;
  subject: string;
  section: string;
  email: string;
  mobile: string;
  address: string;
}

const demoFaculty: Faculty[] = [
  { id: "1", name: "Prof. Ravi Shankar", subject: "Data Structures", section: "CSE-A", email: "ravi@pvkk.edu", mobile: "9876543210", address: "Kurnool, AP" },
  { id: "2", name: "Dr. Priya Nair", subject: "Mathematics", section: "ECE-B", email: "priya@pvkk.edu", mobile: "9876543211", address: "Hyderabad, TS" },
  { id: "3", name: "Prof. Suresh Kumar", subject: "Physics", section: "MECH-A", email: "suresh@pvkk.edu", mobile: "9876543212", address: "Vijayawada, AP" },
  { id: "4", name: "Dr. Kavitha Reddy", subject: "DBMS", section: "CSE-C", email: "kavitha@pvkk.edu", mobile: "9876543213", address: "Guntur, AP" },
];

export default function AddFaculty() {
  const [view, setView] = useState<"list" | "add">("list");
  const [showPwd, setShowPwd] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");
  const [facultyList, setFacultyList] = useState<Faculty[]>(demoFaculty);
  const [form, setForm] = useState({ name: "", subject: "", section: "", email: "", password: "", mobile: "", address: "" });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    const newFaculty: Faculty = { ...form, id: Date.now().toString() };
    setFacultyList(prev => [newFaculty, ...prev]);
    setSaved(true);
    setTimeout(() => { setSaved(false); setView("list"); setForm({ name: "", subject: "", section: "", email: "", password: "", mobile: "", address: "" }); }, 2000);
  };

  const filtered = facultyList.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.subject.toLowerCase().includes(search.toLowerCase()) ||
    f.section.toLowerCase().includes(search.toLowerCase())
  );

  const sections = ["CSE-A", "CSE-B", "CSE-C", "ECE-A", "ECE-B", "MECH-A", "MECH-B", "CIVIL-A"];
  const subjects = ["Data Structures", "Mathematics", "Physics", "DBMS", "Networks", "Operating Systems", "Algorithms", "Software Engineering"];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Faculty Management</h2>
            <p className="text-sm text-muted-foreground">{facultyList.length} faculty members registered</p>
          </div>
          <button onClick={() => setView(view === "list" ? "add" : "list")} className="btn-primary">
            {view === "list" ? <><UserPlus className="w-4 h-4" /> Add Faculty</> : <><ArrowLeft className="w-4 h-4" /> Back to List</>}
          </button>
        </div>

        {view === "add" ? (
          <div className="bg-card rounded-2xl p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <h3 className="font-bold text-foreground mb-5 flex items-center gap-2">
              <UserPlus className="w-5 h-5" style={{ color: "hsl(var(--orange))" }} />
              Register New Faculty
            </h3>
            {saved && (
              <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm font-medium"
                style={{ background: "hsl(var(--success) / 0.1)", color: "hsl(var(--success))" }}>
                <CheckCircle className="w-4 h-4" /> Faculty registered successfully!
              </div>
            )}
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Full Name *", key: "name", placeholder: "e.g. Prof. John Doe" },
                { label: "Email Address *", key: "email", placeholder: "john@pvkk.edu" },
                { label: "Mobile Number", key: "mobile", placeholder: "10-digit mobile number" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">{f.label}</label>
                  <input
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                    style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted) / 0.3)" }}
                    placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    onFocus={e => (e.target.style.borderColor = "hsl(var(--orange))")}
                    onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")}
                  />
                </div>
              ))}

              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Subject</label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
                  value={form.subject}
                  onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}>
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Assigned Section</label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
                  value={form.section}
                  onChange={e => setForm(prev => ({ ...prev, section: e.target.value }))}>
                  <option value="">Select Section</option>
                  {sections.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border text-sm outline-none"
                    style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted) / 0.3)" }}
                    placeholder="Set login password"
                    value={form.password}
                    onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                    onFocus={e => (e.target.style.borderColor = "hsl(var(--orange))")}
                    onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Address</label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none"
                  style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted) / 0.3)" }}
                  placeholder="Full address"
                  value={form.address}
                  onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = "hsl(var(--orange))")}
                  onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")}
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="btn-primary">
                  <Save className="w-4 h-4" /> Register Faculty
                </button>
                <button type="button" onClick={() => setView("list")} className="btn-navy">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-card rounded-2xl" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="p-5 border-b border-border flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted) / 0.3)" }}
                  placeholder="Search by name, subject, or section..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = "hsl(var(--orange))")}
                  onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")}
                />
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">{filtered.length} results</span>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Faculty</th>
                    <th>Subject</th>
                    <th>Section</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(f => (
                    <tr key={f.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: "hsl(var(--navy) / 0.1)", color: "hsl(var(--navy))" }}>
                            {f.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground text-sm">{f.name}</div>
                            <div className="text-xs text-muted-foreground">{f.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge-info">{f.subject}</span></td>
                      <td><span className="badge-warning">{f.section}</span></td>
                      <td>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3" /> {f.mobile}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
                          <button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" style={{ color: "hsl(var(--destructive))" }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
