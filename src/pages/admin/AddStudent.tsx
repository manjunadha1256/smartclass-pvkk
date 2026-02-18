import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { UserPlus, Save, Eye, EyeOff, CheckCircle, ArrowLeft, Search, Trash2, Edit } from "lucide-react";

interface Student {
  id: string;
  name: string;
  year: string;
  branch: string;
  section: string;
  rollNumber: string;
  email: string;
  mobile: string;
  parentMobile: string;
  address: string;
}

const demoStudents: Student[] = [
  { id: "1", name: "Arjun Reddy", year: "2nd", branch: "CSE", section: "CSE-A", rollNumber: "22CS001", email: "arjun@pvkk.edu", mobile: "9876501001", parentMobile: "9876501002", address: "Kurnool, AP" },
  { id: "2", name: "Sneha Patel", year: "1st", branch: "ECE", section: "ECE-A", rollNumber: "23EC021", email: "sneha@pvkk.edu", mobile: "9876501003", parentMobile: "9876501004", address: "Hyderabad, TS" },
  { id: "3", name: "Rahul Sharma", year: "3rd", branch: "MECH", section: "MECH-A", rollNumber: "21ME007", email: "rahul@pvkk.edu", mobile: "9876501005", parentMobile: "9876501006", address: "Vijayawada, AP" },
  { id: "4", name: "Divya Krishna", year: "4th", branch: "CIVIL", section: "CIVIL-A", rollNumber: "20CV003", email: "divya@pvkk.edu", mobile: "9876501007", parentMobile: "9876501008", address: "Guntur, AP" },
];

export default function AddStudent() {
  const [view, setView] = useState<"list" | "add">("list");
  const [showPwd, setShowPwd] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<Student[]>(demoStudents);
  const [form, setForm] = useState({ name: "", year: "", branch: "", section: "", rollNumber: "", email: "", password: "", mobile: "", parentMobile: "", address: "" });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStudents(prev => [{ ...form, id: Date.now().toString() }, ...prev]);
    setSaved(true);
    setTimeout(() => { setSaved(false); setView("list"); setForm({ name: "", year: "", branch: "", section: "", rollNumber: "", email: "", password: "", mobile: "", parentMobile: "", address: "" }); }, 2000);
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.branch.toLowerCase().includes(search.toLowerCase())
  );

  const branches = ["CSE", "ECE", "MECH", "CIVIL", "EEE", "IT"];
  const years = ["1st", "2nd", "3rd", "4th"];
  const sections = ["A", "B", "C", "D", "E", "F"];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Student Management</h2>
            <p className="text-sm text-muted-foreground">{students.length} students registered</p>
          </div>
          <button onClick={() => setView(view === "list" ? "add" : "list")} className="btn-primary">
            {view === "list" ? <><UserPlus className="w-4 h-4" /> Add Student</> : <><ArrowLeft className="w-4 h-4" /> Back to List</>}
          </button>
        </div>

        {view === "add" ? (
          <div className="bg-card rounded-2xl p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <h3 className="font-bold text-foreground mb-5 flex items-center gap-2">
              <UserPlus className="w-5 h-5" style={{ color: "hsl(var(--orange))" }} />
              Enroll New Student
            </h3>
            {saved && (
              <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm font-medium"
                style={{ background: "hsl(var(--success) / 0.1)", color: "hsl(var(--success))" }}>
                <CheckCircle className="w-4 h-4" /> Student enrolled successfully!
              </div>
            )}
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Full Name *", key: "name", placeholder: "Student full name" },
                { label: "Roll Number *", key: "rollNumber", placeholder: "e.g. 22CS001" },
                { label: "Email Address *", key: "email", placeholder: "student@pvkk.edu" },
                { label: "Student Mobile", key: "mobile", placeholder: "10-digit mobile" },
                { label: "Parent Mobile", key: "parentMobile", placeholder: "Parent contact" },
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
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Year</label>
                <select className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
                  value={form.year} onChange={e => setForm(prev => ({ ...prev, year: e.target.value }))}>
                  <option value="">Select Year</option>
                  {years.map(y => <option key={y} value={y}>{y} Year</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Branch</label>
                <select className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
                  value={form.branch} onChange={e => setForm(prev => ({ ...prev, branch: e.target.value }))}>
                  <option value="">Select Branch</option>
                  {branches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Section</label>
                <select className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
                  value={form.section} onChange={e => setForm(prev => ({ ...prev, section: e.target.value }))}>
                  <option value="">Select Section</option>
                  {sections.map(s => <option key={s} value={s}>{form.branch ? `${form.branch}-${s}` : s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Password</label>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border text-sm outline-none"
                    style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted) / 0.3)" }}
                    placeholder="Set login password"
                    value={form.password}
                    onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                    onFocus={e => (e.target.style.borderColor = "hsl(var(--orange))")}
                    onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Address</label>
                <textarea rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none"
                  style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted) / 0.3)" }}
                  placeholder="Full residential address"
                  value={form.address}
                  onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = "hsl(var(--orange))")}
                  onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")} />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="btn-primary"><Save className="w-4 h-4" /> Enroll Student</button>
                <button type="button" onClick={() => setView("list")} className="btn-navy">Cancel</button>
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
                  placeholder="Search by name, roll number, or branch..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = "hsl(var(--orange))")}
                  onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")} />
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">{filtered.length} results</span>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll No.</th>
                    <th>Year / Branch</th>
                    <th>Section</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: "hsl(var(--orange) / 0.12)", color: "hsl(var(--orange-dark))" }}>
                            {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground text-sm">{s.name}</div>
                            <div className="text-xs text-muted-foreground">{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="font-mono text-xs font-semibold">{s.rollNumber}</span></td>
                      <td><span className="badge-info">{s.year} Year • {s.branch}</span></td>
                      <td><span className="badge-warning">{s.section}</span></td>
                      <td>
                        <div className="text-xs text-muted-foreground">{s.mobile}</div>
                        <div className="text-xs text-muted-foreground">P: {s.parentMobile}</div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-muted"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
                          <button className="p-1.5 rounded-lg hover:bg-destructive/10">
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
