import React, { useState, useEffect } from "react";

interface Concept {
  id: number;
  concept_name: string;
  description: string;
  ct_concepts: string[];
}

interface QuestionData {
  id?: number;
  question_text: string;
  question_type: string;
  options: any;
  correct_answer: string;
  bloom_level: string;
  concept_id: number;
  grade: number;
  image_path?: string | null;
}

interface QuestionEditorProps {
  mode: "add" | "edit";
  questionData?: QuestionData;
  submoduleCode: string;
  grade: number;
  setId: number;
  onSave: () => void;
  onCancel: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  mode,
  questionData,
  submoduleCode,
  grade,
  setId,
  onSave,
  onCancel,
}) => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Initialize form data - FIX: Properly handle concept_id
  const [formData, setFormData] = useState<QuestionData>({
    question_text: questionData?.question_text || "",
    question_type: questionData?.question_type || "MCQ",
    options: questionData?.options || { A: "", B: "", C: "", D: "" },
    correct_answer: questionData?.correct_answer || "",
    bloom_level: questionData?.bloom_level || "Understanding",
    concept_id: questionData?.concept_id || 0, // Will be updated once concepts load
    grade: questionData?.grade || grade,
  });

  useEffect(() => {
    fetchConcepts();
  }, [submoduleCode, grade]);

  const fetchConcepts = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/admin/concepts/${submoduleCode}/${grade}`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        console.log("🔍 Concepts loaded:", data);
        setConcepts(data);
        
        // FIX: Set concept_id properly
        if (questionData && questionData.concept_id) {
          // Editing mode - keep existing concept_id
          setFormData((prev) => ({ ...prev, concept_id: questionData.concept_id }));
        } else if (data.length > 0) {
          // Add mode - use first available concept
          setFormData((prev) => ({ ...prev, concept_id: data[0].id }));
        }
      }
    } catch (err) {
      console.error("Error fetching concepts:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.question_text) {
      alert("Please enter question text");
      return;
    }
    
    if (!formData.correct_answer) {
      alert("Please select correct answer");
      return;
    }
    
    if (formData.concept_id === 0 || !formData.concept_id) {
      alert("Please select a concept");
      return;
    }
    
    console.log("🔍 Submitting form data:", formData);
    
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("question_text", formData.question_text);
    formDataToSend.append("question_type", formData.question_type);
    formDataToSend.append("correct_answer", formData.correct_answer);
    formDataToSend.append("bloom_level", formData.bloom_level);
    formDataToSend.append("concept_id", String(formData.concept_id)); // Ensure it's a string for FormData
    formDataToSend.append("grade", String(formData.grade));

    if (formData.question_type === "MCQ") {
      formDataToSend.append("options", JSON.stringify(formData.options));
    } else {
      formDataToSend.append("options", "{}");
    }

    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    try {
      let url, method;
      if (mode === "edit" && questionData?.id) {
        url = `http://localhost:5000/admin/question/${questionData.id}`;
        method = "PUT";
      } else {
        url = `http://localhost:5000/admin/question_set/${setId}/add_question`;
        method = "POST";
      }

      console.log("🔍 Sending to:", url, method);

      const res = await fetch(url, {
        method,
        credentials: "include",
        body: formDataToSend,
      });

      if (res.ok) {
        alert(
          mode === "edit"
            ? "Question updated successfully!"
            : "Question added successfully!"
        );
        onSave();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || "Failed to save question"}`);
      }
    } catch (err) {
      console.error("Error saving question:", err);
      alert("Error saving question");
    } finally {
      setLoading(false);
    }
  };

  const bloomLevels = [
    "Remembering",
    "Understanding",
    "Applying",
    "Analyzing",
    "Evaluating",
    "Creating",
  ];

  return (
    <div
      style={{
        backgroundColor: "#1e293b",
        borderRadius: "12px",
        padding: "30px",
        border: "2px solid #334155",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ color: "#f1f5f9", marginBottom: "25px", fontSize: "20px" }}>
        {mode === "edit" ? "✏️ Edit Question" : "➕ Add New Question"}
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Question Type */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ color: "#cbd5e1", display: "block", marginBottom: "8px", fontSize: "14px" }}>
            Question Type
          </label>
          <select
            value={formData.question_type}
            onChange={(e) =>
              setFormData({
                ...formData,
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
            <option value="MCQ">Multiple Choice (MCQ)</option>
            <option value="BOOLEAN">True/False</option>
          </select>
        </div>

        {/* Question Text */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ color: "#cbd5e1", display: "block", marginBottom: "8px", fontSize: "14px" }}>
            Question Text *
          </label>
          <textarea
            value={formData.question_text}
            onChange={(e) =>
              setFormData({ ...formData, question_text: e.target.value })
            }
            required
            rows={4}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#0f172a",
              color: "#f1f5f9",
              border: "1px solid #475569",
              borderRadius: "6px",
              fontSize: "16px",
              resize: "vertical",
            }}
          />
        </div>

        {/* MCQ Options */}
        {formData.question_type === "MCQ" && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: "#cbd5e1", display: "block", marginBottom: "12px", fontSize: "14px", fontWeight: "bold" }}>
              Options *
            </label>
            {["A", "B", "C", "D"].map((key) => (
              <div key={key} style={{ marginBottom: "12px" }}>
                <label style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "4px", display: "block" }}>
                  Option {key}
                </label>
                <input
                  type="text"
                  value={formData.options[key] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      options: { ...formData.options, [key]: e.target.value },
                    })
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#0f172a",
                    color: "#f1f5f9",
                    border: "1px solid #475569",
                    borderRadius: "6px",
                    fontSize: "15px",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Correct Answer */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ color: "#cbd5e1", display: "block", marginBottom: "8px", fontSize: "14px" }}>
            Correct Answer *
          </label>
          {formData.question_type === "MCQ" ? (
            <select
              value={formData.correct_answer}
              onChange={(e) =>
                setFormData({ ...formData, correct_answer: e.target.value })
              }
              required
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
              <option value="">Select correct option</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          ) : (
            <select
              value={formData.correct_answer}
              onChange={(e) =>
                setFormData({ ...formData, correct_answer: e.target.value })
              }
              required
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
              <option value="">Select answer</option>
              <option value="True">True</option>
              <option value="False">False</option>
            </select>
          )}
        </div>

        {/* Concept - FIXED */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ color: "#cbd5e1", display: "block", marginBottom: "8px", fontSize: "14px" }}>
            Concept *
          </label>
          <select
            value={formData.concept_id}
            onChange={(e) =>
              setFormData({ ...formData, concept_id: parseInt(e.target.value) })
            }
            required
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
            {formData.concept_id === 0 && <option value={0}>Select a concept</option>}
            {concepts.map((concept) => (
              <option key={concept.id} value={concept.id}>
                {concept.concept_name}
              </option>
            ))}
          </select>
          {formData.concept_id === 0 && (
            <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>
              Please select a concept
            </p>
          )}
        </div>

        {/* Bloom's Level */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ color: "#cbd5e1", display: "block", marginBottom: "8px", fontSize: "14px" }}>
            Bloom's Taxonomy Level
          </label>
          <select
            value={formData.bloom_level}
            onChange={(e) =>
              setFormData({ ...formData, bloom_level: e.target.value })
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
            {bloomLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: "25px" }}>
          <label style={{ color: "#cbd5e1", display: "block", marginBottom: "8px", fontSize: "14px" }}>
            Question Image (Optional)
          </label>
          {questionData?.image_path && (
            <div style={{ marginBottom: "10px" }}>
              <img
                src={`http://localhost:5000/${questionData.image_path}`}
                alt="Current"
                style={{ maxWidth: "200px", borderRadius: "8px" }}
              />
              <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>
                Current image (upload new to replace)
              </p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
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

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="submit"
            disabled={loading || formData.concept_id === 0}
            style={{
              flex: 1,
              padding: "14px",
              backgroundColor: loading || formData.concept_id === 0 ? "#64748b" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading || formData.concept_id === 0 ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Saving..." : mode === "edit" ? "Update Question" : "Add Question"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "14px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionEditor;
