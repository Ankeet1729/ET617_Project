import React, { useState, useEffect } from "react";

interface Question {
  id: number;
  question_text: string;
  question_type: string;
  options: any;
  correct_answer: string;
  bloom_level: string;
  concept: string;
  image_path: string | null;
  grade: number;
}

interface QuestionSet {
  id: number;
  name: string;
  created_at: string;
  grade: number;
  submodule_code: string;
  submodule_name: string;
  questions: Question[];
}

interface QuestionSetViewerProps {
  setId: number;
  onBack: () => void;
}

const QuestionSetViewer: React.FC<QuestionSetViewerProps> = ({ setId, onBack }) => {
  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);

  useEffect(() => {
    fetchQuestionSet();
  }, [setId]);

  const fetchQuestionSet = async () => {
    try {
      const res = await fetch(`http://localhost:5000/admin/question_set/${setId}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setQuestionSet(data);
      }
    } catch (err) {
      console.error("Error fetching question set:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "20px", color: "#f1f5f9" }}>Loading...</div>;
  }

  if (!questionSet) {
    return <div style={{ padding: "20px", color: "#ef4444" }}>Question set not found</div>;
  }

  return (
    <div style={{ padding: "20px", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "30px" }}>
        <button
          onClick={onBack}
          style={{
            padding: "12px 24px",
            backgroundColor: "#334155",
            color: "#f1f5f9",
            border: "1px solid #475569",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            marginBottom: "20px",
          }}
        >
          ← Back to Quiz Sets
        </button>

        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "25px",
            borderRadius: "12px",
            border: "1px solid #334155",
          }}
        >
          <h2 style={{ color: "#f1f5f9", margin: "0 0 15px 0" }}>
            {questionSet.name}
          </h2>
          <div style={{ color: "#94a3b8", fontSize: "14px" }}>
            <p style={{ margin: "5px 0" }}>
              <strong style={{ color: "#cbd5e1" }}>Submodule:</strong> {questionSet.submodule_code} - {questionSet.submodule_name}
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong style={{ color: "#cbd5e1" }}>Grade:</strong> {questionSet.grade}
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong style={{ color: "#cbd5e1" }}>Total Questions:</strong> {questionSet.questions.length}
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong style={{ color: "#cbd5e1" }}>Created:</strong>{" "}
              {new Date(questionSet.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div>
        <h3 style={{ color: "#cbd5e1", marginBottom: "20px" }}>Questions</h3>
        
        {questionSet.questions.map((question, index) => (
          <div
            key={question.id}
            style={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            {/* Question Header */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <span
                    style={{
                      backgroundColor: "#6366f1",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    Q{index + 1}
                  </span>
                  <span
                    style={{
                      backgroundColor: "#8b5cf6",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  >
                    {question.question_type}
                  </span>
                  <span
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  >
                    {question.bloom_level}
                  </span>
                  <span
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  >
                    {question.concept}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => alert("Edit functionality coming soon!")}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#f59e0b",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ✏️ Edit
              </button>
            </div>

            {/* Question Text */}
            <div style={{ marginBottom: "15px" }}>
              <p
                style={{
                  color: "#f1f5f9",
                  fontSize: "16px",
                  lineHeight: "1.6",
                  margin: "0",
                }}
              >
                {question.question_text}
              </p>
            </div>

            {/* Image (if exists) */}
            {question.image_path && (
              <div style={{ marginBottom: "15px" }}>
                <img
                  src={`http://localhost:5000/${question.image_path}`}
                  alt="Question"
                  style={{
                    maxWidth: "400px",
                    borderRadius: "8px",
                    border: "1px solid #334155",
                  }}
                />
              </div>
            )}

            {/* Options */}
            {question.question_type === "MCQ" && (
              <div style={{ marginBottom: "15px" }}>
                <p style={{ color: "#cbd5e1", fontSize: "14px", marginBottom: "10px" }}>
                  <strong>Options:</strong>
                </p>
                <div style={{ display: "grid", gap: "10px" }}>
                  {Object.entries(question.options || {}).map(([key, value]) => (
                    <div
                      key={key}
                      style={{
                        backgroundColor: key === question.correct_answer ? "#10b98120" : "#0f172a",
                        border: `2px solid ${key === question.correct_answer ? "#10b981" : "#334155"}`,
                        borderRadius: "8px",
                        padding: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: key === question.correct_answer ? "#10b981" : "#475569",
                          color: "white",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          fontWeight: "bold",
                          minWidth: "30px",
                          textAlign: "center",
                        }}
                      >
                        {key}
                      </span>
                      <span style={{ color: "#f1f5f9", flex: 1 }}>{String(value)}</span>
                      {key === question.correct_answer && (
                        <span style={{ color: "#10b981", fontWeight: "bold" }}>✓ Correct</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* True/False */}
            {question.question_type === "True/False" && (
              <div style={{ marginBottom: "15px" }}>
                <p style={{ color: "#cbd5e1", fontSize: "14px", marginBottom: "10px" }}>
                  <strong>Correct Answer:</strong>
                </p>
                <div
                  style={{
                    backgroundColor: "#10b98120",
                    border: "2px solid #10b981",
                    borderRadius: "8px",
                    padding: "12px",
                    color: "#f1f5f9",
                    fontWeight: "bold",
                  }}
                >
                  {question.correct_answer}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div
              style={{
                borderTop: "1px solid #334155",
                paddingTop: "15px",
                display: "flex",
                gap: "20px",
                color: "#94a3b8",
                fontSize: "13px",
              }}
            >
              <span>
                <strong>ID:</strong> {question.id}
              </span>
              <span>
                <strong>Grade:</strong> {question.grade}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionSetViewer;
