import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-foreground">
          Admin Dashboard
        </h2>

        <p className="text-muted-foreground">
          Welcome to SmartClass PVKK Admin Panel.
        </p>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-6 bg-card rounded-2xl shadow">
            <h3 className="font-bold text-lg">Total Students</h3>
            <p className="text-2xl mt-2">120</p>
          </div>

          <div className="p-6 bg-card rounded-2xl shadow">
            <h3 className="font-bold text-lg">Total Faculty</h3>
            <p className="text-2xl mt-2">18</p>
          </div>

          <div className="p-6 bg-card rounded-2xl shadow">
            <h3 className="font-bold text-lg">Active Classes</h3>
            <p className="text-2xl mt-2">24</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}