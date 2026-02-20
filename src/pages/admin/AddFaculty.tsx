import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  UserPlus,
  Save,
  CheckCircle,
  ArrowLeft,
  Phone,
  Trash2
} from "lucide-react";

interface Faculty {
  id?: string;
  name: string;
  subject: string;
  section: string;
  email: string;
  mobile: string;
  address: string;
}

export default function AddFaculty() {

  const [view, setView] = useState<"list" | "add">("list");
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);

  // ✅ Typed Form (No dummy)
  const [form, setForm] = useState<Faculty>({
    name: "",
    subject: "",
    section: "",
    email: "",
    mobile: "",
    address: ""
  });

  // ================= FETCH =================
  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    const { data, error } = await supabase
      .from("faculty")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Fetch Error:", error);
    } else {
      setFacultyList(data || []);
    }
  };

  // ================= SAVE =================
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.subject) {
      alert("Fill all required fields");
      return;
    }

    const { error } = await supabase
      .from("faculty")
      .insert([
        {
          name: form.name,
          subject: form.subject,
          section: form.section,
          email: form.email,
          mobile: form.mobile,
          address: form.address
        }
      ]);

    if (error) {
      console.error("Insert Error:", error);
    } else {
      setSaved(true);
      fetchFaculty();

      setTimeout(() => {
        setSaved(false);
        setView("list");
        setForm({
          name: "",
          subject: "",
          section: "",
          email: "",
          mobile: "",
          address: ""
        });
      }, 1200);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("faculty")
      .delete()
      .eq("id", id);

    if (!error) fetchFaculty();
  };

  // ================= SEARCH =================
  const filtered = facultyList.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.subject?.toLowerCase().includes(search.toLowerCase()) ||
    f.section?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">
            Faculty Management ({facultyList.length})
          </h2>

          <button
            onClick={() => setView(view === "list" ? "add" : "list")}
            className="btn-primary"
          >
            {view === "list"
              ? <><UserPlus /> Add Faculty</>
              : <><ArrowLeft /> Back</>}
          </button>
        </div>

        {/* ================= ADD FORM ================= */}
        {view === "add" && (
          <form
            onSubmit={handleSave}
            className="bg-card p-6 rounded-xl space-y-4"
          >

            {saved && (
              <div className="text-green-600 flex gap-2">
                <CheckCircle /> Saved Successfully
              </div>
            )}

            <input
              placeholder="Name"
              className="input"
              value={form.name}
              onChange={e =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Subject"
              className="input"
              value={form.subject}
              onChange={e =>
                setForm({ ...form, subject: e.target.value })
              }
            />

            <input
              placeholder="Section"
              className="input"
              value={form.section}
              onChange={e =>
                setForm({ ...form, section: e.target.value })
              }
            />

            <input
              placeholder="Email"
              className="input"
              value={form.email}
              onChange={e =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              placeholder="Mobile"
              className="input"
              value={form.mobile}
              onChange={e =>
                setForm({ ...form, mobile: e.target.value })
              }
            />

            <input
              placeholder="Address"
              className="input"
              value={form.address}
              onChange={e =>
                setForm({ ...form, address: e.target.value })
              }
            />

            <button className="btn-primary">
              <Save /> Save Faculty
            </button>

          </form>
        )}

        {/* ================= LIST ================= */}
        {view === "list" && (
          <div className="bg-card rounded-xl p-4">

            <input
              placeholder="Search..."
              className="input mb-4"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Section</th>
                  <th>Mobile</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(f => (
                  <tr key={f.id}>
                    <td>{f.name}</td>
                    <td>{f.subject}</td>
                    <td>{f.section}</td>
                    <td>
                      <Phone className="w-3 inline" /> {f.mobile}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(f.id!)}
                        className="text-red-500"
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
