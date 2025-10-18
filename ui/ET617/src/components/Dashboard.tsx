import React, { useState, useEffect } from "react";
import QuizView from "./QuizView";

interface Module {
  id: number;
  submodule_code: string;
  submodule_name: string;
  image_path: string | null;
  set_count: number;
}

interface QuizSet {
  id: number;
  name: string;
  question_count: number;
  created_at: string;
  submodule_name: string;
}

interface DashboardProps {
  username: string;
  grade: number | null;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ username, grade, onLogout }) => {
  const [viewLevel, setViewLevel] = useState<"modules" | "sets" | "quiz">("modules");
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedModuleName, setSelectedModuleName] = useState<string>("");
  const [sets, setSets] = useState<QuizSet[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (grade) {
      fetchModules();
    }
  }, [grade]);

  const fetchModules = async () => {
    console.log("🔍 [Dashboard] Fetching modules for grade:", grade);
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`http://localhost:5000/api/student/modules/${grade}`, {
        credentials: "include",
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log("✅ [Dashboard] Modules fetched:", data);
        setModules(data);
      } else {
        console.error("❌ [Dashboard] Failed to fetch modules");
        setMessage("Failed to load modules");
      }
    } catch (error) {
      console.error("❌ [Dashboard] Error fetching modules:", error);
      setMessage("Error loading modules");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizSets = async (submoduleCode: string) => {
    console.log("🔍 [Dashboard] Fetching quiz sets for:", submoduleCode, "grade:", grade);
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        `http://localhost:5000/api/student/quiz_sets/${grade}/${submoduleCode}`,
        { credentials: "include" }
      );
      
      if (res.ok) {
        const data = await res.json();
        console.log("✅ [Dashboard] Quiz sets fetched:", data);
        setSets(data);
        setViewLevel("sets");
      } else {
        console.error("❌ [Dashboard] Failed to fetch quiz sets");
        setMessage("Failed to load quiz sets");
      }
    } catch (error) {
      console.error("❌ [Dashboard] Error fetching quiz sets:", error);
      setMessage("Error loading quiz sets");
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = (module: Module) => {
    console.log("🔍 [Dashboard] Module clicked:", module.submodule_code);
    setSelectedModule(module.submodule_code);
    setSelectedModuleName(module.submodule_name);
    fetchQuizSets(module.submodule_code);
  };

  const handleStartQuiz = async (setId: number, setName: string) => {
    console.log("🔍 [Dashboard] Starting quiz:", setId);
    setMessage("");
    try {
      const res = await fetch(`http://localhost:5000/api/fetch_quiz/${setId}`, {
        credentials: "include",
      });
      
      if (res.ok) {
        const quizData = await res.json();
        console.log("✅ [Dashboard] Quiz data fetched:", quizData);
        setSelectedQuiz({
          id: setId,
          name: setName,
          data: quizData,
        });
        setViewLevel("quiz");
      } else {
        console.error("❌ [Dashboard] Failed to load quiz");
        setMessage("Failed to load quiz");
      }
    } catch (error) {
      console.error("❌ [Dashboard] Error fetching quiz:", error);
      setMessage("Error loading quiz");
    }
  };

  const handleBackToModules = () => {
    console.log("🔍 [Dashboard] Back to modules");
    setViewLevel("modules");
    setSelectedModule(null);
    setSelectedModuleName("");
    setSets([]);
    setMessage("");
  };

  const handleBackToSets = () => {
    console.log("🔍 [Dashboard] Back to sets");
    setViewLevel("sets");
    setSelectedQuiz(null);
    setMessage("");
  };

  // If taking a quiz, show QuizView
  if (viewLevel === "quiz" && selectedQuiz) {
    return (
      <QuizView
        quizName={selectedQuiz.name}
        quizData={selectedQuiz.data}
        quizId={selectedQuiz.id}
        username={username}
        grade={String(grade)}
        onBack={handleBackToSets}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", padding: "20px" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
          padding: "30px",
          marginBottom: "30px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 10px 0", fontSize: "28px", fontWeight: "bold" }}>
            Welcome, {username}!
          </h1>
          <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>
            Grade: {grade} | Ready to learn?
          </p>
        </div>
        <button
          onClick={onLogout}
          style={{
            padding: "12px 24px",
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")}
        >
          Logout
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          style={{
            backgroundColor: "#fef3c7",
            color: "#92400e",
            padding: "15px 20px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #fbbf24",
            fontSize: "14px",
          }}
        >
          {message}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ color: "#f1f5f9", textAlign: "center", padding: "60px 20px" }}>
          <div
            style={{
              display: "inline-block",
              width: "50px",
              height: "50px",
              border: "5px solid #334155",
              borderTopColor: "#6366f1",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ fontSize: "18px", marginTop: "20px" }}>Loading...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Modules View */}
      {!loading && viewLevel === "modules" && (
        <div>
          <h2 style={{ color: "#f1f5f9", marginBottom: "25px", fontSize: "24px", fontWeight: "bold" }}>
            Select a Module
          </h2>

          {modules.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "25px",
              }}
            >
              {modules.map((module) => (
                <div
                  key={module.submodule_code}
                  onClick={() => handleModuleClick(module)}
                  style={{
                    backgroundColor: "#1e293b",
                    borderRadius: "16px",
                    padding: "0",
                    cursor: "pointer",
                    border: "2px solid #334155",
                    transition: "all 0.3s",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                    overflow: "hidden",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#6366f1";
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.5)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#334155";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.3)";
                  }}
                >
                  {module.image_path && (
                    <div style={{ width: "100%", height: "180px", overflow: "hidden" }}>
                      <img
                        src={`http://localhost:5000/${module.image_path}`}
                        alt={module.submodule_name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                  
                  <div style={{ padding: "25px" }}>
                    <h3
                      style={{
                        color: "#6366f1",
                        margin: "0 0 12px 0",
                        fontSize: "22px",
                        fontWeight: "bold",
                      }}
                    >
                      {module.submodule_code}
                    </h3>
                    
                    <p
                      style={{
                        color: "#cbd5e1",
                        margin: "0 0 20px 0",
                        fontSize: "15px",
                        lineHeight: "1.6",
                        minHeight: "48px",
                      }}
                    >
                      {module.submodule_name}
                    </p>
                    
                    <div
                      style={{
                        backgroundColor: "#334155",
                        padding: "12px",
                        borderRadius: "8px",
                        textAlign: "center",
                        marginBottom: "15px",
                      }}
                    >
                      <span style={{ color: "#f1f5f9", fontSize: "15px", fontWeight: "bold" }}>
                        {module.set_count} Quiz {module.set_count === 1 ? "Set" : "Sets"} Available
                      </span>
                    </div>
                    
                    <div
                      style={{
                        textAlign: "center",
                        color: "#818cf8",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      Click to view quiz sets →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "#1e293b",
                padding: "60px 40px",
                borderRadius: "16px",
                textAlign: "center",
                border: "2px dashed #334155",
              }}
            >
              <p style={{ color: "#f87171", fontSize: "20px", margin: "0 0 15px 0", fontWeight: "bold" }}>
                📚 No modules available for your grade yet.
              </p>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "16px" }}>
                Please contact your teacher to get started!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Quiz Sets View */}
      {!loading && viewLevel === "sets" && (
        <div>
          <button
            onClick={handleBackToModules}
            style={{
              padding: "12px 24px",
              marginBottom: "25px",
              backgroundColor: "#334155",
              color: "#f1f5f9",
              border: "1px solid #475569",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#475569")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#334155")}
          >
            ← Back to Modules
          </button>

          <div style={{ marginBottom: "30px" }}>
            <h2 style={{ color: "#f1f5f9", marginBottom: "8px", fontSize: "26px", fontWeight: "bold" }}>
              Quiz Sets - {selectedModule}
            </h2>
            <p style={{ color: "#94a3b8", margin: 0, fontSize: "15px" }}>
              {selectedModuleName}
            </p>
          </div>

          {sets.length > 0 ? (
            <div style={{ display: "grid", gap: "20px" }}>
              {sets.map((set) => (
                <div
                  key={set.id}
                  style={{
                    backgroundColor: "#1e293b",
                    borderRadius: "12px",
                    padding: "25px",
                    border: "2px solid #334155",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = "#475569")}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = "#334155")}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "20px",
                    }}
                  >
                    <div style={{ flex: "1", minWidth: "250px" }}>
                      <h3 style={{ color: "#f1f5f9", margin: "0 0 15px 0", fontSize: "20px", fontWeight: "bold" }}>
                        {set.name}
                      </h3>
                      <div style={{ color: "#94a3b8", fontSize: "14px" }}>
                        <p style={{ margin: "8px 0" }}>
                          <strong style={{ color: "#cbd5e1" }}>📝 Questions:</strong>{" "}
                          {set.question_count}
                        </p>
                        <p style={{ margin: "8px 0" }}>
                          <strong style={{ color: "#cbd5e1" }}>📅 Created:</strong>{" "}
                          {new Date(set.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartQuiz(set.id, set.name)}
                      style={{
                        padding: "16px 32px",
                        backgroundColor: "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "bold",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                        transition: "all 0.2s",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#059669";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.4)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#10b981";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.3)";
                      }}
                    >
                      Start Quiz →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "#1e293b",
                padding: "60px 40px",
                borderRadius: "16px",
                textAlign: "center",
                border: "2px dashed #334155",
              }}
            >
              <p style={{ color: "#f87171", fontSize: "20px", margin: "0 0 15px 0", fontWeight: "bold" }}>
                📭 No quiz sets available yet for this module.
              </p>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "16px" }}>
                Your teacher hasn't created any quizzes yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
