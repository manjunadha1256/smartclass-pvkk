import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

import { db } from "@/firebase";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

import {
  UserPlus,
  Save,
  ArrowLeft,
  Trash2
} from "lucide-react";

interface Student {
  id?: string;
  name: string;
  year: string;
  branch: string;
  section: string;
  rollNumber: string;
  email: string;
  mobile: string;
}

export default function AddStudent() {

  const [view, setView] =
    useState<"list" | "add">("list");

  const [search, setSearch] = useState("");
  const [students, setStudents] =
    useState<Student[]>([]);

  const [form, setForm] = useState<Student>({
    name: "",
    year: "",
    branch: "",
    section: "",
    rollNumber: "",
    email: "",
    mobile: "",
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {

    const snapshot =
      await getDocs(collection(db, "students"));

    const list: Student[] = [];

    snapshot.forEach(docSnap => {
      list.push({
        id: docSnap.id,
        ...(docSnap.data() as Student)
      });
    });

    setStudents(list);
  };

  /* ================= SAVE ================= */
  const handleSave = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    await addDoc(
      collection(db, "students"),
      {
        name: form.name,
        year: form.year,
        branch: form.branch,
        section: form.section,
        rollNumber: form.rollNumber,
        email: form.email,
        mobile: form.mobile,
      }
    );

    fetchStudents();
    setView("list");

    setForm({
      name: "",
      year: "",
      branch: "",
      section: "",
      rollNumber: "",
      email: "",
      mobile: "",
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {

    await deleteDoc(
      doc(db, "students", id)
    );

    fetchStudents();
  };

  /* ================= SEARCH ================= */
  const filtered = students.filter(s =>
    s.name
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||

    s.rollNumber
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>

      {/* HEADER */}
      <div className="flex justify-between mb-6">

        <h2 className="text-xl font-bold">
          Student Management ({students.length})
        </h2>

        <button
          onClick={() =>
            setView(view === "list" ? "add" : "list")
          }
          className="btn-primary flex gap-2"
        >
          {view === "list"
            ? <><UserPlus /> Add Student</>
            : <><ArrowLeft /> Back</>}
        </button>

      </div>

      {/* ADD FORM */}
      {view === "add" && (

        <form
          onSubmit={handleSave}
          className="grid gap-3"
        >

          <input
            placeholder="Name"
            className="input"
            value={form.name}
            onChange={e =>
              setForm({
                ...form,
                name: e.target.value
              })
            }
          />

          <input
            placeholder="Roll No"
            className="input"
            value={form.rollNumber}
            onChange={e =>
              setForm({
                ...form,
                rollNumber: e.target.value
              })
            }
          />

          <input
            placeholder="Branch"
            className="input"
            value={form.branch}
            onChange={e =>
              setForm({
                ...form,
                branch: e.target.value
              })
            }
          />

          <input
            placeholder="Year"
            className="input"
            value={form.year}
            onChange={e =>
              setForm({
                ...form,
                year: e.target.value
              })
            }
          />

          <input
            placeholder="Section"
            className="input"
            value={form.section}
            onChange={e =>
              setForm({
                ...form,
                section: e.target.value
              })
            }
          />

          <input
            placeholder="Email"
            className="input"
            value={form.email}
            onChange={e =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
          />

          <input
            placeholder="Mobile"
            className="input"
            value={form.mobile}
            onChange={e =>
              setForm({
                ...form,
                mobile: e.target.value
              })
            }
          />

          <button
            type="submit"
            className="btn-primary flex gap-2"
          >
            <Save /> Save Student
          </button>

        </form>
      )}

      {/* LIST */}
      {view === "list" && (

        <div>

          <input
            placeholder="Search..."
            className="input mb-4"
            value={search}
            onChange={e =>
              setSearch(e.target.value)
            }
          />

          <table className="data-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.rollNumber}</td>
                  <td>{s.branch}</td>
                  <td>{s.year}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleDelete(s.id!)
                      }
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

    </DashboardLayout>
  );
}
