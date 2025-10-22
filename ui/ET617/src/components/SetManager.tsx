import React, { useState, useEffect } from "react";
import QuestionSetViewer from "./QuestionSetViewer";
import ManualSetCreator from "./ManualSetCreator";

interface QuizSet {
  id: number;
  name: string;
  question_ids: number[];
  question_count: number;
  created_at: string;
  submodule_name?: string;
  is_hidden: boolean;
}

interface Grade {
  grade: number;
  quiz_count: number;
}

interface Module {
  id: number;
  submodule_code: string;
  submodule_name: string;
  set_count: number;
}

const SetManager: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedModuleName, setSelectedModuleName] = useState<string>("");
  const [sets, setSets] = useState<QuizSet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [setName, setSetName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [viewingSetId, setViewingSetId] = useState<number | null>(null);
  const [showManualCreator, setShowManualCreator] = useState(false);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/admin/quizzes/grades", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Grades data:", data);
        setGrades(data && Array.isArray(data) ? data : []);
      } else {
        setError("Failed to fetch grades");
        setGrades([]);
      }
    } catch (err) {
      console.error("Error fetching grades:", err);
      setError("Error fetching grades");
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (setId: number, currentHiddenStatus: boolean) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/quiz_sets/${setId}/visibility`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ is_hidden: !currentHiddenStatus }),
        }
      );
  
      if (res.ok) {
        fetchSets(selectedGrade, selectedModule); // Refresh
      }
    } catch (err) {
      console.error('Error toggling visibility:', err);
    }
  };
  

  const fetchModules = async (grade: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/admin/quizzes/modules/${grade}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Modules data:", data);
        setModules(data && Array.isArray(data) ? data : []);
      } else {
        setError("Failed to fetch modules");
        setModules([]);
      }
    } catch (err) {
      console.error("Error fetching modules:", err);
      setError("Error fetching modules");
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSets = async (grade: number, submoduleCode: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:5000/admin/quizzes/sets/${grade}/${submoduleCode}`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        console.log("Sets data:", data);
        setSets(data && Array.isArray(data) ? data : []);
      } else {
        setError("Failed to fetch quiz sets");
        setSets([]);
      }
    } catch (err) {
      console.error("Error fetching sets:", err);
      setError("Error fetching quiz sets");
      setSets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedGrade || !selectedModule) return;

    setGenerating(true);
    try {
      const res = await fetch("http://localhost:5000/generatequiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          submodule_code: selectedModule,
          grade: selectedGrade,
          set_name: setName || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Quiz generated successfully! ${data.question_count} questions created.`);
        setShowGenerateForm(false);
        setSetName("");
        fetchSets(selectedGrade, selectedModule);
      } else {
        alert(`Failed to generate quiz: ${data.error || data.message}`);
      }
    } catch (err) {
      console.error("Error generating quiz:", err);
      alert("Error generating quiz");
    } finally {
      setGenerating(false);
    }
  };

  const deleteSet = async (setId: number) => {
    if (!window.confirm("Are you sure you want to delete this quiz set?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/admin/question_set/${setId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        alert("Quiz set deleted successfully!");
        if (selectedGrade && selectedModule) {
          fetchSets(selectedGrade, selectedModule);
        }
      } else {
        alert("Failed to delete quiz set");
      }
    } catch (err) {
      console.error("Error deleting set:", err);
      alert("Error deleting quiz set");
    }
  };

  

  // If viewing a specific question set, show the viewer
  if (viewingSetId) {
    return <QuestionSetViewer setId={viewingSetId} onBack={() => setViewingSetId(null)} />;
  }

  // If showing manual creator, render it
  if (showManualCreator && selectedGrade && selectedModule) {
    return (
      <ManualSetCreator
        submoduleCode={selectedModule}
        grade={selectedGrade}
        onComplete={() => {
          setShowManualCreator(false);
          fetchSets(selectedGrade, selectedModule);
        }}
        onCancel={() => setShowManualCreator(false)}
      />
    );
  }

  if (loading) return <div style={{ padding: "20px", color: "#f1f5f9" }}><p>Loading...</p></div>;
  if (error) return <div style={{ padding: "20px" }}><p style={{ color: "#ef4444" }}>{error}</p></div>;

  return (
    <div style={{ padding: "20px", minHeight: "100vh" }}>
      <h2 style={{ color: "#f1f5f9", marginBottom: "30px" }}>Manage Quiz Sets</h2>

      {/* Grades Level */}
      {!selectedGrade && (
        <div>
          <h3 style={{ color: "#cbd5e1", marginBottom: "20px" }}>Select Grade</h3>
          {grades && grades.length > 0 ? (
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              {grades.map((gradeObj) => (
                <button
                  key={gradeObj.grade}
                  onClick={() => {
                    setSelectedGrade(gradeObj.grade);
                    fetchModules(gradeObj.grade);
                  }}
                  style={{
                    padding: "20px 40px",
                    fontSize: "18px",
                    backgroundColor: "#6366f1",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#6366f1")}
                >
                  <div style={{ fontWeight: "bold" }}>Grade {gradeObj.grade}</div>
                  <div style={{ fontSize: "14px", marginTop: "5px", opacity: 0.9 }}>
                    {gradeObj.quiz_count} quiz sets
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p style={{ color: "#f87171" }}>No grades available. Please seed your database first.</p>
          )}
        </div>
      )}

      {/* Modules Level */}
      {selectedGrade && !selectedModule && (
        <div>
          <button
            onClick={() => {
              setSelectedGrade(null);
              setModules([]);
            }}
            style={{
              padding: "12px 24px",
              marginBottom: "20px",
              backgroundColor: "#334155",
              color: "#f1f5f9",
              border: "1px solid #475569",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ← Back to Grades
          </button>
          <h3 style={{ color: "#cbd5e1", marginBottom: "20px" }}>
            Select Submodule (Grade {selectedGrade})
          </h3>
          {modules && modules.length > 0 ? (
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              {modules.map((module) => (
                <button
                  key={module.submodule_code}
                  onClick={() => {
                    setSelectedModule(module.submodule_code);
                    setSelectedModuleName(module.submodule_name);
                    fetchSets(selectedGrade, module.submodule_code);
                  }}
                  style={{
                    padding: "20px 30px",
                    fontSize: "16px",
                    backgroundColor: "#8b5cf6",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                    textAlign: "left",
                    minWidth: "200px",
                  }}
                >
                  <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                    {module.submodule_code}
                  </div>
                  <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.95 }}>
                    {module.submodule_name}
                  </div>
                  <div style={{ fontSize: "13px", marginTop: "8px", opacity: 0.8 }}>
                    {module.set_count} quiz sets
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p style={{ color: "#f87171" }}>No submodules available for Grade {selectedGrade}.</p>
          )}
        </div>
      )}

      {/* Sets Level */}
      {selectedGrade && selectedModule && (
        <div>
          <button
            onClick={() => {
              setSelectedModule(null);
              setSelectedModuleName("");
              setSets([]);
              setShowGenerateForm(false);
            }}
            style={{
              padding: "12px 24px",
              marginBottom: "20px",
              backgroundColor: "#334155",
              color: "#f1f5f9",
              border: "1px solid #475569",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ← Back to Submodules
          </button>

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#f1f5f9", marginBottom: "10px" }}>
              Quiz Sets for Grade {selectedGrade}, Submodule {selectedModule}
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>{selectedModuleName}</p>
          </div>

          {/* Action Buttons */}
          <div style={{ marginBottom: "30px", display: "flex", gap: "15px" }}>
            <button
              onClick={() => setShowGenerateForm(!showGenerateForm)}
              style={{
                padding: "15px 30px",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
              }}
            >
              🤖 Generate AI Quiz
            </button>
            <button
              onClick={() => setShowManualCreator(true)}
              style={{
                padding: "15px 30px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
              }}
            >
              ✏️ Create Manual Set
            </button>
          </div>

          {/* Generate Quiz Form */}
          {showGenerateForm && (
            <div
              style={{
                backgroundColor: "#1e293b",
                padding: "25px",
                borderRadius: "12px",
                marginBottom: "30px",
                border: "1px solid #334155",
              }}
            >
              <h4 style={{ color: "#f1f5f9", marginBottom: "15px" }}>Generate New Quiz</h4>
              <input
                type="text"
                placeholder="Quiz Set Name (optional)"
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                  backgroundColor: "#0f172a",
                  color: "#f1f5f9",
                  border: "1px solid #475569",
                  borderRadius: "6px",
                  fontSize: "16px",
                }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleGenerateQuiz}
                  disabled={generating}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: generating ? "#64748b" : "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: generating ? "not-allowed" : "pointer",
                    fontSize: "16px",
                  }}
                >
                  {generating ? "Generating..." : "Generate Quiz"}
                </button>
                <button
                  onClick={() => {
                    setShowGenerateForm(false);
                    setSetName("");
                  }}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Quiz Sets List */}
          {sets && sets.length > 0 ? (
            <div>
              {sets.map((set) => (
                <div
                  key={set.id}
                  style={{
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    padding: "20px",
                    margin: "15px 0",
                    backgroundColor: "#1e293b",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 15px 0", color: "#f1f5f9", fontSize: "20px" }}>
                        {set.name}
                      </h4>
                      <div style={{ color: "#94a3b8", fontSize: "14px" }}>
                        <p style={{ margin: "5px 0" }}>
                          <strong style={{ color: "#cbd5e1" }}>Questions:</strong> {set.question_count || 0}
                        </p>
                        <p style={{ margin: "5px 0" }}>
                          <strong style={{ color: "#cbd5e1" }}>Created:</strong>{" "}
                          {new Date(set.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => setViewingSetId(set.id)}
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        View Details
                      </button>
                      <button
                      onClick={() => handleToggleVisibility(set.id, set.is_hidden)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: set.is_hidden ? '#10b981' : '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      {set.is_hidden ? '👁️ Show' : '🙈 Hide'}
                    </button>
                      <button
                        onClick={() => deleteSet(set.id)}
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <details style={{ marginTop: "15px" }}>
                    <summary
                      style={{
                        cursor: "pointer",
                        fontWeight: "bold",
                        color: "#818cf8",
                        fontSize: "14px",
                      }}
                    >
                      View Question IDs
                    </summary>
                    <pre
                      style={{
                        backgroundColor: "#0f172a",
                        color: "#e2e8f0",
                        padding: "15px",
                        borderRadius: "6px",
                        overflow: "auto",
                        marginTop: "10px",
                        fontSize: "13px",
                      }}
                    >
                      {JSON.stringify(set.question_ids, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                border: "2px dashed #475569",
              }}
            >
              <p style={{ fontSize: "18px", margin: "0 0 10px 0", color: "#f1f5f9" }}>
                📭 No quiz sets yet for this grade and submodule.
              </p>
              <p style={{ margin: 0, color: "#94a3b8" }}>
                Use the "Generate AI Quiz" or "Create Manual Set" buttons above to create your first set!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SetManager;
