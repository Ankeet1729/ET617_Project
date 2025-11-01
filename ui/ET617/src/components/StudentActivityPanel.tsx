import React, { useEffect, useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.BACKEND_URL || "http://localhost:5000";

interface ConceptPerformance {
  concept_name: string;
  correct: number;
  incorrect: number;
}

interface Activity {
  id: number;
  submodule_code: string;
  submodule_name: string;
  grade: number;
  attempt_ids: number[];
  concept_performance: { [key: string]: ConceptPerformance } | null;
  last_attempt_at: string | null;
}

interface Attempt {
  id: number;
  question_set_id: number;
  set_name: string;
  submitted_at: string;
  score: number;
  total_questions: number;
  percentage: number;
}

interface Supermodule {
  id: number;
  supermodule_code: string;
  supermodule_name: string;
}

interface StudentActivityPanelProps {
  student: {
    username: string;
    full_name: string;
    grade: number;
  };
  onBack: () => void;
}

const apiFetch = async (url: string, opts: RequestInit = {}) => {
  const res = await fetch(url, { credentials: "include", ...opts });
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) {
      throw json || { message: text || res.statusText };
    }
    return json;
  } catch (err) {
    if (!res.ok) throw { message: text || res.statusText };
    return null;
  }
};

const StudentActivityPanel: React.FC<StudentActivityPanelProps> = ({ student, onBack }) => {
  const [supermodules, setSupermodules] = useState<Supermodule[]>([]);
  const [selectedSupermodule, setSelectedSupermodule] = useState<string | null>(null);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const [loadingSupermodules, setLoadingSupermodules] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoadingSupermodules(true);
      setError(null);
      try {
        const data = await apiFetch(`${API_BASE_URL}/api/supermodules`, {
          method: "GET",
          signal: controller.signal as any,
        });
        setSupermodules(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Error fetching supermodules:", err);
        setError(err?.message || "Failed to load modules");
        setSupermodules([]);
      } finally {
        setLoadingSupermodules(false);
      }
    };
    load();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchActivitiesForSupermodule = async (supermoduleCode: string) => {
    setSelectedActivity(null);
    setAttempts([]);
    setLoadingActivities(true);
    setError(null);
    setSelectedSupermodule(supermoduleCode);

    try {
      // fetch children submodules
      const submodules = await apiFetch(
        `${API_BASE_URL}/api/supermodules/${supermoduleCode}/children`
      );
      const submoduleCodes: string[] = Array.isArray(submodules)
        ? submodules.map((s: any) => s.submodule_code).filter(Boolean)
        : [];

      // fetch all activities for student
      const allActivities = await apiFetch(
        `${API_BASE_URL}/admin/student_activity/${student.username}/${student.grade}`
      );

      const activitiesArray: Activity[] = Array.isArray(allActivities) ? allActivities : [];

      // If we have submodule codes, filter; otherwise show all student activities for the grade
      const filtered = submoduleCodes.length
        ? activitiesArray.filter((act) => submoduleCodes.includes(act.submodule_code))
        : activitiesArray;

      setActivities(filtered);
    } catch (err: any) {
      console.error("Error fetching activities:", err);
      setError(err?.message || "Failed to load activities");
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  };

  const fetchAttempts = async (attemptIds: number[]) => {
    setAttempts([]);
    if (!attemptIds || attemptIds.length === 0) return;
    setLoadingAttempts(true);
    setError(null);
    try {
      // API expects comma separated ids
      const res = await apiFetch(
        `${API_BASE_URL}/admin/quiz_attempts?ids=${attemptIds.join(",")}`
      );
      setAttempts(Array.isArray(res) ? res : []);
    } catch (err: any) {
      console.error("Error fetching attempts:", err);
      setError(err?.message || "Failed to load attempts");
      setAttempts([]);
    } finally {
      setLoadingAttempts(false);
    }
  };

  const handleSupermoduleClick = (supermoduleCode: string) => {
    fetchActivitiesForSupermodule(supermoduleCode);
  };

  const handleViewActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    // safe-guard attempt ids
    const ids = Array.isArray(activity.attempt_ids) ? activity.attempt_ids : [];
    fetchAttempts(ids);
  };

  // memoize concept performance array
  const conceptPerformance = useMemo(() => {
    if (!selectedActivity || !selectedActivity.concept_performance) return [];
    return Object.values(selectedActivity.concept_performance);
  }, [selectedActivity]);

  // Loading placeholder
  if (loadingSupermodules) {
    return <div style={{ padding: 20, color: "#f1f5f9" }}>Loading modules...</div>;
  }

  // Error fallback
  if (error && !selectedSupermodule && !selectedActivity) {
    return (
      <div style={{ padding: 20 }}>
        <p style={{ color: "#ef4444" }}>{error}</p>
        <button onClick={() => { setError(null); setLoadingSupermodules(true); (async () => {
          try {
            const data = await apiFetch(`${API_BASE_URL}/api/supermodules`);
            setSupermodules(Array.isArray(data) ? data : []);
          } catch (e:any) {
            console.error(e);
            setError(e?.message || "Failed to reload modules");
          } finally { setLoadingSupermodules(false); }
        })(); }} style={{ padding: "8px 12px", cursor: "pointer" }}>
          Retry
        </button>
      </div>
    );
  }

  // Detail view for a specific video activity
  if (selectedActivity) {
    return (
      <div style={{ padding: 20, minHeight: "100vh" }}>
        <button
          onClick={() => {
            setSelectedActivity(null);
            setAttempts([]);
          }}
          style={{
            padding: "12px 24px",
            backgroundColor: "#334155",
            color: "#f1f5f9",
            borderRadius: 8,
            cursor: "pointer",
            marginBottom: 20,
          }}
        >
          ← Back to Videos
        </button>

        <div style={{ backgroundColor: "#1e293b", padding: 20, borderRadius: 12, marginBottom: 20, border: "1px solid #334155" }}>
          <h2 style={{ color: "#f1f5f9", margin: 0 }}>
            {selectedActivity.submodule_code} - {selectedActivity.submodule_name}
          </h2>
          <p style={{ color: "#94a3b8", margin: "8px 0 0" }}>
            <strong>Student:</strong> {student.full_name} ({student.username})
          </p>
          <p style={{ color: "#94a3b8", margin: "6px 0 0" }}>
            <strong>Total Attempts:</strong> {selectedActivity.attempt_ids?.length || 0}
          </p>
          <p style={{ color: "#94a3b8", margin: "6px 0 0" }}>
            <strong>Last Attempt:</strong>{" "}
            {selectedActivity.last_attempt_at ? new Date(selectedActivity.last_attempt_at).toLocaleString() : "—"}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
          {/* Attempts */}
          <div style={{ backgroundColor: "#1e293b", padding: 20, borderRadius: 12, border: "1px solid #334155" }}>
            <h3 style={{ color: "#f1f5f9", marginTop: 0 }}>📝 Quiz Attempts</h3>

            {loadingAttempts ? (
              <p style={{ color: "#94a3b8" }}>Loading attempts...</p>
            ) : attempts.length > 0 ? (
              <div style={{ display: "grid", gap: 12 }}>
                {attempts.map((attempt) => (
                  <div key={attempt.id} style={{ background: "#0f172a", padding: 12, borderRadius: 8, border: "1px solid #334155" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h4 style={{ color: "#f1f5f9", margin: "0 0 6px 0" }}>{attempt.set_name}</h4>
                        <div style={{ color: "#94a3b8", fontSize: 13 }}>{new Date(attempt.submitted_at).toLocaleString()}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{
                          fontSize: 22,
                          fontWeight: 800,
                          color: attempt.percentage >= 80 ? "#10b981" : attempt.percentage >= 60 ? "#f59e0b" : "#ef4444"
                        }}>{attempt.percentage}%</div>
                        <div style={{ color: "#94a3b8", fontSize: 12 }}>{attempt.score}/{attempt.total_questions}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#94a3b8" }}>No attempts found for this activity.</p>
            )}
          </div>

          {/* Concept performance */}
          <div style={{ backgroundColor: "#1e293b", padding: 20, borderRadius: 12, border: "1px solid #334155" }}>
            <h3 style={{ color: "#f1f5f9", marginTop: 0 }}>📊 Concept-Level Performance</h3>

            {conceptPerformance.length ? (
              <div style={{ display: "grid", gap: 16 }}>
                {conceptPerformance.map((concept, idx) => {
                  const total = (concept.correct || 0) + (concept.incorrect || 0);
                  const correctPct = total ? (concept.correct / total) * 100 : 0;
                  const incorrectPct = total ? (concept.incorrect / total) * 100 : 0;
                  return (
                    <div key={idx} style={{ background: "#0f172a", padding: 12, borderRadius: 8, border: "1px solid #334155" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h4 style={{ margin: 0, color: "#f1f5f9" }}>{concept.concept_name}</h4>
                        <div style={{ color: "#cbd5e1" }}>{concept.correct}/{total} correct</div>
                      </div>

                      <div style={{ display: "flex", height: 28, borderRadius: 6, overflow: "hidden", marginTop: 10, background: "#334155" }}>
                        <div style={{ width: `${Math.round(correctPct)}%`, background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>
                          {concept.correct ? `${Math.round(correctPct)}%` : ""}
                        </div>
                        <div style={{ width: `${Math.round(incorrectPct)}%`, background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>
                          {concept.incorrect ? `${Math.round(incorrectPct)}%` : ""}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 13 }}>
                        <span style={{ color: "#10b981" }}>✓ {concept.correct}</span>
                        <span style={{ color: "#ef4444" }}>✗ {concept.incorrect}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: "#94a3b8" }}>No concept performance data available.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List view of video activities under a selected supermodule
  if (selectedSupermodule) {
    return (
      <div style={{ padding: 20, minHeight: "100vh" }}>
        <button
          onClick={() => {
            setSelectedSupermodule(null);
            setActivities([]);
          }}
          style={{ padding: "12px 24px", backgroundColor: "#334155", color: "#f1f5f9", borderRadius: 8, cursor: "pointer", marginBottom: 20 }}
        >
          ← Back to Modules
        </button>

        <div style={{ backgroundColor: "#1e293b", padding: 18, borderRadius: 12, marginBottom: 18, border: "1px solid #334155" }}>
          <h2 style={{ color: "#f1f5f9", margin: 0 }}>{selectedSupermodule} - Activity for {student.full_name}</h2>
          <p style={{ color: "#94a3b8", marginTop: 8 }}>Username: {student.username} | Grade: {student.grade}</p>
        </div>

        <h3 style={{ color: "#cbd5e1", marginBottom: 12 }}>Video Activities</h3>

        {loadingActivities ? (
          <p style={{ color: "#94a3b8" }}>Loading activities...</p>
        ) : activities.length ? (
          <div style={{ display: "grid", gap: 12 }}>
            {activities.map((act) => (
              <div key={act.id} onClick={() => handleViewActivity(act)} style={{ background: "#1e293b", padding: 16, borderRadius: 10, border: "1px solid #334155", cursor: "pointer" }}>
                <h4 style={{ color: "#f1f5f9", margin: "0 0 8px 0" }}>{act.submodule_code} - {act.submodule_name}</h4>
                <div style={{ color: "#94a3b8", fontSize: 14 }}>
                  <div>Attempts: {act.attempt_ids?.length || 0}</div>
                  <div>Last Attempt: {act.last_attempt_at ? new Date(act.last_attempt_at).toLocaleString() : "—"}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#94a3b8" }}>No activity records found for videos in {selectedSupermodule}.</p>
        )}
      </div>
    );
  }

  // Supermodule selection view
  return (
    <div style={{ padding: 20, minHeight: "100vh" }}>
      <button onClick={onBack} style={{ padding: "12px 24px", backgroundColor: "#334155", color: "#f1f5f9", borderRadius: 8, cursor: "pointer", marginBottom: 20 }}>
        ← Back to Students
      </button>

      <div style={{ backgroundColor: "#1e293b", padding: 18, borderRadius: 12, marginBottom: 18, border: "1px solid #334155" }}>
        <h2 style={{ color: "#f1f5f9", margin: 0 }}>Activity for {student.full_name}</h2>
        <p style={{ color: "#94a3b8", marginTop: 8 }}>Username: {student.username} | Grade: {student.grade}</p>
      </div>

      <h3 style={{ color: "#cbd5e1", marginBottom: 12 }}>Select a Module</h3>

      {supermodules.length ? (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {supermodules.map((sm) => (
            <button key={sm.supermodule_code} onClick={() => handleSupermoduleClick(sm.supermodule_code)} style={{ padding: "16px 22px", backgroundColor: "#8b5cf6", color: "white", border: "none", borderRadius: 10, cursor: "pointer" }}>
              <div style={{ fontWeight: 700 }}>{sm.supermodule_code}</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>{sm.supermodule_name}</div>
            </button>
          ))}
        </div>
      ) : (
        <p style={{ color: "#94a3b8" }}>No modules available.</p>
      )}
    </div>
  );
};

export default StudentActivityPanel;
