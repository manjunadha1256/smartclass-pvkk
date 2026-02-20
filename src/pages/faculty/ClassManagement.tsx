import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  ClipboardList,
  MessageSquare,
  Users,
  CheckCircle,
  UserCheck,
  UserX,
  Send
} from "lucide-react";

/* ================= TYPES ================= */

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  section: string;
  attendance?: "present" | "absent";
}

interface Message {
  id?: string;
  text: string;
  section: string;
  created_at?: string;
}

interface Props {
  classData: {
    subject: string;
    section: string;
  };
}

/* ================= COMPONENT ================= */

export default function ClassManagement({ classData }: Props) {

  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  /* ================= FETCH STUDENTS ================= */

  useEffect(() => {
    fetchStudents();
    fetchMessages();
  }, []);

  const fetchStudents = async () => {

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("section", classData.section);

    if (!error && data) {

      setStudents(data);

      const initial = Object.fromEntries(
        data.map(s => [s.id, s.attendance || "present"])
      );

      setAttendance(initial);
    }
  };

  /* ================= SAVE ATTENDANCE ================= */

  const saveAttendance = async () => {

    const updates = Object.entries(attendance);

    for (const [id, status] of updates) {

      await supabase
        .from("students")
        .update({ attendance: status })
        .eq("id", id);
    }

    alert("Attendance Saved");
  };

  const toggleAttendance = (id: string) => {
    setAttendance(prev => ({
      ...prev,
      [id]: prev[id] === "present" ? "absent" : "present"
    }));
  };

  /* ================= FETCH MESSAGES ================= */

  const fetchMessages = async () => {

    const { data } = await supabase
      .from("class_messages")
      .select("*")
      .eq("section", classData.section)
      .order("id", { ascending: false });

    setMessages(data || []);
  };

  /* ================= SEND MESSAGE ================= */

  const sendMessage = async () => {

    if (!message.trim()) return;

    await supabase
      .from("class_messages")
      .insert([
        {
          text: message,
          section: classData.section
        }
      ]);

    setMessage("");
    fetchMessages();
  };

  /* ================= COUNTS ================= */

  const presentCount =
    Object.values(attendance).filter(v => v === "present").length;

  const absentCount =
    students.length - presentCount;

  /* ================= UI ================= */

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* ================= ATTENDANCE ================= */}
        <div className="bg-card p-5 rounded-xl">

          <h3 className="font-bold mb-4">
            Attendance — {classData.section}
          </h3>

          <div className="flex gap-4 mb-4 text-sm">

            <span className="text-green-600">
              Present: {presentCount}
            </span>

            <span className="text-red-600">
              Absent: {absentCount}
            </span>

          </div>

          <div className="space-y-2">

            {students.map(s => {

              const isPresent =
                attendance[s.id] === "present";

              return (
                <div
                  key={s.id}
                  className="flex justify-between p-3 border rounded-lg"
                >

                  <div>
                    <div className="font-semibold">
                      {s.name}
                    </div>
                    <div className="text-xs">
                      {s.rollNumber}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleAttendance(s.id)}
                    className={`px-3 py-1 rounded text-white text-xs ${
                      isPresent
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >

                    {isPresent
                      ? <UserCheck className="w-3 h-3" />
                      : <UserX className="w-3 h-3" />
                    }

                  </button>

                </div>
              );
            })}

          </div>

          <button
            onClick={saveAttendance}
            className="btn-primary mt-4"
          >
            <CheckCircle className="w-4 h-4" />
            Save Attendance
          </button>

        </div>

        {/* ================= MESSAGES ================= */}
        <div className="bg-card p-5 rounded-xl">

          <h3 className="font-bold mb-4">
            Class Messages
          </h3>

          <div className="space-y-2 mb-4">

            {messages.map(m => (

              <div
                key={m.id}
                className="p-2 bg-muted rounded"
              >
                {m.text}
              </div>

            ))}

          </div>

          <div className="flex gap-2">

            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type message..."
              className="input flex-1"
            />

            <button
              onClick={sendMessage}
              className="btn-primary"
            >
              <Send className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* ================= STUDENTS LIST ================= */}
        <div className="bg-card p-5 rounded-xl">

          <h3 className="font-bold mb-4">
            Students List
          </h3>

          <table className="data-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Roll</th>
                <th>Section</th>
              </tr>
            </thead>

            <tbody>

              {students.map(s => (

                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.rollNumber}</td>
                  <td>{s.section}</td>
                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>
  );
}
