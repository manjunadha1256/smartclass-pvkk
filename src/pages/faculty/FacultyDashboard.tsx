import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import {
  BookOpen,
  Users,
  ClipboardList,
  Brain,
  Calendar,
  ChevronRight
} from "lucide-react";
import ClassManagement from "./ClassManagement";

/* ================= TYPES ================= */

interface ClassSchedule {
  id?: string;
  time: string;
  subject: string;
  section: string;
  room: string;
  students: number;
}

/* ================= COMPONENT ================= */

export default function FacultyDashboard() {

  const { user } = useAuth();

  const [schedule, setSchedule] = useState<ClassSchedule[]>([]);
  const [stats, setStats] = useState({
    classes: 0,
    students: 0,
    attendance: 0,
    quizzes: 0
  });

  const [selectedClass, setSelectedClass] =
    useState<ClassSchedule | null>(null);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (user) {
      fetchSchedule();
      fetchStats();
    }
  }, [user]);

  /* ---------- CLASS SCHEDULE ---------- */
  const fetchSchedule = async () => {

    const { data } = await supabase
      .from("class_schedule")
      .select("*")
      .eq("facultyId", user?.id);

    setSchedule(data || []);
  };

  /* ---------- STATS ---------- */
  const fetchStats = async () => {

    /* Classes count */
    const { data: classes } = await supabase
      .from("class_schedule")
      .select("*")
      .eq("facultyId", user?.id);

    /* Students count */
    const { data: students } = await supabase
      .from("students")
      .select("*")
      .eq("section", user?.section);

    /* Attendance avg */
    const avgAttendance =
      students?.length
        ? students.reduce(
            (a, b) => a + (b.attendancePct || 0),
            0
          ) / students.length
        : 0;

    /* Quiz count */
    const { data: quizzes } = await supabase
      .from("quizzes")
      .select("*")
      .eq("facultyId", user?.id);

    setStats({
      classes: classes?.length || 0,
      students: students?.length || 0,
      attendance: Math.round(avgAttendance),
      quizzes: quizzes?.length || 0
    });
  };

  /* ================= OPEN CLASS ================= */

  if (selectedClass) {
    return (
      <ClassManagement
        classData={selectedClass}
        onBack={() => setSelectedClass(null)}
      />
    );
  }

  /* ================= UI ================= */

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* ================= WELCOME ================= */}
        <div className="rounded-xl p-6 text-white bg-navy-900">

          <h2 className="text-xl font-bold">
            Welcome, {user?.name}
          </h2>

          <p className="text-sm opacity-80">
            {user?.subject} · Section {user?.section}
          </p>

        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {[
            {
              label: "Today's Classes",
              value: stats.classes,
              icon: BookOpen
            },
            {
              label: "Total Students",
              value: stats.students,
              icon: Users
            },
            {
              label: "Avg Attendance",
              value: `${stats.attendance}%`,
              icon: ClipboardList
            },
            {
              label: "Quizzes Created",
              value: stats.quizzes,
              icon: Brain
            },
          ].map((s, i) => {

            const Icon = s.icon;

            return (
              <div key={i} className="stat-card">

                <Icon className="w-5 h-5 mb-2" />

                <div className="text-2xl font-bold">
                  {s.value}
                </div>

                <div className="text-xs">
                  {s.label}
                </div>

              </div>
            );
          })}

        </div>

        {/* ================= SCHEDULE ================= */}
        <div className="bg-card p-5 rounded-xl">

          <h3 className="font-bold mb-4 flex gap-2">
            <Calendar className="w-4 h-4" />
            Today's Schedule
          </h3>

          <div className="space-y-3">

            {schedule.map(cls => (

              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className="w-full flex justify-between p-4 border rounded-lg hover:border-orange-500"
              >

                <div>
                  <div className="font-semibold">
                    {cls.subject}
                  </div>

                  <div className="text-xs">
                    {cls.section} · {cls.room}
                  </div>
                </div>

                <div className="text-right">

                  <div className="text-sm">
                    {cls.time}
                  </div>

                  <ChevronRight className="w-4 h-4 ml-auto" />

                </div>

              </button>

            ))}

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}
