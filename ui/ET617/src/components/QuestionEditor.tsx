import React, { useState, useEffect, useRef } from "react";
// Import scratchblocks
import scratchblocks from 'scratchblocks';
import 'scratchblocks/locales/all';

// Base URL for your backend
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

interface Concept {
  id: number;
  concept_name: string;
  description?: string;
}

// --- UPDATED INTERFACE ---
interface QuestionData {
  id?: number;
  question_text: string;
  question_type: string;
  options: any; // Your existing type: { A: "", B: "", C: "", D: "" } or {}
  correct_answer: string;
  bloom_level: string;
  concept_id: number;
  grade: number;
  image_path?: string | null;
  scratch_text?: string | null; // <-- ADDED
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
  // --- EXISTING STATE ---
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false); // Used for saving

  // --- NEW STATE ---
  const [isGenerating, setIsGenerating] = useState(false); // For "Suggest" button
  const [error, setError] = useState<string | null>(null); // For AI errors
  const [imagePreview, setImagePreview] = useState<string | null>(null); // For NEWLY uploaded file
  const scratchCodeRef = useRef<HTMLPreElement>(null); // Ref for scratch <pre> tag

  // --- UPDATED FORMDATA STATE ---
  const [formData, setFormData] = useState<QuestionData>({
    question_text: "",
    question_type: "MCQ",
    options: { A: "", B: "", C: "", D: "" },
    correct_answer: "",
    bloom_level: "Understanding",
    concept_id: 0,
    grade: grade, // Default to prop grade
    image_path: null,
    scratch_text: null, // <-- ADDED
  });

  // --- UPDATED DATA LOADING EFFECT ---
  useEffect(() => {
    if (questionData) {
      // Editing an existing question
      setFormData({
        ...questionData,
        options: (typeof questionData.options === 'string')
          ? JSON.parse(questionData.options)
          : (questionData.options || (questionData.question_type === 'MCQ' ? { A: "", B: "", C: "", D: "" } : {})),
        concept_id: Number(questionData.concept_id) || 0,
      });
      setImageFile(null);
      setImagePreview(null);
    } else {
      // Adding a new question, reset to default
      setFormData({
        question_text: "",
        question_type: "MCQ",
        options: { A: "", B: "", C: "", D: "" },
        correct_answer: "",
        bloom_level: "Understanding",
        concept_id: 0,
        grade: grade,
        image_path: null,
        scratch_text: null,
      });
      setImageFile(null);
      setImagePreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionData, grade]);

  // --- EXISTING CONCEPT FETCH EFFECT ---
  useEffect(() => { 
    const fetchConcepts = async () => { 
      try { 
        const res = await fetch(`${API_BASE_URL}/admin/concepts/${submoduleCode}/${grade}`, { 
          credentials: "include" 
        }); 
        if (res.ok) { 
          const data = await res.json(); 
          setConcepts(data); 
          
          // Only auto-set concept_id when adding a NEW question, not when editing
          if (!questionData) {
            setFormData((prevFormData) => { 
              const currentConceptId = prevFormData.concept_id; 
              if (currentConceptId && data.some((c: Concept) => c.id === currentConceptId)) { 
                return prevFormData; 
              } 
              if (data.length > 0) { 
                return { ...prevFormData, concept_id: data[0].id }; 
              } 
              return { ...prevFormData, concept_id: 0 }; 
            });
          }
        } 
      } catch (err) { 
        console.error("Error fetching concepts:", err); 
      } 
    }; 
    fetchConcepts(); 
  }, [submoduleCode, grade, questionData]);

  // --- *** UPDATED *** EFFECT FOR RENDERING SCRATCH BLOCKS ---
  useEffect(() => {
    if (formData.scratch_text && scratchCodeRef.current) {
      const element = scratchCodeRef.current;
      
      // 1. Prepare the element with the raw text
      element.innerHTML = '';
      element.textContent = formData.scratch_text;

      // 2. Define the *unique selector string* for this element
      const selector = "#question-editor-scratch-preview"; // Use the ID from JSX

      try {
        // 3. Pass the SELECTOR STRING to renderMatching
        scratchblocks.renderMatching(selector, {
          style: 'scratch3',
          scale: 0.85,
          languages: ['en']
        });
      } catch (renderError) {
        // This is the error you saw.
        console.error("Scratchblocks rendering failed:", renderError);
        element.textContent = `Error rendering Scratch blocks.`;
      }

    } else if (scratchCodeRef.current) {
      // Clear the element if there's no scratch text
      scratchCodeRef.current.innerHTML = '';
      scratchCodeRef.current.textContent = '';
    }
  }, [formData.scratch_text]); // Reruns ONLY when scratch_text changes
  // --- *** END UPDATED *** ---

  // --- UPDATED HANDLESUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question_text.trim()) return alert("Please enter question text");
    if (!formData.correct_answer) return alert("Please select correct answer");
    if (!formData.concept_id || formData.concept_id === 0) return alert("Please select a concept");

    setLoading(true);
    setError(null);
    const payload = new FormData();

    payload.append("question_text", formData.question_text);
    payload.append("question_type", formData.question_type);
    payload.append("correct_answer", formData.correct_answer);
    payload.append("bloom_level", formData.bloom_level);
    payload.append("concept_id", String(formData.concept_id));
    payload.append("grade", String(formData.grade));
    payload.append("options", formData.question_type === "MCQ" ? JSON.stringify(formData.options) : "{}");

    if (formData.scratch_text) {
      payload.append("scratch_text", formData.scratch_text);
    } else if (imageFile) {
      payload.append("image", imageFile);
    } else if (formData.image_path) {
      payload.append("image_path", formData.image_path);
    }
    
    try {
      let url = "";
      let method: "POST" | "PUT" = "POST";
      
      if (mode === "edit" && questionData?.id) {
        url = `${API_BASE_URL}/admin/question/${questionData.id}`;
        method = "PUT";
      } else {
        url = `${API_BASE_URL}/admin/question_set/${setId}/add_question`;
        method = "POST";
      }

      const res = await fetch(url, { method, credentials: "include", body: payload });
      if (res.ok) {
        alert(mode === "edit" ? "Question updated!" : "Question added!");
        onSave();
      } else {
        const err = await res.json().catch(() => ({}));
        const errorMsg = err?.message || err?.error || "Failed to save question";
        setError(errorMsg);
        alert(errorMsg);
      }
    } catch (err) {
      console.error("Error saving question:", err);
      const errorMsg = (err as Error).message || "An unknown error occurred while saving.";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: Handle Image File Change ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData({ ...formData, scratch_text: null, image_path: null });
      setError(null);
    } else {
      setImagePreview(null);
    }
  };

  // --- NEW: Handle Suggest Image Click ---
  const handleSuggestImage = async () => {
    if (!formData.question_text.trim()) {
      setError("Please enter question text before suggesting.");
      return;
    }
    setIsGenerating(true);
    setError(null);

    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, scratch_text: null, image_path: null });

    try {
      let optionsToSend: string[] = [];
      if (formData.question_type === 'MCQ' && typeof formData.options === 'object') {
          optionsToSend = Object.values(formData.options).filter(opt => opt && opt.trim() !== '');
      }

      const res = await fetch(`${API_BASE_URL}/api/generate-scratch-text`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_text: formData.question_text,
          options: optionsToSend,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `AI service failed with status ${res.status}`);
      }

      const data = await res.json();
      setFormData({ ...formData, scratch_text: data.scratch_text, image_path: null });

    } catch (err) {
      console.error("Error suggesting image:", err);
      setError((err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Helpers & UI Data ---
  const bloomLevels = ["Remembering", "Understanding", "Applying", "Analyzing", "Evaluating", "Creating"];

  let currentVisual: 'scratch' | 'new_image' | 'existing_image' | 'none' = 'none';
  if (formData.scratch_text) {
    currentVisual = 'scratch';
  } else if (imagePreview) {
    currentVisual = 'new_image';
  } else if (formData.image_path) {
    currentVisual = 'existing_image';
  }

  // --- UPDATED JSX ---
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
      <h3 style={{ marginTop: 0, color: "var(--text-primary)" }}>{mode === "edit" ? "✏️ Edit Question" : "➕ Add New Question"}</h3>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        {/* Question Type */}
        <div>
          <label style={{ color: "var(--text-secondary)", fontWeight: 700 }}>Question Type</label>
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
            value={formData.question_text}
            onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
            rows={4}
            className="form-input"
          />
        </div>

        {/* MCQ Options */}
        {formData.question_type === "MCQ" && (
          <div>
            <label style={{ color: "var(--text-secondary)", fontWeight: 700 }}>Options *</label>
            <div style={{ display: "grid", gap: 8 }}>
              {["A", "B", "C", "D"].map((k) => (
                <input
                  key={k}
                  value={formData.options[k] || ""}
                  onChange={(e) => setFormData({ ...formData, options: { ...formData.options, [k]: e.target.value } })}
                  placeholder={`Option ${k}`}
                  className="form-input"
                />
              ))}
            </div>
          </div>
        )}

        {/* Correct Answer */}
        <div>
          <label style={{ color: "var(--text-secondary)", fontWeight: 700 }}>Correct Answer *</label>
          {formData.question_type === "MCQ" ? (
            <select value={formData.correct_answer} onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })} className="form-select">
              <option value="">Select correct option</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          ) : (
            <select value={formData.correct_answer} onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })} className="form-select">
              <option value="">Select</option>
              <option value="True">True</option>
              <option value="False">False</option>
            </select>
          )}
        </div>

        {/* Concept */}
        <div>
          <label style={{ color: "var(--text-secondary)", fontWeight: 700 }}>Concept *</label>
          <select value={formData.concept_id} onChange={(e) => setFormData({ ...formData, concept_id: parseInt(e.target.value, 10) })} className="form-select">
            <option value={0} disabled>Select a concept</option>
            {concepts.map((c) => <option key={c.id} value={c.id}>{c.concept_name}</option>)}
          </select>
          {formData.concept_id === 0 && <div style={{ color: "var(--error)", fontSize: 13 }}>Please select a concept</div>}
        </div>

        {/* Bloom's Level */}
        <div>
          <label style={{ color: "var(--text-secondary)", fontWeight: 700 }}>Bloom's Level</label>
          <select value={formData.bloom_level} onChange={(e) => setFormData({ ...formData, bloom_level: e.target.value })} className="form-select">
            {bloomLevels.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* --- NEW VISUALS SECTION --- */}
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
              disabled={isGenerating || !formData.question_text.trim()}
              className="form-button-secondary"
              title={!formData.question_text.trim() ? "Please enter question text first" : "Suggest an image using AI"}
            >
              {isGenerating ? "Generating..." : "Suggest Scratch Image"}
            </button>
          </div>

          {error && (
            <div style={{ color: "var(--error)", fontSize: 13, marginTop: 8 }}>
              {error}
            </div>
          )}

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
            {/* --- *** UPDATED PREVIEW LOGIC *** --- */}
            {currentVisual === 'scratch' && (
              // Add the unique ID here
              <pre ref={scratchCodeRef} id="question-editor-scratch-preview" className="blocks">{/* Content set by useEffect */}</pre>
            )}
            {currentVisual === 'new_image' && imagePreview && (
              <img src={imagePreview} alt="New upload preview" style={{ maxWidth: '100%', maxHeight: 250, borderRadius: 8 }} />
            )}
            {currentVisual === 'existing_image' && formData.image_path && (
              <img src={`${API_BASE_URL}${formData.image_path}`} alt="Current" style={{ maxWidth: '100%', maxHeight: 250, borderRadius: 8 }} />
            )}
            {currentVisual === 'none' && (
              <div style={{ color: "var(--text-secondary)", fontSize: 13, textAlign: 'center' }}>
                Upload an image or Suggest Scratch blocks
              </div>
            )}
            {/* --- *** END UPDATED PREVIEW LOGIC *** --- */}
          </div>
        </div>
        {/* --- END VISUALS SECTION --- */}

        {/* Form Actions */}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button type="submit" disabled={loading || isGenerating || formData.concept_id === 0} className="submit-button" style={{ flex: 1 }}>
            {loading ? "Saving..." : mode === "edit" ? "Update Question" : "Add Question"}
          </button>
          <button type="button" onClick={onCancel} className="secondary" style={{ flex: 1 }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionEditor;