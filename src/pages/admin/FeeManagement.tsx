import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  TrendingUp
} from "lucide-react";

/* ================= TYPES ================= */

interface Payment {
  id?: string;
  studentName: string;
  rollNumber: string;
  amountPaid: number;
  totalFee: number;
  date: string;
  txnId: string;
}

interface Summary {
  expected: number;
  collected: number;
  pending: number;
  defaulters: number;
}

/* ================= COMPONENT ================= */

export default function FeeManagement() {

  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<Summary>({
    expected: 0,
    collected: 0,
    pending: 0,
    defaulters: 0
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {

    const { data, error } = await supabase
      .from("fees")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const list = data || [];
    setPayments(list);

    calculateSummary(list);
  };

  /* ================= SUMMARY ================= */

  const calculateSummary = (data: Payment[]) => {

    const expected =
      data.reduce((sum, p) => sum + (p.totalFee || 0), 0);

    const collected =
      data.reduce((sum, p) => sum + (p.amountPaid || 0), 0);

    const pending = expected - collected;

    const defaulters =
      data.filter(p => p.amountPaid < p.totalFee).length;

    setSummary({
      expected,
      collected,
      pending,
      defaulters
    });
  };

  /* ================= STATUS ================= */

  const getStatus = (p: Payment) => {

    if (p.amountPaid === 0) return "pending";
    if (p.amountPaid < p.totalFee) return "partial";
    return "paid";
  };

  /* ================= UI ================= */

  return (
    <DashboardLayout>

      <div className="space-y-6">

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {[
            {
              label: "Total Expected",
              value: summary.expected,
              icon: DollarSign
            },
            {
              label: "Collected",
              value: summary.collected,
              icon: CheckCircle
            },
            {
              label: "Pending",
              value: summary.pending,
              icon: Clock
            },
            {
              label: "Defaulters",
              value: summary.defaulters,
              icon: AlertCircle
            },
          ].map((s, i) => {

            const Icon = s.icon;

            return (
              <div key={i} className="stat-card">

                <div className="flex justify-between mb-2">
                  <Icon className="w-5 h-5" />
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </div>

                <div className="text-2xl font-bold">
                  {i === 3
                    ? s.value
                    : `₹${Number(s.value).toLocaleString()}`
                  }
                </div>

                <div className="text-xs text-muted-foreground">
                  {s.label}
                </div>

              </div>
            );
          })}

        </div>

        {/* ================= PAYMENT TABLE ================= */}
        <div className="bg-card rounded-xl p-5">

          <h3 className="font-bold mb-4">
            Payment Records
          </h3>

          <div className="overflow-x-auto">

            <table className="data-table">

              <thead>
                <tr>
                  <th>Student</th>
                  <th>Amount Paid</th>
                  <th>Total Fee</th>
                  <th>Date</th>
                  <th>Transaction</th>
                  <th>Status</th>
                  <th>Receipt</th>
                </tr>
              </thead>

              <tbody>

                {payments.map((p, i) => {

                  const status = getStatus(p);

                  return (
                    <tr key={i}>

                      <td>
                        <div className="font-semibold">
                          {p.studentName}
                        </div>
                        <div className="text-xs">
                          {p.rollNumber}
                        </div>
                      </td>

                      <td>
                        ₹{p.amountPaid?.toLocaleString()}
                      </td>

                      <td>
                        ₹{p.totalFee?.toLocaleString()}
                      </td>

                      <td>
                        {p.date}
                      </td>

                      <td className="text-xs font-mono">
                        {p.txnId}
                      </td>

                      <td>

                        {status === "paid" && (
                          <span className="badge-success">
                            Paid
                          </span>
                        )}

                        {status === "partial" && (
                          <span className="badge-warning">
                            Partial
                          </span>
                        )}

                        {status === "pending" && (
                          <span className="badge-danger">
                            Pending
                          </span>
                        )}

                      </td>

                      <td>
                        {status !== "pending" && (
                          <button className="text-xs flex gap-1">
                            <Download className="w-3 h-3" />
                            PDF
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}
