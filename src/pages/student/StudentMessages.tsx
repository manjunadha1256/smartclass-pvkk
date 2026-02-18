import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { MessageSquare } from "lucide-react";

const allMessages = [
  { faculty: "Prof. Ravi Shankar", subject: "Data Structures", msg: "Please complete Chapter 5 - Trees before next class. Practice binary search tree insertions.", time: "1 hr ago", section: "CSE-A" },
  { faculty: "Dr. Priya Nair", subject: "Mathematics", msg: "Assignment submission deadline has been extended to Friday Feb 21. Submit to the faculty portal.", time: "3 hrs ago", section: "CSE-A" },
  { faculty: "Prof. Suresh Kumar", subject: "Physics", msg: "Lab report for Experiment 4 is due tomorrow. Please follow the format given in the lab manual.", time: "Yesterday", section: "CSE-A" },
  { faculty: "Dr. Kavitha Reddy", subject: "DBMS", msg: "Unit test on SQL queries is scheduled for next Monday. Cover all join types and subqueries.", time: "2 days ago", section: "CSE-A" },
  { faculty: "Prof. Ravi Shankar", subject: "Data Structures", msg: "Office hours are on Tuesday 3-5 PM. Feel free to come for doubt clarification.", time: "3 days ago", section: "CSE-A" },
];

export default function StudentMessages() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-xl font-bold text-foreground">Faculty Messages</h2>
          <p className="text-sm text-muted-foreground">All messages from your faculty members</p>
        </div>
        <div className="space-y-3">
          {allMessages.map((m, i) => (
            <div key={i} className="bg-card rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: "hsl(var(--navy) / 0.1)", color: "hsl(var(--navy))" }}>
                  {m.faculty.split(" ").map(n => n[0]).join("").slice(1, 3)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-foreground">{m.faculty}</span>
                    <span className="text-xs text-muted-foreground">{m.time}</span>
                  </div>
                  <span className="badge-info mb-2">{m.subject}</span>
                  <p className="text-sm text-foreground mt-2 leading-relaxed">{m.msg}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
