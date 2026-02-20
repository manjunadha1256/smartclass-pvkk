import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  GraduationCap,
  CreditCard,
  TrendingUp,
  AlertCircle
} from "lucide-react";

/* ================= TYPES ================= */

interface Student {
  id?: string;
  name: string;
  year: string;
  feePaid: number;
  totalFee: number;
}

interface Faculty {
  id?: string;
  name: string;
}

interface Activity {
  text: string;
  time: string;
}

/* ================= COMPONENT ================= */

export default function AdminDashboard() {

  const [totalStudents, setTotalStudents] = useState(0);
  const [totalFaculty, setTotalFaculty] = useState(0);
  const [feeCollection, setFeeCollection] = useState(0);
  const [defaulters, setDefaulters] = useState<Student[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {

    /* ---------- STUDENTS ---------- */
    const { data: students } = await supabase
      .from("students")
      .select("*");

    /* ---------- FACULTY ---------- */
    const { data: faculty } = await supabase
      .from("faculty")
      .select("*");

    if (students) {

      setTotalStudents(students.length);

      /* Fee Collection */
      const totalFees = students.reduce(
        (sum, s) => sum + (s.feePaid || 0),
        0
      );

      setFeeCollection(totalFees);

      /* Defaulters */
      const pending = students.filter(
        s => (s.feePaid || 0) < (s.totalFee || 0)
      );

      setDefaulters(pending.slice(0, 5));
    }

    if (faculty) {
      setTotalFaculty(faculty.length);
    }

    /* ---------- RECENT ACTIVITY ---------- */
    setActivities([
      { text: "New student added", time: "Just now" },
      { text: "Fee payment received", time: "10 min ago" },
      { text: "Attendance updated", time: "1 hr ago" },
    ]);
  };

  /* ================= UI ================= */

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Students */}
          <div className="stat-card">
            <GraduationCap className="w-6 h-6 mb-2" />
            <div className="text-2xl font-bold">
              {totalStudents}
            </div>
            <div className="text-xs">
              Total Students
            </div>
          </div>

          {/* Faculty */}
          <div className="stat-card">
            <Users className="w-6 h-6 mb-2" />
            <div className="text-2xl font-bold">
              {totalFaculty}
            </div>
            <div className="text-xs">
              Faculty Members
            </div>
          </div>

          {/* Fee */}
          <div className="stat-card">
            <CreditCard className="w-6 h-6 mb-2" />
            <div className="text-2xl font-bold">
              ₹{feeCollection.toLocaleString()}
            </div>
            <div className="text-xs">
              Fee Collection
            </div>
          </div>

          {/* Growth */}
          <div className="stat-card">
            <TrendingUp className="w-6 h-6 mb-2" />
            <div className="text-2xl font-bold">
              Live
            </div>
            <div className="text-xs">
              System Analytics
            </div>
          </div>

        </div>

        {/* ================= DEFAULTERS ================= */}
        <div className="bg-card rounded-xl p-5">

          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <h3 className="font-bold">
              Fee Defaulters
            </h3>
          </div>

          <div className="space-y-3">

            {defaulters.map((d, i) => (

              <div
                key={i}
                className="flex justify-between p-3 bg-red-50 rounded-lg"
              >

                <div>
                  <div className="font-semibold">
                    {d.name}
                  </div>
                  <div className="text-xs">
                    {d.year} Year
                  </div>
                </div>

                <div className="text-right text-red-600 font-bold">
                  ₹{(d.totalFee - d.feePaid).toLocaleString()}
                </div>

              </div>

            ))}

          </div>

        </div>

        {/* ================= ACTIVITY ================= */}
        <div className="bg-card rounded-xl p-5">

          <h3 className="font-bold mb-4">
            Recent Activity
          </h3>

          <div className="space-y-2">

            {activities.map((a, i) => (

              <div
                key={i}
                className="flex justify-between text-sm"
              >
                <span>{a.text}</span>
                <span className="text-muted-foreground">
                  {a.time}
                </span>
              </div>

            ))}

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}
