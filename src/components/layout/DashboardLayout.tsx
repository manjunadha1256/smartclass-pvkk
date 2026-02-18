import React, { useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import {
  GraduationCap, LayoutDashboard, Users, BookOpen, ClipboardList,
  CreditCard, MessageSquare, BarChart3, Settings, LogOut, Menu, X,
  Bell, ChevronDown, Brain, Calendar
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const adminNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Add Faculty", icon: Users, path: "/admin/add-faculty" },
  { label: "Add Student", icon: GraduationCap, path: "/admin/add-student" },
  { label: "Academic Structure", icon: BookOpen, path: "/admin/academics" },
  { label: "Attendance Reports", icon: ClipboardList, path: "/admin/attendance" },
  { label: "Fee Management", icon: CreditCard, path: "/admin/fees" },
  { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
];

const facultyNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/faculty" },
  { label: "My Classes", icon: BookOpen, path: "/faculty/classes" },
  { label: "AI Quiz", icon: Brain, path: "/faculty/quiz" },
  { label: "Attendance", icon: ClipboardList, path: "/faculty/attendance" },
  { label: "Messages", icon: MessageSquare, path: "/faculty/messages" },
  { label: "Schedule", icon: Calendar, path: "/faculty/schedule" },
];

const studentNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/student" },
  { label: "My Classes", icon: BookOpen, path: "/student/classes" },
  { label: "Quiz", icon: Brain, path: "/student/quiz" },
  { label: "Attendance", icon: ClipboardList, path: "/student/attendance" },
  { label: "Messages", icon: MessageSquare, path: "/student/messages" },
  { label: "Fee Payment", icon: CreditCard, path: "/student/fees" },
  { label: "Results", icon: BarChart3, path: "/student/results" },
];

const navMap: Record<UserRole, NavItem[]> = {
  admin: adminNav,
  faculty: facultyNav,
  student: studentNav,
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const navItems = navMap[user.role];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--gradient-orange)" }}>
            <GraduationCap className="w-6 h-6" style={{ color: "hsl(var(--navy-dark))" }} />
          </div>
          <div>
            <div className="font-bold text-white text-sm leading-tight">SmartClass</div>
            <div className="text-xs opacity-50 leading-tight">PVKK Institute</div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-5 py-4 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: "hsl(var(--orange))", color: "hsl(var(--navy-dark))" }}>
            {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-semibold truncate">{user.name}</div>
            <div className="text-xs opacity-50 capitalize">{user.role}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={`sidebar-nav-item w-full ${active ? "active" : ""}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <button onClick={handleLogout} className="sidebar-nav-item w-full text-red-400 hover:bg-red-900/30 hover:text-red-300">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col" style={{ background: "hsl(var(--sidebar-background))" }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 flex flex-col" style={{ background: "hsl(var(--sidebar-background))" }}>
            <button onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-6 bg-card border-b border-border flex-shrink-0"
          style={{ boxShadow: "0 1px 4px hsl(var(--navy) / 0.08)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-foreground text-sm lg:text-base leading-tight">
                {navItems.find(n => n.path === location.pathname)?.label || "Dashboard"}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">PVKK Institute of Technology</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-muted transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "hsl(var(--orange))" }} />
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted transition-colors cursor-pointer">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "hsl(var(--navy))", color: "hsl(var(--orange))" }}>
                {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <span className="text-sm font-medium hidden sm:block">{user.name.split(" ")[0]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
