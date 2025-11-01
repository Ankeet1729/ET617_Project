import React, { useState, useEffect, useRef } from "react";

// --- Imports for Scratchblocks ---
import scratchblocks from 'scratchblocks';
import 'scratchblocks/locales/all';

// --- Base URL for your backend ---
const API_BASE_URL = import.meta.env.BACKEND_URL || "http://localhost:5000";

interface Concept {
  id: number;
  concept_name: string;
}

// --- UPDATED QuestionDraft Interface ---
interface QuestionDraft {
  id: string; // Client-side ID
  question_text: string;
  question_type: string;
  options: any;
  correct_answer: string;
  bloom_level: string;
  concept_id: number;
  image?: File | null;
  scratch_text?: string | null; // <-- ADDED
}
// --- END UPDATED ---

interface ManualSetCreatorProps {
  submoduleCode: string;
  grade: number;
  onComplete: () => void;
  onCancel: () => void;
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
  
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(false); // For the FINAL submit
  
  // --- NEW State for the mini-editor ---
  const [isGenerating, setIsGenerating] = useState(false); // For "Suggest" button
  const [error, setError] = useState<string | null>(null); // For AI/validation errors
  const [imagePreview, setImagePreview] = useState<string | null>(null); // For new file preview
  const scratchCodeRef = useRef<HTMLPreElement>(null); // Ref for scratch <pre> tag
  // --- END NEW State ---
  
  const [currentQuestion, setCurrentQuestion] = useState<QuestionDraft>({
    id: Date.now().toString(),
    question_text: "",
    question_type: "MCQ",
    options: { A: "", B: "", C: "", D: "" },
    correct_answer: "",
    bloom_level: "Understanding",
    concept_id: 0,
    image: null,
    scratch_text: null, // <-- ADDED
  });

