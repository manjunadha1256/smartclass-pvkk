import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import loginBg from "@/assets/login-bg.jpg";
import { Eye, EyeOff, GraduationCap, Shield, BookOpen, User } from "lucide-react";

const roles = [
  { value: "admin" as UserRole, label: "Admin", icon: Shield, color: "border-orange-DEFAULT", hint: "admin@pvkk.edu" },
  { value: "faculty" as UserRole, label: "Faculty", icon: BookOpen, color: "border-orange-DEFAULT", hint: "ravi@pvkk.edu" },
  { value: "student" as UserRole, label: "Student", icon: User, color: "border-orange-DEFAULT", hint: "arjun@pvkk.edu" },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    const ok = await login(email, password, selectedRole);
    setLoading(false);
    if (ok) {
      navigate(`/${selectedRole}`);
    } else {
      setError("Invalid credentials. Try any email with password ≥ 4 chars.");
    }
  };

  const selectedRoleData = roles.find(r => r.value === selectedRole)!;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={loginBg} alt="PVKK Campus" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "var(--gradient-orange)" }}>
              <GraduationCap className="w-7 h-7 text-navy-dark" />
            </div>
            <div>
              <div className="font-bold text-lg leading-tight">SmartClass</div>
              <div className="text-xs opacity-70">PVKK Institute of Technology</div>
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Digital Classroom<br />Management System
            </h1>
            <p className="text-lg opacity-80 mb-8">
              AI-powered ERP for academics, attendance, quizzes, fees & communication — all in one place.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Students", value: "1,240+" },
                { label: "Faculty", value: "68" },
                { label: "Sections", value: "21" },
                { label: "Subjects", value: "19" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                  <div className="text-2xl font-bold" style={{ color: "hsl(var(--orange))" }}>{s.value}</div>
                  <div className="text-sm opacity-70">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs opacity-50">© 2025 PVKK Institute of Technology. All rights reserved.</div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-navy)" }}>
              <GraduationCap className="w-6 h-6 text-orange-DEFAULT" style={{ color: "hsl(var(--orange))" }} />
            </div>
            <div>
              <div className="font-bold text-navy">SmartClass ERP</div>
              <div className="text-xs text-muted-foreground">PVKK Institute of Technology</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back</h2>
          <p className="text-muted-foreground mb-8 text-sm">Sign in to your SmartClass account</p>

          {/* Role Selector */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-foreground mb-3 block">Select Your Role</label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map(r => {
                const Icon = r.icon;
                const active = selectedRole === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => { setSelectedRole(r.value); setEmail(r.hint); }}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer"
                    style={{
                      borderColor: active ? "hsl(var(--orange))" : "hsl(var(--border))",
                      background: active ? "hsl(var(--orange) / 0.08)" : "transparent",
                    }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                      style={{
                        background: active ? "hsl(var(--orange))" : "hsl(var(--muted))",
                      }}>
                      <Icon className="w-5 h-5" style={{ color: active ? "hsl(var(--navy-dark))" : "hsl(var(--muted-foreground))" }} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: active ? "hsl(var(--orange-dark))" : "hsl(var(--muted-foreground))" }}>
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={`e.g. ${selectedRoleData.hint}`}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{
                  borderColor: "hsl(var(--border))",
                  background: "hsl(var(--card))",
                }}
                onFocus={e => (e.target.style.borderColor = "hsl(var(--orange))")}
                onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none transition-all"
                  style={{
                    borderColor: "hsl(var(--border))",
                    background: "hsl(var(--card))",
                  }}
                  onFocus={e => (e.target.style.borderColor = "hsl(var(--orange))")}
                  onBlur={e => (e.target.style.borderColor = "hsl(var(--border))")}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 px-4 py-2.5 rounded-xl">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-2">
              {loading ? "Signing in..." : `Sign in as ${selectedRoleData.label}`}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl" style={{ background: "hsl(var(--muted))" }}>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Demo Credentials</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div><span className="font-medium">Admin:</span> admin@pvkk.edu / any 4+ char password</div>
              <div><span className="font-medium">Faculty:</span> ravi@pvkk.edu / any 4+ char password</div>
              <div><span className="font-medium">Student:</span> arjun@pvkk.edu / any 4+ char password</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
