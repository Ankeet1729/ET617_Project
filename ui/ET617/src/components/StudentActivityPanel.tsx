import React, { useState, useEffect } from "react";

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
  concept_performance: { [key: string]: ConceptPerformance };
  last_attempt_at: string;
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

const StudentActivityPanel: React.FC<StudentActivityPanelProps> = ({
  student,
  onBack,
}) => {
  const [supermodules, setSupermodules] = useState<Supermodule[]>([]);
  const [selectedSupermodule, setSelectedSupermodule] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupermodules();
  }, []);

  const fetchSupermodules = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/supermodules", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        console.log("✅ Supermodules loaded:", data);
        setSupermodules(data);
      }
    } catch (err) {
      console.error("Error fetching supermodules:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivitiesForSupermodule = async (supermoduleCode: string) => {
    setLoading(true);
    try {
      // First get all submodules under this supermodule
      const submodulesRes = await fetch(
        `http://localhost:5000/api/supermodules/${supermoduleCode}/children`,
        { credentials: "include" }
      );
      if (!submodulesRes.ok) {
        console.error("Failed to fetch submodules");
        setLoading(false);
        return;
      }
      const submodules = await submodulesRes.json();
      const submoduleCodes = submodules.map((sm: any) => sm.submodule_code);

      // Now fetch all activities for this student and grade
      const activityRes = await fetch(
        `http://localhost:5000/admin/student_activity/${student.username}/${student.grade}`,
        { credentials: "include" }
      );
      if (activityRes.ok) {
        const allActivities = await activityRes.json();
        // Filter activities to only those in this supermodule
        const filteredActivities = allActivities.filter((act: Activity) =>
          submoduleCodes.includes(act.submodule_code)
        );
        console.log("✅ Filtered activities for", supermoduleCode, ":", filteredActivities);
        setActivities(filteredActivities);
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttempts = async (attemptIds: number[]) => {
    try {
      const res = await fetch(
        `http://localhost:5000/admin/quiz_attempts?ids=${attemptIds.join(",")}`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        setAttempts(data);
      }
    } catch (err) {
      console.error("Error fetching attempts:", err);
    }
  };

  const handleSupermoduleClick = (supermoduleCode: string) => {
    setSelectedSupermodule(supermoduleCode);
    fetchActivitiesForSupermodule(supermoduleCode);
  };

  const handleViewActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    fetchAttempts(activity.attempt_ids);
  };

  if (loading) {
    return <div style={{ padding: "20px", color: "#f1f5f9" }}>Loading...</div>;
  }

  // Detail view for a specific video activity
  if (selectedActivity) {
    const conceptPerformance = Object.values(selectedActivity.concept_performance || {});

    return (
      <div style={{ padding: "20px", minHeight: "100vh" }}>
        <button
          onClick={() => {
            setSelectedActivity(null);
            setAttempts([]);
          }}
          style={{
            padding: "12px 24px",
            backgroundColor: "#334155",
            color: "#f1f5f9",
            border: "1px solid #475569",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          ← Back to Videos
        </button>

        {/* Header Info */}
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "25px",
            borderRadius: "12px",
            marginBottom: "30px",
            border: "1px solid #334155",
          }}
        >
          <h2 style={{ color: "#f1f5f9", margin: "0 0 15px 0" }}>
            {selectedActivity.submodule_code} - {selectedActivity.submodule_name}
          </h2>
          <p style={{ color: "#94a3b8", margin: "5px 0" }}>
            <strong>Student:</strong> {student.full_name} ({student.username})
          </p>
          <p style={{ color: "#94a3b8", margin: "5px 0" }}>
            <strong>Total Attempts:</strong> {selectedActivity.attempt_ids.length}
          </p>
          <p style={{ color: "#94a3b8", margin: 0 }}>
            <strong>Last Attempt:</strong>{" "}
            {new Date(selectedActivity.last_attempt_at).toLocaleString()}
          </p>
        </div>

        {/* SIDE-BY-SIDE LAYOUT */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
          {/* LEFT SIDE: Quiz Attempts */}
          <div
            style={{
              backgroundColor: "#1e293b",
              padding: "25px",
              borderRadius: "12px",
              border: "1px solid #334155",
              height: "fit-content",
            }}
          >
            <h3 style={{ color: "#f1f5f9", marginBottom: "20px", marginTop: 0 }}>
              📝 Quiz Attempts
            </h3>

            {attempts.length > 0 ? (
              <div style={{ display: "grid", gap: "15px" }}>
                {attempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    style={{
                      backgroundColor: "#0f172a",
                      padding: "20px",
                      borderRadius: "10px",
                      border: "1px solid #334155",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <h4 style={{ color: "#f1f5f9", margin: "0 0 8px 0", fontSize: "16px" }}>
                          {attempt.set_name}
                        </h4>
                        <p style={{ color: "#94a3b8", margin: "5px 0", fontSize: "13px" }}>
                          {new Date(attempt.submitted_at).toLocaleString()}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color:
                              attempt.percentage >= 80
                                ? "#10b981"
                                : attempt.percentage >= 60
                                ? "#f59e0b"
                                : "#ef4444",
                          }}
                        >
                          {attempt.percentage}%
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: "12px" }}>
                          {attempt.score}/{attempt.total_questions}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#94a3b8" }}>Loading attempts...</p>
            )}
          </div>

          {/* RIGHT SIDE: Concept Performance */}
          <div
            style={{
              backgroundColor: "#1e293b",
              padding: "25px",
              borderRadius: "12px",
              border: "1px solid #334155",
              height: "fit-content",
            }}
          >
            <h3 style={{ color: "#f1f5f9", marginBottom: "20px", marginTop: 0 }}>
              📊 Concept-Level Performance
            </h3>

            {conceptPerformance.length > 0 ? (
              <div style={{ display: "grid", gap: "20px" }}>
                {conceptPerformance.map((concept, index) => {
                  const total = concept.correct + concept.incorrect;
                  const correctPercentage = total > 0 ? (concept.correct / total) * 100 : 0;
                  const incorrectPercentage = total > 0 ? (concept.incorrect / total) * 100 : 0;

                  return (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#0f172a",
                        padding: "16px",
                        borderRadius: "10px",
                        border: "1px solid #334155",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                          alignItems: "center",
                        }}
                      >
                        <h4 style={{ color: "#f1f5f9", margin: 0, fontSize: "15px" }}>
                          {concept.concept_name}
                        </h4>
                        <span style={{ color: "#cbd5e1", fontSize: "13px" }}>
                          {concept.correct}/{total} correct
                        </span>
                      </div>

                      {/* Performance Bar */}
                      <div
                        style={{
                          display: "flex",
                          height: "28px",
                          borderRadius: "6px",
                          overflow: "hidden",
                          backgroundColor: "#334155",
                        }}
                      >
                        {concept.correct > 0 && (
                          <div
                            style={{
                              width: `${correctPercentage}%`,
                              backgroundColor: "#10b981",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            {concept.correct > 0 && `${Math.round(correctPercentage)}%`}
                          </div>
                        )}
                        {concept.incorrect > 0 && (
                          <div
                            style={{
                              width: `${incorrectPercentage}%`,
                              backgroundColor: "#ef4444",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            {concept.incorrect > 0 && `${Math.round(incorrectPercentage)}%`}
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div
                        style={{
                          display: "flex",
                          gap: "15px",
                          marginTop: "8px",
                          fontSize: "12px",
                        }}
                      >
                        <span style={{ color: "#10b981" }}>✓ Correct: {concept.correct}</span>
                        <span style={{ color: "#ef4444" }}>✗ Incorrect: {concept.incorrect}</span>
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
      <div style={{ padding: "20px", minHeight: "100vh" }}>
        <button
          onClick={() => {
            setSelectedSupermodule(null);
            setActivities([]);
          }}
          style={{
            padding: "12px 24px",
            backgroundColor: "#334155",
            color: "#f1f5f9",
            border: "1px solid #475569",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          ← Back to Modules
        </button>

        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "25px",
            borderRadius: "12px",
            marginBottom: "25px",
            border: "1px solid #334155",
          }}
        >
          <h2 style={{ color: "#f1f5f9", margin: 0 }}>
            {selectedSupermodule} - Activity for {student.full_name}
          </h2>
          <p style={{ color: "#94a3b8", marginTop: "10px" }}>
            Username: {student.username} | Grade: {student.grade}
          </p>
        </div>

        <h3 style={{ color: "#cbd5e1", marginBottom: "20px" }}>Video Activities</h3>

        {activities.length > 0 ? (
          <div style={{ display: "grid", gap: "15px" }}>
            {activities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => handleViewActivity(activity)}
                style={{
                  backgroundColor: "#1e293b",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #334155",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = "#334155")}
              >
                <h4 style={{ color: "#f1f5f9", margin: "0 0 10px 0" }}>
                  {activity.submodule_code} - {activity.submodule_name}
                </h4>
                <div style={{ color: "#94a3b8", fontSize: "14px" }}>
                  <p style={{ margin: "5px 0" }}>Attempts: {activity.attempt_ids.length}</p>
                  <p style={{ margin: "5px 0" }}>
                    Last Attempt: {new Date(activity.last_attempt_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#94a3b8" }}>
            No activity records found for videos in {selectedSupermodule}.
          </p>
        )}
      </div>
    );
  }

  // Supermodule selection view
  return (
    <div style={{ padding: "20px", minHeight: "100vh" }}>
      <button
        onClick={onBack}
        style={{
          padding: "12px 24px",
          backgroundColor: "#334155",
          color: "#f1f5f9",
          border: "1px solid #475569",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        ← Back to Students
      </button>

      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "25px",
          borderRadius: "12px",
          marginBottom: "25px",
          border: "1px solid #334155",
        }}
      >
        <h2 style={{ color: "#f1f5f9", margin: 0 }}>
          Activity for {student.full_name}
        </h2>
        <p style={{ color: "#94a3b8", marginTop: "10px" }}>
          Username: {student.username} | Grade: {student.grade}
        </p>
      </div>

      <h3 style={{ color: "#cbd5e1", marginBottom: "20px" }}>Select a Module</h3>

      {supermodules.length > 0 ? (
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          {supermodules.map((sm) => (
            <button
              key={sm.supermodule_code}
              onClick={() => handleSupermoduleClick(sm.supermodule_code)}
              style={{
                padding: "20px 30px",
                fontSize: "18px",
                backgroundColor: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                textAlign: "center",
                minWidth: "180px",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#7c3aed")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#8b5cf6")}
            >
              <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                {sm.supermodule_code}
              </div>
              <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.9 }}>
                {sm.supermodule_name}
              </div>
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
