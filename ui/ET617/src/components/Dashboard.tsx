import React, { useState, useEffect } from "react";
import QuizView from "./QuizView";
import QuizResults from "./QuizResults";

const API_BASE_URL = import.meta.env.BACKEND_URL || "http://localhost:5000";

interface Supermodule { id: number; supermodule_code: string; supermodule_name: string; }
interface Module { id: number; submodule_code: string; submodule_name: string; image_path: string | null; set_count: number; }
interface QuizSet { id: number; name: string; question_count: number; created_at: string; submodule_name: string; attempted?: boolean; reattempts_allowed?: boolean; }

interface DashboardProps {
  username: string;
  grade: number | null;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ username, grade, onLogout }) => {
  const [viewLevel, setViewLevel] = useState<"supermodules" | "modules" | "sets" | "quiz" | "results">("supermodules");
  const [supermodules, setSupermodules] = useState<Supermodule[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedSupermodule, setSelectedSupermodule] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedModuleName, setSelectedModuleName] = useState<string>("");
  const [sets, setSets] = useState<QuizSet[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [resultsData, setResultsData] = useState<any>(null);

  useEffect(() => {
    if (grade) fetchSupermodules();
  }, [grade]);

  const fetchSupermodules = async () => {
    setLoading(true); setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/supermodules`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSupermodules(data);
      } else {
        setMessage("Failed to load modules");
      }
    } catch (err) {
      setMessage("Error loading modules");
    } finally { setLoading(false); }
  };

  const fetchModules = async (supermoduleCode: string) => {
    setLoading(true); setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/supermodules/${supermoduleCode}/children`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setModules(data);
        setViewLevel("modules");
      } else setMessage("Failed to load submodules");
    } catch (err) { setMessage("Error loading submodules"); }
    finally { setLoading(false); }
  };

  const fetchQuizSets = async (submoduleCode: string) => {
    setLoading(true); setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/student/quiz-sets/${grade}/${submoduleCode}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSets(data);
        setViewLevel("sets");
      } else setMessage("Failed to load quiz sets");
    } catch (err) { setMessage("Error loading quiz sets"); }
    finally { setLoading(false); }
  };

  const handleSupermoduleClick = (sm: Supermodule) => {
    setSelectedSupermodule(sm.supermodule_code);
    fetchModules(sm.supermodule_code);
  };

  const handleModuleClick = (m: Module) => {
    setSelectedModule(m.submodule_code);
    setSelectedModuleName(m.submodule_name);
    fetchQuizSets(m.submodule_code);
  };

  const handleStartQuiz = async (setId: number, setName: string) => {
    setMessage(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/fetch_quiz/${setId}`, { credentials: "include" });
      if (res.ok) {
        const quizData = await res.json();
        setSelectedQuiz({ id: setId, name: setName, data: quizData });
        setViewLevel("quiz");
      } else setMessage("Failed to load quiz");
    } catch (err) { setMessage("Error loading quiz"); }
    finally { setLoading(false); }
  };

  const handleShowResults = async (quizSetId: number) => {
    setMessage("Loading results..."); setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/get_last_result/${quizSetId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch results");
      const data = await res.json();
      const results = data.results || [];
      const correctAnswers = results.filter((r: any) => r.isCorrect || r.is_correct).length;
      const totalQuestions = results.length || 1;
      const percentage = Math.round((correctAnswers / totalQuestions) * 100);

      const transformedData = {
        quiz_id: quizSetId,
        totalQuestions,
        correctAnswers,
        percentage,
        gradeLevel: calculateGradeLevel(results),
        results: results.map((r: any, idx: number) => ({
          questionIndex: idx + 1,
          question: r.question || r.q,
          userAnswer: r.userAnswer || r.answer,
          correctAnswer: r.correctAnswer || r.correct,
          isCorrect: !!(r.isCorrect || r.is_correct),
          explanation: r.explanation,
          bloom_level: r.bloom_level,
          concept: r.concept,
          type: r.type,
          needs_image: !!r.image_path,
          options: r.options || []
        })),
        submittedAt: data.submitted_at
      };

      setResultsData(transformedData);
      setViewLevel("results");
      setMessage("");
    } catch (err) {
      setMessage("Failed to load results");
    } finally { setLoading(false); }
  };

  const calculateGradeLevel = (results: any[]) => {
    if (!results || results.length === 0) return "No attempts";
    const correctCount = results.filter((r: any) => r.is_correct || r.isCorrect).length;
    const percentage = Math.round((correctCount / results.length) * 100);
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Good";
    if (percentage >= 70) return "Satisfactory";
    if (percentage >= 60) return "Below Average";
    return "Needs Improvement";
  };

  const handleBackToSupermodules = () => { setViewLevel("supermodules"); setSelectedSupermodule(null); setModules([]); setMessage(""); };
  const handleBackToModules = () => { setViewLevel("modules"); setSelectedModule(null); setSelectedModuleName(""); setSets([]); setMessage(""); };
  const handleBackToSets = () => { setViewLevel("sets"); setSelectedQuiz(null); setResultsData(null); setMessage(""); };

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

  if (viewLevel === "results" && resultsData) {
    return <QuizResults evaluationResult={resultsData} onReturnToDashboard={handleBackToSets} />;
  }

  return (
    <div style={{ minHeight: "100vh", padding: "20px 16px", background: "linear-gradient(180deg,var(--background), #eef6ff)" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0 }}>{`Welcome, ${username}`}</h1>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>Grade: {grade ?? "—"} • Ready to learn?</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onLogout} className="secondary" style={{ padding: "10px 14px" }}>Logout</button>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1100 }}>
        {message && (
          <div style={{ background: "rgba(255,244,229,0.9)", color: "var(--text-primary)", padding: 12, borderRadius: 10, marginBottom: 14, border: "1px solid var(--border)" }}>
            {message}
          </div>
        )}

        {loading && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>
            <div style={{ display: "inline-block", width: 48, height: 48, border: "6px solid var(--surface-2)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <p style={{ marginTop: 12 }}>Loading...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {!loading && viewLevel === "supermodules" && (
          <>
            <h2 style={{ marginTop: 0, marginBottom: 16 }}>Select a Module</h2>
            {supermodules.length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16
              }}>
                {supermodules.map((sm) => (
                  <button
                    key={sm.supermodule_code}
                    onClick={() => handleSupermoduleClick(sm)}
                    style={{
                      textAlign: "left",
                      padding: 20,
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                      cursor: "pointer",
                      boxShadow: "0 6px 18px rgba(2,6,23,0.04)",
                      transition: "transform .14s ease, box-shadow .14s ease"
                    }}
                    aria-label={`Open ${sm.supermodule_name}`}
                  >
                    <div style={{ color: "var(--primary)", fontWeight: 700, fontSize: 16 }}>{sm.supermodule_code}</div>
                    <div style={{ color: "var(--text-secondary)", marginTop: 8 }}>{sm.supermodule_name}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ padding: 30, borderRadius: 12, background: "var(--surface)", border: "1px dashed var(--border)" }}>
                <strong style={{ color: "var(--text-primary)" }}>No modules available yet.</strong>
                <div style={{ color: "var(--text-secondary)", marginTop: 8 }}>Check back later or contact your instructor.</div>
              </div>
            )}
          </>
        )}

        {!loading && viewLevel === "modules" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <button className="secondary" onClick={handleBackToSupermodules}>← Back</button>
              <h2 style={{ margin: 0 }}>{selectedSupermodule}</h2>
              <div />
            </div>

            {modules.length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 16
              }}>
                {modules.map((m) => (
                  <article key={m.submodule_code} style={{ borderRadius: 12, overflow: "hidden", background: "var(--surface)", border: "1px solid var(--border)" }}>
                    {m.image_path && (
                      <div style={{ width: "100%", height: 160, overflow: "hidden" }}>
                        <img src={`${API_BASE_URL}${m.image_path}`} alt={m.submodule_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    <div style={{ padding: 16 }}>
                      <h3 style={{ margin: 0, color: "var(--primary)" }}>{m.submodule_code}</h3>
                      <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>{m.submodule_name}</p>
                      <div style={{ marginTop: 12 }}>
                        <button onClick={() => handleModuleClick(m)} className="submit-button" style={{ padding: "10px 14px" }}>
                          Open videos & quizzes
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div style={{ padding: 30, borderRadius: 12, background: "var(--surface)", border: "1px dashed var(--border)" }}>
                <strong style={{ color: "var(--text-primary)" }}>No content yet for this module.</strong>
                <div style={{ color: "var(--text-secondary)", marginTop: 8 }}>Teacher hasn't uploaded videos/quizzes.</div>
              </div>
            )}
          </>
        )}

        {!loading && viewLevel === "sets" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <button className="secondary" onClick={handleBackToModules}>← Back</button>
              <div>
                <h2 style={{ margin: 0 }}>Quiz Sets - {selectedModule}</h2>
                <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>{selectedModuleName}</div>
              </div>
              <div />
            </div>

            {sets.length > 0 ? (
              <div style={{ display: "grid", gap: 12 }}>
                {sets.map((set) => {
                  const attempted = !!set.attempted;
                  const noReattempts = set.reattempts_allowed === false;
                  const blockReattempt = attempted && noReattempts;

                  return (
                    <div key={set.id} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 14,
                      borderRadius: 12,
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      gap: 12,
                      flexWrap: "wrap"
                    }}>
                      <div style={{ minWidth: 200, flex: 1 }}>
                        <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{set.name}</div>
                        <div style={{ color: "var(--text-secondary)", marginTop: 6 }}>
                          📝 {set.question_count} questions • Created {new Date(set.created_at).toLocaleDateString()}
                        </div>
                        {blockReattempt && <div style={{ marginTop: 8, display: "inline-block", padding: "6px 10px", background: "#fff7ed", color: "#92400e", borderRadius: 8, fontWeight: 600 }}>Attempted (no reattempts)</div>}
                      </div>

                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          onClick={() => handleStartQuiz(set.id, set.name)}
                          disabled={blockReattempt}
                          style={{
                            padding: "10px 14px",
                            background: blockReattempt ? "var(--surface-2)" : "var(--secondary)",
                            color: "white",
                            borderRadius: 10,
                            border: "none",
                            cursor: blockReattempt ? "not-allowed" : "pointer",
                            fontWeight: 700
                          }}
                        >
                          {blockReattempt ? "Attempted" : "Start Quiz"}
                        </button>

                        <button
                          onClick={() => handleShowResults(set.id)}
                          disabled={!attempted}
                          style={{
                            padding: "10px 14px",
                            background: attempted ? "var(--primary)" : "var(--surface-2)",
                            color: attempted ? "white" : "var(--text-secondary)",
                            borderRadius: 10,
                            border: "none",
                            cursor: attempted ? "pointer" : "not-allowed",
                            fontWeight: 700
                          }}
                        >
                          Results
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: 24, borderRadius: 12, background: "var(--surface)", border: "1px dashed var(--border)" }}>
                <strong style={{ color: "var(--text-primary)" }}>No quiz sets yet.</strong>
                <div style={{ color: "var(--text-secondary)", marginTop: 8 }}>Your teacher hasn't created quizzes for this topic.</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
