import React, { useState, useEffect, useMemo } from "react";
import StudentActivityPanel from "./StudentActivityPanel";

const API_BASE_URL = import.meta.env.BACKEND_URL || "http://localhost:5000";

interface Student {
  username: string;
  email: string;
  grade: number;
  full_name?: string;
}

interface GradeSummary {
  grade: number;
  student_count: number;
}

const apiFetch = async (url: string, opts: RequestInit = {}) => {
  const res = await fetch(url, { credentials: "include", ...opts });
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) throw json || { message: text || res.statusText };
    return json;
  } catch (e) {
    if (!res.ok) throw { message: text || res.statusText };
    return null;
  }
};

const StudentsPanel: React.FC = () => {
  const [grades, setGrades] = useState<GradeSummary[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchGrades = async () => {
      setLoadingGrades(true);
      setError(null);
      try {
        const data = await apiFetch(`${API_BASE_URL}/admin/students/grades`, {
          method: "GET",
          signal: controller.signal,
        });
        if (!mounted) return;
        setGrades(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (!mounted) return;
        console.error("Error fetching grades:", err);
        setError(err?.message || "Failed to load grades");
      } finally {
        if (mounted) setLoadingGrades(false);
      }
    };

    fetchGrades();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const fetchStudents = async (grade: number) => {
    setSelectedGrade(null); // reset while loading to avoid stale UI
    setStudents([]);
    setLoadingStudents(true);
    setError(null);

    try {
      const data = await apiFetch(`${API_BASE_URL}/admin/students/${grade}`);
      setStudents(Array.isArray(data) ? data : []);
      setSelectedGrade(grade);
    } catch (err: any) {
      console.error("Error fetching students:", err);
      setError(err?.message || `Failed to load students for grade ${grade}`);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleBackToGrades = () => {
    setSelectedGrade(null);
    setStudents([]);
    setSearch("");
    setError(null);
  };

  const handleViewActivity = (student: Student) => {
    setSelectedStudent(student);
  };

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.username.toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q) ||
        (s.full_name || "").toLowerCase().includes(q)
    );
  }, [students, search]);

  // If viewing a student's activity, render that panel
  if (selectedStudent) {
    return (
      <StudentActivityPanel
        student={{
          username: selectedStudent.username,
          full_name: selectedStudent.full_name || selectedStudent.username,
          grade: selectedStudent.grade,
        }}
        onBack={() => setSelectedStudent(null)}
      />
    );
  }

  return (
    <div style={{ padding: 20, minHeight: "100vh" }}>
      <h2 style={{ color: "#f1f5f9", marginBottom: 24 }}>Students Management</h2>

      {/* Grades view */}
      {!selectedGrade && (
        <>
          {loadingGrades ? (
            <div style={{ color: "#f1f5f9" }}>Loading grades...</div>
          ) : error ? (
            <div style={{ color: "#ef4444" }}>
              <p>{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  // re-run the effect by manually calling fetchGrades (quick workaround)
                  // simpler: reload the page or you can re-run the effect by toggling state; but here we'll call the API directly:
                  (async () => {
                    setLoadingGrades(true);
                    try {
                      const data = await apiFetch(`${API_BASE_URL}/admin/students/grades`);
                      setGrades(Array.isArray(data) ? data : []);
                      setError(null);
                    } catch (err: any) {
                      console.error(err);
                      setError(err?.message || "Failed to load grades");
                    } finally {
                      setLoadingGrades(false);
                    }
                  })();
                }}
                style={{ marginTop: 8, padding: "8px 12px", cursor: "pointer" }}
              >
                Retry
              </button>
            </div>
          ) : grades.length ? (
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {grades.map((g) => (
                <div
                  key={g.grade}
                  onClick={() => fetchStudents(g.grade)}
                  role="button"
                  tabIndex={0}
                  style={{
                    padding: 20,
                    backgroundColor: "#1e293b",
                    borderRadius: 12,
                    cursor: "pointer",
                    border: "1px solid #334155",
                    minWidth: 180,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>
                    Grade {g.grade}
                  </div>
                  <div style={{ color: "#94a3b8" }}>{g.student_count} Students</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "#f87171" }}>No grades available. Please seed your database.</div>
          )}
        </>
      )}

      {/* Students list view */}
      {selectedGrade && (
        <div>
          <button
            onClick={handleBackToGrades}
            style={{
              padding: "10px 16px",
              marginBottom: 16,
              backgroundColor: "#334155",
              color: "#f1f5f9",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            ← Back to Grades
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <h3 style={{ color: "#cbd5e1", margin: 0 }}>Grade {selectedGrade} Students</h3>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by username, email or name"
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #475569",
                  background: "#0f172a",
                  color: "#f1f5f9",
                }}
              />
              <button
                onClick={() => {
                  setSearch("");
                }}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: "#6366f1",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            </div>
          </div>

          {loadingStudents ? (
            <div style={{ marginTop: 16, color: "#f1f5f9" }}>Loading students...</div>
          ) : error ? (
            <div style={{ color: "#ef4444", marginTop: 12 }}>{error}</div>
          ) : students.length === 0 ? (
            <div style={{ marginTop: 12, color: "#94a3b8" }}>No students in Grade {selectedGrade}</div>
          ) : (
            <div style={{ marginTop: 12, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                <thead>
                  <tr style={{ backgroundColor: "#0f172a" }}>
                    <th style={{ padding: 12, textAlign: "left", color: "#f1f5f9" }}>Username</th>
                    <th style={{ padding: 12, textAlign: "left", color: "#f1f5f9" }}>Full Name</th>
                    <th style={{ padding: 12, textAlign: "left", color: "#f1f5f9" }}>Email</th>
                    <th style={{ padding: 12, textAlign: "left", color: "#f1f5f9" }}>Grade</th>
                    <th style={{ padding: 12, textAlign: "left", color: "#f1f5f9" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((stu) => (
                    <tr key={stu.username} style={{ borderBottom: "1px solid #334155" }}>
                      <td style={{ padding: 12, color: "#f1f5f9" }}>{stu.username}</td>
                      <td style={{ padding: 12, color: "#cbd5e1" }}>{stu.full_name || "—"}</td>
                      <td style={{ padding: 12, color: "#cbd5e1" }}>{stu.email}</td>
                      <td style={{ padding: 12, color: "#cbd5e1" }}>{stu.grade}</td>
                      <td style={{ padding: 12 }}>
                        <button
                          onClick={() => handleViewActivity(stu)}
                          style={{
                            padding: "8px 14px",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            cursor: "pointer",
                          }}
                        >
                          📊 View Activity
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentsPanel;