  useEffect(() => {
    fetchConcepts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // --- *** UPDATED *** useEffect for rendering scratchblocks ---
  useEffect(() => {
    if (currentQuestion.scratch_text && scratchCodeRef.current) {
      const element = scratchCodeRef.current;
      
      // 1. Prepare the element with the raw text
      element.innerHTML = '';
      element.textContent = currentQuestion.scratch_text;

      // 2. Define the *unique selector string* for this element
      const selector = "#manual-creator-scratch-preview"; // Use the ID from JSX

      // 3. Render using the selector string
      try {
        scratchblocks.renderMatching(selector, {
          style: 'scratch3',
          scale: 0.85,
        });
      } catch (renderError) {
        console.error("Scratchblocks rendering failed:", renderError);
        element.textContent = `[Error rendering visual]`;
      }
    } else if (scratchCodeRef.current) {
      // Clear the element if there's no scratch text
      scratchCodeRef.current.innerHTML = '';
      scratchCodeRef.current.textContent = '';
    }
  }, [currentQuestion.scratch_text]); // Reruns ONLY when the current question's text changes
  // --- *** END UPDATED *** ---

  const fetchConcepts = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/concepts/${submoduleCode}/${grade}`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        setConcepts(data);
        if (data.length > 0) {
          setCurrentQuestion((prev) => ({ ...prev, concept_id: data[0].id }));
        }
      }
    } catch (err) {
      console.error("Error fetching concepts:", err);
    }
  };

  // --- NEW: Handle Image File Change for mini-editor ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setCurrentQuestion({
        ...currentQuestion,
        image: file,
        scratch_text: null,
      });
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    } else {
      setCurrentQuestion({ ...currentQuestion, image: null });
      setImagePreview(null);
    }
  };

  // --- NEW: Handle Suggest Image Click for mini-editor ---
  const handleSuggestImage = async () => {
    if (!currentQuestion.question_text.trim()) {
      setError("Please enter question text before suggesting.");
      return;
    }
    setIsGenerating(true);
    setError(null);

    setImagePreview(null);
    setCurrentQuestion({
      ...currentQuestion,
      image: null,
      scratch_text: null,
    });

    try {
      let optionsToSend: string[] = [];
      if (currentQuestion.question_type === 'MCQ' && typeof currentQuestion.options === 'object') {
          optionsToSend = Object.values(currentQuestion.options).filter(opt => opt && opt.trim() !== '');
      }

      const res = await fetch(`${API_BASE_URL}/api/generate-scratch-text`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_text: currentQuestion.question_text,
          options: optionsToSend,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `AI service failed with status ${res.status}`);
      }

      const data = await res.json();
      setCurrentQuestion((prev) => ({
        ...prev,
        scratch_text: data.scratch_text,
      }));

    } catch (err) {
      console.error("Error suggesting image:", err);
      setError((err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- UPDATED: handleAddQuestion ---
  const handleAddQuestion = () => {
    if (!currentQuestion.question_text.trim() || !currentQuestion.correct_answer || currentQuestion.concept_id === 0) {
      alert("Please fill in all required fields (Text, Answer, Concept)");
      return;
    }

    if (currentQuestion.question_type === "MCQ") {
      const hasEmpty = Object.values(currentQuestion.options).some((v) => !v || !String(v).trim());
      if (hasEmpty) {
        alert("Please fill in all MCQ options");
        return;
      }
    }

    setQuestions((prev) => [...prev, { ...currentQuestion, id: Date.now().toString() }]);

    // Reset the mini-editor form
    setCurrentQuestion({
      id: Date.now().toString(),
      question_text: "",
      question_type: "MCQ",
      options: { A: "", B: "", C: "", D: "" },
      correct_answer: "",
      bloom_level: "Understanding",
      concept_id: concepts[0]?.id || 0,
      image: null,
      scratch_text: null, // <-- ADDED to reset
    });
    
    setImagePreview(null);
    setError(null);
    setShowQuestionForm(false);
  };
  // --- END UPDATED ---

  const handleRemoveQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // --- UPDATED: handleSubmitSet ---
  const handleSubmitSet = async () => {
    if (!setName.trim()) {
      alert("Please enter a set name");
      return;
    }
    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    setLoading(true);
    try {
      const setRes = await fetch(`${API_BASE_URL}/admin/create_manual_set`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          submodule_code: submoduleCode,
          grade,
          set_name: setName,
        }),
      });

      if (!setRes.ok) throw new Error("Failed to create question set");
      const { question_set_id } = await setRes.json();

      for (const q of questions) {
        const formData = new FormData();
        formData.append("question_text", q.question_text);
        formData.append("question_type", q.question_type);
        formData.append("correct_answer", q.correct_answer);
        formData.append("bloom_level", q.bloom_level);
        formData.append("concept_id", q.concept_id.toString());
        formData.append("grade", grade.toString());
        formData.append("options", q.question_type === "MCQ" ? JSON.stringify(q.options) : "{}");
        
        if (q.scratch_text) {
          formData.append("scratch_text", q.scratch_text);
        } else if (q.image) {
          formData.append("image", q.image);
        }

        const questionRes = await fetch(
          `${API_BASE_URL}/admin/question_set/${question_set_id}/add_question`,
          { method: "POST", credentials: "include", body: formData }
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
  // --- END UPDATED ---

  const bloomLevels = ["Remembering", "Understanding", "Applying", "Analyzing", "Evaluating", "Creating"];

  // --- UPDATED JSX ---
  return (
    <div className="container" style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12 }}>
        <h2 style={{ margin: 0, color: "var(--text-primary)" }}>✏️ Create Manual Quiz Set</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="secondary" onClick={onCancel}>Close</button>
        </div>
      </div>

      <section style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 16, borderRadius: 12, marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, color: "var(--text-secondary)", fontWeight: 700 }}>Quiz Set Name *</label>
        <input
          value={setName}
          onChange={(e) => setSetName(e.target.value)}
          placeholder="Enter quiz set name"
          className="form-input"
        />
      </section>

      <section style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0, color: "var(--text-primary)" }}>Questions ({questions.length})</h3>
          <button onClick={() => setShowQuestionForm((s) => !s)} className="submit-button" style={{ padding: "10px 14px" }}>
            {showQuestionForm ? "Cancel" : "Add Question"}
          </button>
        </div>

        {/* --- MINI-EDITOR FORM --- */}
        {showQuestionForm && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 16, borderRadius: 10, marginBottom: 12 }}>
            <h4 style={{ marginTop: 0, color: "var(--text-primary)" }}>Add New Question</h4>

            <div style={{ display: "grid", gap: 12 }}>
              {/* Question Type */}
              <div>
                <label style={{ color: "var(--text-secondary)", fontWeight: 700 }}>Question Type</label>
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
                  className="form-select"
                >
                  <option value="MCQ">Multiple Choice (MCQ)</option>
                  <option value="BOOLEAN">True/False</option>
                </select>
              </div>

              {/* Question Text */}
              <div>
                <label style={{ color: "var(--text-secondary)", fontWeight: 700 }}>Question Text *</label>
                <textarea
                  rows={3}
                  value={currentQuestion.question_text}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
                  className="form-input"
                />
              </div>

              {/* MCQ Options */}
              {currentQuestion.question_type === "MCQ" && (
                <div>
                  <label style={{ color: "var(--text-secondary)", fontWeight: 700 }}>Options *</label>
                  <div style={{ display: "grid", gap: 8 }}>
                    {["A", "B", "C", "D"].map((k) => (
                      <input
                        key={k}
                        placeholder={`Option ${k}`}
                        value={currentQuestion.options[k] || ""}
                        onChange={(e) =>
                          setCurrentQuestion({
                            ...currentQuestion,
                            options: { ...currentQuestion.options, [k]: e.target.value },
                          })
                        }
                        className="form-input"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Correct Answer */}
              <div>
                <label style={{ color: "var(--text-secondary)", fontWeight: 700 }}>Correct Answer *</label>
                {currentQuestion.question_type === "MCQ" ? (
                  <select
                    value={currentQuestion.correct_answer}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
                    className="form-select"
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
                    className="form-select"
                  >
                    <option value="">Select</option>
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select>
                )}
              </div>

              {/* Concept */}
              <div>
                <label style={{ color: "var(--text-secondary)", fontWeight: 700 }}>Concept *</label>
                <select
                  value={currentQuestion.concept_id}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, concept_id: parseInt(e.target.value, 10) })}
                  className="form-select"
                >
                  <option value={0} disabled>Select a concept</option>
                  {concepts.map((c) => (
                    <option key={c.id} value={c.id}>{c.concept_name}</option>
                  ))}
                </select>
              </div>

              {/* Bloom's Level */}
              <div>
                <label style={{ color: "var(--text-secondary)", fontWeight: 700 }}>Bloom's Level</label>
                <select
                  value={currentQuestion.bloom_level}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, bloom_level: e.target.value })}
                  className="form-select"
                >
                  {bloomLevels.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* --- NEW VISUALS SECTION for mini-editor --- */}
              <div>
                <label style={{ color: "var(--text-secondary)", fontWeight: 700, marginBottom: '8px', display: 'block' }}>
                  Question Visual (optional)
                </label>
                
                <div style={{ display: "flex", gap: 12, alignItems: 'center' }}>
                  <label className="form-button-secondary">
                    Upload Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="form-input"
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span style={{ color: "var(--text-secondary)" }}>OR</span>
                  <button 
                    type="button" 
                    onClick={handleSuggestImage} 
                    disabled={isGenerating || !currentQuestion.question_text.trim()}
                    className="form-button-secondary"
                    title={!currentQuestion.question_text.trim() ? "Please enter question text first" : "Suggest an image using AI"}
                  >
                    {isGenerating ? "Generating..." : "Suggest Scratch Image"}
                  </button>
                </div>

                {error && (
                  <div style={{ color: "var(--error)", fontSize: 13, marginTop: 8 }}>
                    {error}
                  </div>
                )}

                {/* --- *** UPDATED PREVIEW AREA *** --- */}
                <div style={{
                  minHeight: 100,
                  border: "1px dashed var(--border)",
                  borderRadius: 8,
                  padding: 8,
                  marginTop: 12,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'var(--surface-dim)',
                  overflow: 'auto'
                }}>
                  {currentQuestion.scratch_text ? (
                    // Give this preview area a unique ID
                    <pre ref={scratchCodeRef} id="manual-creator-scratch-preview" className="blocks">{/* Content set by useEffect */}</pre>
                  ) : imagePreview ? (
                    <img src={imagePreview} alt="New upload preview" style={{ maxWidth: '100%', maxHeight: 250, borderRadius: 8 }} />
                  ) : (
                    <div style={{ color: "var(--text-secondary)", fontSize: 13, textAlign: 'center' }}>
                      Upload an image or Suggest Scratch blocks
                    </div>
                  )}
                </div>
                {/* --- *** END UPDATED PREVIEW AREA *** --- */}
              </div>
              {/* --- END VISUALS SECTION --- */}

              {/* Add/Cancel Buttons for mini-editor */}
              <div style={{ display: "flex", gap: 8, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                <button type="button" onClick={handleAddQuestion} className="submit-button" style={{ flex: 1 }}>
                  Add Question to Set
                </button>
                <button type="button" onClick={() => setShowQuestionForm(false)} className="secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* --- END MINI-EDITOR FORM --- */}

        {/* List of questions already added */}
        {questions.map((q, idx) => (
          <div key={q.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 12, borderRadius: 10, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <div>
                <div style={{ color: "var(--primary)", fontWeight: 800 }}>Q{idx + 1}. {q.question_type}</div>
                <div style={{ color: "var(--text-secondary)" }}>{q.question_text}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: 4 }}>
                  {q.scratch_text ? "(Scratch blocks attached)" : q.image ? "(Image attached)" : "(No visual)"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => handleRemoveQuestion(q.id)} className="secondary" style={{ background: "var(--error)", color: "white", border: "none" }}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Final Submit/Cancel for the whole set */}
      <div style={{ display: "flex", gap: 12, marginTop: 8, borderTop: '2px solid var(--border)', paddingTop: 16 }}>
        <button onClick={handleSubmitSet} disabled={loading || questions.length === 0 || !setName.trim()} className="submit-button" style={{ flex: 1 }}>
          {loading ? "Creating..." : `Create Quiz Set (${questions.length})`}
        </button>
        <button onClick={onCancel} className="secondary" style={{ flex: 1 }}>Cancel</button>
      </div>
    </div>
  );
};

export default ManualSetCreator;