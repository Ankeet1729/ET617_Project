import React, { useState, useEffect } from "react";
import StudentActivityPanel from "./StudentActivityPanel";

interface Student {
  username: string;
  email: string;
  grade: number;
  full_name?: string; // Add this field
}

interface GradeSummary {
  grade: number;
  student_count: number;
}

const StudentsPanel: React.FC = () => {
  const [grades, setGrades] = useState<GradeSummary[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null); // FIX: Store full student object
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/students/grades", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setGrades(data);
      }
    } catch (error) {
      console.error("Error fetching grades:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (grade: number) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/admin/students/${grade}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
        setSelectedGrade(grade);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToGrades = () => {
    setSelectedGrade(null);
    setStudents([]);
  };

  // If viewing a student's activity, show StudentActivityPanel
  if (selectedStudent) {
    return (
      <StudentActivityPanel
        student={{
          username: selectedStudent.username,
          full_name: selectedStudent.full_name || selectedStudent.username, // Fallback to username if no full_name
          grade: selectedStudent.grade,
        }}
        onBack={() => setSelectedStudent(null)}
      />
    );
  }

  if (loading && !selectedGrade) {
    return <div style={{ padding: "20px", color: "#f1f5f9" }}>Loading grades...</div>;
  }

  return (
    <div style={{ padding: "20px", minHeight: "100vh" }}>
      <h2 style={{ color: "#f1f5f9", marginBottom: "30px" }}>Students Management</h2>

      {!selectedGrade ? (
        // Grade selection view
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {grades.map((grade) => (
            <div
              key={grade.grade}
              onClick={() => fetchStudents(grade.grade)}
              style={{
                padding: "30px",
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                cursor: "pointer",
                border: "1px solid #334155",
                minWidth: "200px",
                textAlign: "center",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = "#334155")}
            >
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#f1f5f9", marginBottom: "10px" }}>
                Grade {grade.grade}
              </div>
              <div style={{ color: "#94a3b8", fontSize: "14px" }}>
                {grade.student_count} Students
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Students list view
        <div>
          <button
            onClick={handleBackToGrades}
            style={{
              padding: "12px 24px",
              marginBottom: "20px",
              backgroundColor: "#334155",
              color: "#f1f5f9",
              border: "1px solid #475569",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            ← Back to Grades
          </button>

          <h3 style={{ color: "#cbd5e1", marginBottom: "20px" }}>
            Grade {selectedGrade} Students
          </h3>

          {loading ? (
            <div style={{ color: "#f1f5f9" }}>Loading students...</div>
          ) : students.length > 0 ? (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "#1e293b",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#0f172a" }}>
                  <th style={{ padding: "15px", textAlign: "left", color: "#f1f5f9" }}>Username</th>
                  <th style={{ padding: "15px", textAlign: "left", color: "#f1f5f9" }}>Email</th>
                  <th style={{ padding: "15px", textAlign: "left", color: "#f1f5f9" }}>Grade</th>
                  <th style={{ padding: "15px", textAlign: "left", color: "#f1f5f9" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.username}
                    style={{ borderBottom: "1px solid #334155" }}
                  >
                    <td style={{ padding: "15px", color: "#f1f5f9" }}>{student.username}</td>
                    <td style={{ padding: "15px", color: "#cbd5e1" }}>{student.email}</td>
                    <td style={{ padding: "15px", color: "#cbd5e1" }}>{student.grade}</td>
                    <td style={{ padding: "15px" }}>
                      <button
                        onClick={() => setSelectedStudent(student)} // FIX: Pass full student object
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        📊 View Activity
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ color: "#94a3b8" }}>No students in Grade {selectedGrade}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentsPanel;
