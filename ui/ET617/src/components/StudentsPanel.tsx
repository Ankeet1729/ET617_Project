import React, { useState, useEffect } from "react";
import StudentActivityPanel from "./StudentActivityPanel";

interface Student {
  username: string;
  email: string;
  grade: number;
}

interface GradeSummary {
  grade: number;
  student_count: number;
}

const StudentsPanel: React.FC = () => {
  const [grades, setGrades] = useState<GradeSummary[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
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
      console.error("Error fetching grades");
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
      console.error("Error fetching students");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToGrades = () => {
    setSelectedGrade(null);
    setStudents([]);
  };

  // NEW: If viewing a student's activity, show StudentActivityPanel
  if (selectedStudent) {
    return (
      <StudentActivityPanel 
        username={selectedStudent} 
        onBack={() => setSelectedStudent(null)} 
      />
    );
  }

  if (loading && !selectedGrade) {
    return <div className="loading">Loading grades...</div>;
  }

  return (
    <div className="students-panel">
      <h2 className="panel-title">Students Management</h2>

      {!selectedGrade ? (
        <div className="grades-grid">
          {grades.map((grade) => (
            <div
              key={grade.grade}
              className="grade-card"
              onClick={() => fetchStudents(grade.grade)}
            >
              <h3>Grade {grade.grade}</h3>
              <p>{grade.student_count} Students</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="students-view">
          <button onClick={handleBackToGrades} className="back-btn">
            ← Back to Grades
          </button>
          <h3 className="section-title">Grade {selectedGrade} Students</h3>
          {loading ? (
            <div className="loading">Loading students...</div>
          ) : students.length > 0 ? (
            <div className="students-table-container">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Grade</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.username}>
                      <td>{student.username}</td>
                      <td>{student.email}</td>
                      <td>{student.grade}</td>
                      <td>
                        <button
                          className="btn-activity"
                          onClick={() => setSelectedStudent(student.username)}
                        >
                          📊 View Activity
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">No students in Grade {selectedGrade}</div>
          )}
        </div>
      )}

      <style jsx>{`
        .students-panel {
          background: white;
          padding: 1.5rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .panel-title {
          color: #333;
          margin-bottom: 1rem;
          font-size: 1.8rem;
        }
        .grades-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        .grade-card {
          background: #f8f9ff;
          padding: 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid #e1e5e9;
        }
        .grade-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(102, 126, 234, 0.15);
          border-color: #667eea;
        }
        .grade-card h3 {
          color: #667eea;
          margin: 0 0 0.5rem 0;
        }
        .grade-card p {
          margin: 0.25rem 0;
          color: #666;
        }
        .students-view {
          margin-top: 1rem;
        }
        .back-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 5px;
          cursor: pointer;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          transition: background 0.2s;
        }
        .back-btn:hover {
          background: #5568d3;
        }
        .section-title {
          color: #333;
          margin-bottom: 1rem;
        }
        .students-table-container {
          overflow-x: auto;
          border-radius: 8px;
          border: 1px solid #e1e5e9;
        }
        .students-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }
        .students-table thead {
          background: #f8f9ff;
        }
        .students-table th {
          padding: 1rem;
          text-align: left;
          font-weight: bold;
          color: #667eea;
          border-bottom: 2px solid #e1e5e9;
        }
        .students-table td {
          padding: 1rem;
          border-bottom: 1px solid #f0f0f0;
          color: #333;
        }
        .students-table tbody tr:hover {
          background: #f8f9ff;
        }
        .btn-activity {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
        }
        .btn-activity:hover {
          background: #5568d3;
          transform: translateY(-1px);
        }
        .loading {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
        .no-data {
          text-align: center;
          padding: 2rem;
          color: #999;
          background: #f8f9ff;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default StudentsPanel;
