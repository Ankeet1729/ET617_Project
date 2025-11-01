import React, { useState, useEffect } from "react";
import QuestionSetViewer from "./QuestionSetViewer";
import ManualSetCreator from "./ManualSetCreator";

const API_BASE_URL = import.meta.env.BACKEND_URL || "http://localhost:5000";

interface QuizSet {
  id: number;
  name: string;
  question_ids: number[];
  question_count: number;
  created_at: string;
  submodule_name?: string;
  is_hidden: boolean;
  reattempts_allowed?: boolean;
}

interface Grade {
  grade: number;
  quiz_count: number;
}

interface Supermodule {
  id: number;
  supermodule_code: string;
  supermodule_name: string;
}

interface Module {
  id: number;
  submodule_code: string;
  submodule_name: string;
  set_count: number;
}

const apiFetch = async (url: string, opts: RequestInit = {}) => {
  const res = await fetch(url, { credentials: "include", ...opts });
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) throw json || { message: text || res.statusText };
    return json;
  } catch (e) {
    // text might not be JSON
    if (!res.ok) throw { message: text || res.statusText };
    return null;
  }
};

const SetManager: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [supermodules, setSupermodules] = useState<Supermodule[]>([]);
  const [selectedSupermodule, setSelectedSupermodule] = useState<string | null>(null);
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

  /* ---------- Fetchers ---------- */

  const fetchGrades = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(`${API_BASE_URL}/admin/quizzes/grades`);
      // expect array or fallback to empty
      setGrades(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("fetchGrades error:", err);
      setError(err?.message || "Failed to fetch grades");
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupermodules = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(`${API_BASE_URL}/api/supermodules`);
      setSupermodules(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("fetchSupermodules error:", err);
      setError(err?.message || "Failed to fetch modules list");
      setSupermodules([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async (supermoduleCode: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(
        `http://localhost:5000/api/supermodules/${supermoduleCode}/children`
      );
      setModules(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("fetchModules error:", err);
      setError(err?.message || "Failed to fetch submodules");
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSets = async (grade: number, submoduleCode: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(
        `http://localhost:5000/admin/quizzes/sets/${grade}/${submoduleCode}`
      );
      const arr = Array.isArray(data) ? data : [];
      setSets(arr);

      // trigger fetching reattempts_allowed for each set (non-blocking)
      arr.forEach((s: any) => {
        if (s?.id) fetchReattemptsAllowed(s.id);
      });
    } catch (err: any) {
      console.error("fetchSets error:", err);
      setError(err?.message || "Failed to fetch quiz sets");
      setSets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReattemptsAllowed = async (setId: number) => {
    try {
      const data = await apiFetch(
        `http://localhost:5000/api/admin/quiz_sets/${setId}/fetch_reattempts_allowed`
      );
      setSets((prev) => prev.map((s) => (s.id === setId ? { ...s, reattempts_allowed: !!data?.reattempts_allowed } : s)));
    } catch (err) {
      // don't treat as fatal for the entire view; just log
      console.error(`fetchReattemptsAllowed(${setId}) error:`, err);
    }
  };

  /* ---------- Actions ---------- */

  const handleToggleVisibility = async (setId: number, currentHiddenStatus: boolean) => {
    // optimistic update
    setSets((prev) => prev.map((s) => (s.id === setId ? { ...s, is_hidden: !currentHiddenStatus } : s)));
    try {
      await apiFetch(`http://localhost:5000/api/admin/quiz_sets/${setId}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_hidden: !currentHiddenStatus }),
      });
    } catch (err) {
      console.error("toggle visibility failed:", err);
      // rollback
      setSets((prev) => prev.map((s) => (s.id === setId ? { ...s, is_hidden: currentHiddenStatus } : s)));
      alert("Failed to update visibility");
    }
  };

  const handleToggleReattempts = async (setId: number, currentReattemptsAllowed: boolean) => {
    // optimistic update
    setSets((prev) => prev.map((s) => (s.id === setId ? { ...s, reattempts_allowed: !currentReattemptsAllowed } : s)));
    try {
      await apiFetch(`http://localhost:5000/api/admin/quiz_sets/${setId}/reattempts_allowed`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reattempts_allowed: !currentReattemptsAllowed }),
      });
    } catch (err) {
      console.error("toggle reattempts failed:", err);
      // rollback
      setSets((prev) => prev.map((s) => (s.id === setId ? { ...s, reattempts_allowed: currentReattemptsAllowed } : s)));
      alert("Failed to toggle reattempts allowed");
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedGrade || !selectedModule) return;
    setGenerating(true);
    try {
      const data = await apiFetch(`${API_BASE_URL}/generatequiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submodule_code: selectedModule,
          grade: selectedGrade,
          set_name: setName || undefined,
        }),
      });

      alert(`Quiz generated successfully! ${data?.question_count ?? 0} questions created.`);
      setShowGenerateForm(false);
      setSetName("");
      fetchSets(selectedGrade, selectedModule);
    } catch (err: any) {
      console.error("handleGenerateQuiz error:", err);
      alert(err?.message || "Failed to generate quiz");
    } finally {
      setGenerating(false);
    }
  };

  const deleteSet = async (setId: number) => {
    if (!window.confirm("Are you sure you want to delete this quiz set?")) return;
    try {
      await apiFetch(`http://localhost:5000/admin/question_set/${setId}`, { method: "DELETE" });
      alert("Quiz set deleted successfully!");
      if (selectedGrade && selectedModule) fetchSets(selectedGrade, selectedModule);
    } catch (err) {
      console.error("deleteSet error:", err);
      alert("Failed to delete quiz set");
    }
  };

  /* ---------- Render short-circuits ---------- */

  if (viewingSetId) {
    return <QuestionSetViewer setId={viewingSetId} onBack={() => setViewingSetId(null)} />;
  }

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

  /* ---------- UI ---------- */

  return (
    <div className="set-manager" style={{ padding: 20, minHeight: "100vh" }}>
      <h2 style={{ color: "#f1f5f9", marginBottom: 24 }}>Manage Quiz Sets</h2>

      {loading && (
        <div style={{ padding: 20, color: "#f1f5f9" }}>
          <p>Loading…</p>
        </div>
      )}

      {error && (
        <div style={{ padding: 20 }}>
          <p style={{ color: "#ef4444" }}>{error}</p>
        </div>
      )}

      {/* Grades */}
      {!selectedGrade && !loading && (
        <section>
          <h3 style={{ color: "#cbd5e1", marginBottom: 12 }}>Select Grade</h3>
          {grades.length ? (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {grades.map((g) => (
                <button
                  key={g.grade}
                  onClick={() => {
                    setSelectedGrade(g.grade);
                    fetchSupermodules();
                  }}
                  className="pill primary"
                >
                  <div style={{ fontWeight: 700 }}>Grade {g.grade}</div>
                  <div style={{ fontSize: 13, opacity: 0.9 }}>{g.quiz_count} quiz sets</div>
                </button>
              ))}
            </div>
          ) : (
            <p style={{ color: "#f87171" }}>No grades available. Please seed your DB.</p>
          )}
        </section>
      )}

      {/* Supermodules */}
      {selectedGrade && !selectedSupermodule && (
        <section style={{ marginTop: 18 }}>
          <button onClick={() => { setSelectedGrade(null); setSupermodules([]); }} className="btn back">← Back to Grades</button>
          <h3 style={{ color: "#cbd5e1", marginTop: 12 }}>Select Module (Grade {selectedGrade})</h3>
          {supermodules.length ? (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
              {supermodules.map((sm) => (
                <button
                  key={sm.supermodule_code}
                  onClick={() => {
                    setSelectedSupermodule(sm.supermodule_code);
                    fetchModules(sm.supermodule_code);
                  }}
                  className="pill purple"
                >
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{sm.supermodule_code}</div>
                  <div style={{ fontSize: 13 }}>{sm.supermodule_name}</div>
                </button>
              ))}
            </div>
          ) : (
            <p style={{ color: "#f87171" }}>No modules available for Grade {selectedGrade}.</p>
          )}
        </section>
      )}

      {/* Modules (videos/submodules) */}
      {selectedGrade && selectedSupermodule && !selectedModule && (
        <section style={{ marginTop: 18 }}>
          <button onClick={() => { setSelectedSupermodule(null); setModules([]); }} className="btn back">← Back to Modules</button>
          <h3 style={{ color: "#cbd5e1", marginTop: 12 }}>{selectedSupermodule} - Select Video</h3>
          {modules.length ? (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
              {modules.map((m) => (
                <button
                  key={m.submodule_code}
                  onClick={() => {
                    setSelectedModule(m.submodule_code);
                    setSelectedModuleName(m.submodule_name);
                    fetchSets(selectedGrade, m.submodule_code);
                  }}
                  className="pill pink"
                >
                  <div style={{ fontWeight: 700 }}>{m.submodule_code}</div>
                  <div style={{ fontSize: 13 }}>{m.submodule_name}</div>
                </button>
              ))}
            </div>
          ) : (
            <p style={{ color: "#f87171" }}>No videos available for {selectedSupermodule}.</p>
          )}
        </section>
      )}

      {/* Sets */}
      {selectedGrade && selectedModule && (
        <section style={{ marginTop: 18 }}>
          <button onClick={() => { setSelectedModule(null); setSelectedModuleName(""); setSets([]); setShowGenerateForm(false); }} className="btn back">← Back to Videos</button>

          <div style={{ margin: "16px 0 24px 0" }}>
            <h3 style={{ color: "#f1f5f9", marginBottom: 8 }}>Quiz Sets for Grade {selectedGrade}, Video {selectedModule}</h3>
            <p style={{ color: "#94a3b8", margin: 0 }}>{selectedModuleName}</p>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
            <button onClick={() => setShowGenerateForm((s) => !s)} className="btn green">🤖 Generate AI Quiz</button>
            <button onClick={() => setShowManualCreator(true)} className="btn blue">✏️ Create Manual Set</button>
          </div>

          {showGenerateForm && (
            <div className="card dark" style={{ marginBottom: 18 }}>
              <h4 style={{ marginTop: 0 }}>Generate New Quiz</h4>
              <input
                placeholder="Quiz Set Name (optional)"
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
                style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 6, border: "1px solid #475569", background: "#0f172a", color: "#f1f5f9" }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleGenerateQuiz} className="btn green" disabled={generating}>{generating ? "Generating..." : "Generate Quiz"}</button>
                <button onClick={() => { setShowGenerateForm(false); setSetName(""); }} className="btn red">Cancel</button>
              </div>
            </div>
          )}

          {/* Sets list */}
          {sets.length ? (
            <div>
              {sets.map((s) => (
                <div key={s.id} className="card dark" style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 8px 0", color: "#f1f5f9" }}>{s.name}</h4>
                      <div style={{ color: "#94a3b8", fontSize: 14 }}>
                        <div><strong style={{ color: "#cbd5e1" }}>Questions:</strong> {s.question_count ?? 0}</div>
                        <div><strong style={{ color: "#cbd5e1" }}>Created:</strong> {new Date(s.created_at).toLocaleString()}</div>
                        <div style={{ marginTop: 8 }}>
                          <strong style={{ color: "#cbd5e1" }}>Reattempts Allowed:</strong>{" "}
                          <span style={{ fontWeight: 700, color: s.reattempts_allowed ? "#10b981" : "#ef4444" }}>
                            {s.reattempts_allowed ? "Yes" : "No"}
                          </span>
                          <button onClick={() => handleToggleReattempts(s.id, !!s.reattempts_allowed)} className="small-btn" style={{ marginLeft: 10 }}>
                            {s.reattempts_allowed ? "Disable" : "Enable"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <button onClick={() => setViewingSetId(s.id)} className="btn blue">View Details</button>
                      <button onClick={() => handleToggleVisibility(s.id, s.is_hidden)} className="btn" style={{ background: s.is_hidden ? "#10b981" : "#f59e0b" }}>
                        {s.is_hidden ? "👁️ Show" : "🙈 Hide"}
                      </button>
                      <button onClick={() => deleteSet(s.id)} className="btn red">Delete</button>
                    </div>
                  </div>

                  <details style={{ marginTop: 12 }}>
                    <summary style={{ cursor: "pointer", fontWeight: 700, color: "#818cf8" }}>View Question IDs</summary>
                    <pre style={{ background: "#0f172a", color: "#e2e8f0", padding: 12, borderRadius: 6, overflow: "auto", marginTop: 10 }}>
                      {JSON.stringify(s.question_ids, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          ) : (
            <div className="card dark" style={{ padding: 30, textAlign: "center", borderStyle: "dashed" }}>
              <p style={{ color: "#f1f5f9", fontSize: 18, marginBottom: 8 }}>📭 No quiz sets yet for this video.</p>
              <p style={{ color: "#94a3b8", margin: 0 }}>Use the actions above to create your first set.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default SetManager;
