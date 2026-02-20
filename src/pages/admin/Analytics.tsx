import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Download } from "lucide-react";

/* ================= TYPES ================= */

interface Student {
  id?: string;
  name: string;
  year: string;
  section: string;
  rollNumber: string;
  attendance: number;
  avgScore: number;
}

interface YearStat {
  year: string;
  students: number;
  avgAttendance: number;
  passRate: number;
}

interface RiskStat {
  label: string;
  count: number;
  pct: number;
}

/* ================= COMPONENT ================= */

export default function Analytics() {

  const [students, setStudents] = useState<Student[]>([]);
  const [yearStats, setYearStats] = useState<YearStat[]>([]);
  const [topStudents, setTopStudents] = useState<Student[]>([]);
  const [riskStats, setRiskStats] = useState<RiskStat[]>([]);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {

    const { data, error } = await supabase
      .from("students")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    const list = data || [];
    setStudents(list);

    calculateYearStats(list);
    calculateTopStudents(list);
    calculateRiskStats(list);
  };

  /* ================= YEAR STATS ================= */

  const calculateYearStats = (data: Student[]) => {

    const grouped: Record<string, Student[]> = {};

    data.forEach(s => {
      if (!grouped[s.year]) grouped[s.year] = [];
      grouped[s.year].push(s);
    });

    const stats: YearStat[] = Object.keys(grouped).map(year => {

      const students = grouped[year];
      const total = students.length;

      const avgAttendance =
        students.reduce((a, b) => a + (b.attendance || 0), 0) / total;

      const passRate =
        (students.filter(s => (s.avgScore || 0) >= 10).length / total) * 100;

      return {
        year,
        students: total,
        avgAttendance: Math.round(avgAttendance),
        passRate: Math.round(passRate),
      };
    });

    setYearStats(stats);
  };

  /* ================= TOP STUDENTS ================= */

  const calculateTopStudents = (data: Student[]) => {

    const sorted = [...data]
      .sort((a, b) => (b.avgScore || 0) - (a.avgScore || 0))
      .slice(0, 5);

    setTopStudents(sorted);
  };

  /* ================= RISK ================= */

  const calculateRiskStats = (data: Student[]) => {

    const safe = data.filter(s => s.attendance >= 75).length;
    const risk = data.filter(s => s.attendance >= 65 && s.attendance < 75).length;
    const danger = data.filter(s => s.attendance < 65).length;

    const total = data.length || 1;

    setRiskStats([
      {
        label: "Above 75% (Safe)",
        count: safe,
        pct: Math.round((safe / total) * 100),
      },
      {
        label: "65–75% (At Risk)",
        count: risk,
        pct: Math.round((risk / total) * 100),
      },
      {
        label: "Below 65% (Detained)",
        count: danger,
        pct: Math.round((danger / total) * 100),
      },
    ]);
  };

  /* ================= UI ================= */

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">
            Analytics & Reports
          </h2>

          <button className="btn-primary">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* ================= YEAR STATS ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {yearStats.map(y => (

            <div key={y.year} className="stat-card">

              <div className="font-bold mb-2">
                {y.year}
              </div>

              <div className="text-sm">
                Students: <b>{y.students}</b>
              </div>

              <div className="text-sm">
                Attendance: <b>{y.avgAttendance}%</b>
              </div>

              <div className="text-sm">
                Pass Rate: <b>{y.passRate}%</b>
              </div>

              <div className="progress-bar mt-2">
                <div
                  className="progress-fill success"
                  style={{ width: `${y.passRate}%` }}
                />
              </div>

            </div>

          ))}

        </div>

        {/* ================= TOP STUDENTS ================= */}
        <div className="bg-card p-5 rounded-xl">

          <h3 className="font-bold mb-4 flex gap-2">
            <TrendingUp className="w-4 h-4" />
            Top Performers
          </h3>

          <div className="space-y-3">

            {topStudents.map((s, i) => (

              <div
                key={i}
                className="flex justify-between p-3 bg-muted rounded-lg"
              >

                <div>
                  <div className="font-semibold">
                    {s.name}
                  </div>
                  <div className="text-xs">
                    {s.rollNumber} · {s.section}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold">
                    {s.avgScore}/20
                  </div>
                  <div className="text-xs">
                    {s.attendance}%
                  </div>
                </div>

              </div>

            ))}

          </div>

        </div>

        {/* ================= RISK ================= */}
        <div className="bg-card p-5 rounded-xl">

          <h3 className="font-bold mb-4">
            Attendance Risk Categories
          </h3>

          {riskStats.map((r, i) => (

            <div key={i} className="mb-3">

              <div className="flex justify-between text-sm mb-1">
                <span>{r.label}</span>
                <span>{r.count} students</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${r.pct}%` }}
                />
              </div>

            </div>

          ))}

        </div>

      </div>

    </DashboardLayout>
  );
}
