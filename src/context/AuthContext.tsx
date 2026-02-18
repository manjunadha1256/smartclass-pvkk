import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "faculty" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  // Faculty specific
  subject?: string;
  section?: string;
  // Student specific
  year?: string;
  branch?: string;
  rollNumber?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Dr. Admin Kumar",
    email: "admin@pvkk.edu",
    role: "admin",
  },
  {
    id: "2",
    name: "Prof. Ravi Shankar",
    email: "ravi@pvkk.edu",
    role: "faculty",
    subject: "Data Structures",
    section: "CSE-A",
  },
  {
    id: "3",
    name: "Arjun Reddy",
    email: "arjun@pvkk.edu",
    role: "student",
    year: "2nd Year",
    branch: "CSE",
    section: "CSE-A",
    rollNumber: "22CS001",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Demo login — match by role
    const found = MOCK_USERS.find((u) => u.role === role && u.email === email);
    if (found && password.length >= 4) {
      setUser(found);
      return true;
    }
    // Allow demo login with any credentials matching role
    const demo = MOCK_USERS.find((u) => u.role === role);
    if (demo && password.length >= 4) {
      setUser(demo);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
