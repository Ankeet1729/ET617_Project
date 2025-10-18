import React, { useState } from "react";

interface ManualSetCreatorProps {
  submoduleCode: string;
  grade: number;
  onComplete: () => void;
  onCancel: () => void;
}

interface QuestionDraft {
  id: string;
  question_text: string;
  question_type: string;
  options: any;
  correct_answer: string;
  bloom_level: string;
  concept_id: number;
  image?: File | null;
}

const ManualSetCreator: React.FC<ManualSetCreatorProps> = ({
  submoduleCode,
  grade,
  onComplete,
  onCancel,
}) => {
  const [setName, setSetName] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionDraft>({
    id: Date.now().toString(),
    question_text: "",
    question_type: "MCQ",
    options: { A: "", B: "", C: "", D: "" },
    correct_answer: "",
    bloom_level: "Understanding",
    concept_id: 0,
    image: null,
  });
  const [concepts, setConcepts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    fetchConcepts();
  }, []);

  const fetchConcepts = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/admin/concepts/${submoduleCode}/${grade}`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        setConcepts(data);
        if (data.length > 0) {
          setCurrentQuestion(prev => ({ ...prev, concept_id: data[0].id }));
        }
      }
    } catch (err) {
      console.error("Error fetching concepts:", err);
    }
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.question_text || !currentQuestion.correct_answer || currentQuestion.concept_id === 0) {
      alert("Please fill in all required fields");
      return;
    }

    if (currentQuestion.question_type === "MCQ") {
      const hasEmptyOption = Object.values(currentQuestion.options).some(v => !v);
      if (hasEmptyOption) {
        alert("Please fill in all MCQ options");
        return;
      }
    }

    setQuestions([...questions, { ...currentQuestion, id: Date.now().toString() }]);
    
    // Reset form
    setCurrentQuestion({
      id: Date.now().toString(),
      question_text: "",
      question_type: "MCQ",
      options: { A: "", B: "", C: "", D: "" },
      correct_answer: "",
      bloom_level: "Understanding",
      concept_id: concepts[0]?.id || 0,
      image: null,
    });
    
    setShowQuestionForm(false);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSubmitSet = async () => {
    if (!setName) {
      alert("Please enter a set name");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    setLoading(true);

    try {
      // First, create the question set
      const setRes = await fetch("http://localhost:5000/admin/create_manual_set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          submodule_code: submoduleCode,
          grade: grade,
          set_name: setName,
        }),
      });

      if (!setRes.ok) {
        throw new Error("Failed to create question set");
      }

      const { question_set_id } = await setRes.json();

      // Then add each question
      for (const q of questions) {
        const formData = new FormData();
        formData.append("question_text", q.question_text);
        formData.append("question_type", q.question_type);
        formData.append("correct_answer", q.correct_answer);
        formData.append("bloom_level", q.bloom_level);
        formData.append("concept_id", q.concept_id.toString());
        formData.append("grade", grade.toString());
        
        if (q.question_type === "MCQ") {
          formData.append("options", JSON.stringify(q.options));
        } else {
          formData.append("options", "{}");
        }

        if (q.image) {
          formData.append("image", q.image);
        }

        const questionRes = await fetch(
          `http://localhost:5000/admin/question_set/${question_set_id}/add_question`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        if (!questionRes.ok) {
          console.error("Failed to add question:", q.question_text);
        }
      }

      alert(`Quiz set "${setName}" created successfully with ${questions.length} questions!`);
      onComplete();
    } catch (err) {
      console.error("Error creating manual set:", err);
      alert("Error creating quiz set");
    } finally {
      setLoading(false);
    }
  };

  const bloomLevels = ["Remembering", "Understanding", "Applying", "Analyzing", "Evaluating", "Creating"];

  return (
    <div style={{ padding: "20px", minHeight: "100vh" }}>
      <h2 style={{ color: "#f1f5f9", marginBottom: "30px" }}>
        ✏️ Create Manual Quiz Set
      </h2>

      {/* Set Name */}
      <div
        style={{
          backgroundColor: "#1e293b",
          padding: "25px",
          borderRadius: "12px",
          marginBottom: "25px",
          border: "1px solid #334155",
        }}
      >
        <label style={{ color: "#cbd5e1", display: "block", marginBottom: "10px", fontSize: "16px", fontWeight: "bold" }}>
          Quiz Set Name *
        </label>
        <input
          type="text"
          value={setName}
          onChange={(e) => setSetName(e.target.value)}
          placeholder="Enter quiz set name"
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#0f172a",
            color: "#f1f5f9",
            border: "1px solid #475569",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />
      </div>

      {/* Questions List */}
      <div style={{ marginBottom: "25px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ color: "#cbd5e1", margin: 0 }}>
            Questions ({questions.length})
          </h3>
          <button
            onClick={() => setShowQuestionForm(!showQuestionForm)}
            style={{
              padding: "12px 24px",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "bold",
            }}
          >
            {showQuestionForm ? "❌ Cancel" : "➕ Add Question"}
          </button>
        </div>

        {/* Question Form */}
        {showQuestionForm && (
          <div
            style={{
              backgroundColor: "#1e293b",
              padding: "25px",
              borderRadius: "12px",
              marginBottom: "20px",
              border: "2px solid #334155",
            }}
          >
            <h4 style={{ color: "#f1f5f9", marginBottom: "20px" }}>Add New Question</h4>

            {/* Question Type */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ color: "#cbd5e1", display: "block", marginBottom: "8px" }}>Question Type</label>
              <select
                value={currentQuestion.question_type}
                onChange={(e) =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    question_type: e.target.value,
                    options: e.target.value === "MCQ" ? { A: "", B: "", C: "", D: "" } : {},
                    correct_answer: e.target.value === "BOOLEAN" ? "True" : "",
                  })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#0f172a",
                  color: "#f1f5f9",
                  border: "1px solid #475569",
                  borderRadius: "6px",
                  fontSize: "16px",
                }}
              >
                <option value="MCQ">Multiple Choice</option>
                <option value="BOOLEAN">True/False</option>
              </select>
            </div>

            {/* Question Text */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ color: "#cbd5e1", display: "block", marginBottom: "8px" }}>Question Text *</label>
              <textarea
                value={currentQuestion.question_text}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
                rows={3}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#0f172a",
                  color: "#f1f5f9",
                  border: "1px solid #475569",
                  borderRadius: "6px",
                  fontSize: "15px",
                }}
              />
            </div>

            {/* MCQ Options */}
            {currentQuestion.question_type === "MCQ" && (
              <div style={{ marginBottom: "15px" }}>
                <label style={{ color: "#cbd5e1", display: "block", marginBottom: "10px", fontWeight: "bold" }}>
                  Options *
                </label>
                {["A", "B", "C", "D"].map((key) => (
                  <div key={key} style={{ marginBottom: "10px" }}>
                    <input
                      type="text"
                      placeholder={`Option ${key}`}
                      value={currentQuestion.options[key] || ""}
                      onChange={(e) =>
                        setCurrentQuestion({
                          ...currentQuestion,
                          options: { ...currentQuestion.options, [key]: e.target.value },
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#0f172a",
                        color: "#f1f5f9",
                        border: "1px solid #475569",
                        borderRadius: "6px",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Correct Answer */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ color: "#cbd5e1", display: "block", marginBottom: "8px" }}>Correct Answer *</label>
              {currentQuestion.question_type === "MCQ" ? (
                <select
                  value={currentQuestion.correct_answer}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#0f172a",
                    color: "#f1f5f9",
                    border: "1px solid #475569",
                    borderRadius: "6px",
                  }}
                >
                  <option value="">Select</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              ) : (
                <select
                  value={currentQuestion.correct_answer}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#0f172a",
                    color: "#f1f5f9",
                    border: "1px solid #475569",
                    borderRadius: "6px",
                  }}
                >
                  <option value="">Select</option>
                  <option value="True">True</option>
                  <option value="False">False</option>
                </select>
              )}
            </div>

            {/* Concept */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ color: "#cbd5e1", display: "block", marginBottom: "8px" }}>Concept *</label>
              <select
                value={currentQuestion.concept_id}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, concept_id: parseInt(e.target.value) })}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#0f172a",
                  color: "#f1f5f9",
                  border: "1px solid #475569",
                  borderRadius: "6px",
                }}
              >
                {concepts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.concept_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Bloom Level */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ color: "#cbd5e1", display: "block", marginBottom: "8px" }}>Bloom's Level</label>
              <select
                value={currentQuestion.bloom_level}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, bloom_level: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#0f172a",
                  color: "#f1f5f9",
                  border: "1px solid #475569",
                  borderRadius: "6px",
                }}
              >
                {bloomLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Image */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ color: "#cbd5e1", display: "block", marginBottom: "8px" }}>Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, image: e.target.files?.[0] || null })}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#0f172a",
                  color: "#f1f5f9",
                  border: "1px solid #475569",
                  borderRadius: "6px",
                }}
              />
            </div>

            <button
              onClick={handleAddQuestion}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: "#6366f1",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Add Question to Set
            </button>
          </div>
        )}

        {/* Questions Preview */}
        {questions.map((q, index) => (
          <div
            key={q.id}
            style={{
              backgroundColor: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "15px",
              border: "1px solid #334155",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ color: "#6366f1", fontWeight: "bold" }}>Q{index + 1}. {q.question_type}</span>
              <button
                onClick={() => handleRemoveQuestion(q.id)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Remove
              </button>
            </div>
            <p style={{ color: "#f1f5f9", margin: "0" }}>{q.question_text}</p>
          </div>
        ))}
      </div>

      {/* Submit Buttons */}
      <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
        <button
          onClick={handleSubmitSet}
          disabled={loading || questions.length === 0 || !setName}
          style={{
            flex: 1,
            padding: "16px",
            backgroundColor: loading || questions.length === 0 || !setName ? "#64748b" : "#10b981",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: loading || questions.length === 0 || !setName ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating..." : `Create Quiz Set (${questions.length} questions)`}
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: "16px 32px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ManualSetCreator;
