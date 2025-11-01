import React, { useState, useEffect } from "react";
import QuestionEditor from "./QuestionEditor";

// --- Imports for Scratchblocks ---
import scratchblocks from 'scratchblocks';
import 'scratchblocks/locales/all';

// --- Base URL for images ---
const API_BASE_URL = import.meta.env.BACKEND_URL || "http://localhost:5000";

// --- UPDATED Question Interface ---
interface Question {
  id: number;
  question_text: string;
  question_type: string;
  options: any;
  correct_answer: string;
  bloom_level: string;
  concept: string;
  concept_id: number;
  image_path: string | null;
  scratch_text?: string | null; // <-- ADDED
  grade: number;
}
// --- END UPDATED ---

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
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // --- *** UPDATED *** useEffect for Scratchblocks ---
  // This hook runs every time the 'questionSet' data changes
  useEffect(() => {
    // We only need to render if the set has questions and is not loading
    if (questionSet && questionSet.questions.length > 0) {
      
      // We use a timeout to let React render the list *first*
      setTimeout(() => {
        
        // 1. Define the *selector string* for all blocks in this list
        const selector = ".admin-question-list-scratch";

        // 2. Find all elements that match
        const elements = document.querySelectorAll(selector);
        
        if (elements.length > 0) {
          // 3. We must manually prepare each element
          elements.forEach(el => {
            const pre = el as HTMLPreElement;
            // Get the raw text from the 'data-text' attribute we add in the JSX
            const text = pre.dataset.text; 
            if (text) {
              pre.innerHTML = '';
              pre.textContent = text;
            }
          });

          // 4. Now, render all matching elements at once using the selector string
          try {
            scratchblocks.renderMatching(selector, {
              style: 'scratch3',
              scale: 0.7, // A bit smaller for the list view
            });
          } catch (renderError) {
            console.error("Scratchblocks rendering failed for list:", renderError);
          }
        }
      }, 100); // 100ms delay to be safe and ensure DOM is ready
    }
  }, [questionSet, editingQuestionId, showAddForm]); // Re-run when set data changes or we exit edit/add mode
  // --- *** END UPDATED *** ---

  useEffect(() => {
    fetchQuestionSet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setId]);

  const fetchQuestionSet = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/question_set/${setId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setQuestionSet(data);
      } else {
        setQuestionSet(null);
      }
    } catch (err) {
      console.error("Error fetching question set:", err);
      setQuestionSet(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/question/${questionId}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        alert("Question deleted successfully!");
        fetchQuestionSet();
      } else {
        alert("Failed to delete question");
      }
    } catch (err) {
      console.error("Error deleting question:", err);
      alert("Error deleting question");
    }
  };

  const handleSaveComplete = () => {
    setEditingQuestionId(null);
    setShowAddForm(false);
    fetchQuestionSet(); // This will re-fetch and re-trigger the scratchblocks useEffect
  };

  if (loading) return <div className="container" style={{ padding: 16 }}>Loading...</div>;
  if (!questionSet) return <div className="container" style={{ padding: 16, color: "var(--error)" }}>Question set not found</div>;

  return (
    <div className="container" style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        <div>
          <button onClick={onBack} className="secondary" style={{ marginBottom: 8 }}>← Back to Quiz Sets</button>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 12, borderRadius: 10 }}>
            <h2 style={{ margin: 0, color: "var(--text-primary)" }}>{questionSet.name}</h2>
            <div style={{ color: "var(--text-secondary)", marginTop: 8, fontSize: 14 }}>
              <div><strong>Submodule:</strong> {questionSet.submodule_code} - {questionSet.submodule_name}</div>
              <div><strong>Grade:</strong> {questionSet.grade}</div>
              <div><strong>Total Questions:</strong> {questionSet.questions.length}</div>
              <div><strong>Created:</strong> {new Date(questionSet.created_at).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "start" }}>
          <button onClick={() => setShowAddForm((s) => !s)} className="submit-button">
            {showAddForm ? "Cancel" : "Add New Question"}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div style={{ marginBottom: 12 }}>
          {/* QuestionEditor component is already updated and will work here */}
          <QuestionEditor mode="add" submoduleCode={questionSet.submodule_code} grade={questionSet.grade} setId={setId} onSave={handleSaveComplete} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      {/* --- This is the list of questions --- */}
      <div style={{ display: "grid", gap: 12 }}>
        {questionSet.questions.map((question, index) => (
          <div key={question.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 12 }}>
            {editingQuestionId === question.id ? (
              // The editor component will render its own scratchblocks
              <QuestionEditor mode="edit" questionData={question} submoduleCode={questionSet.submodule_code} grade={questionSet.grade} setId={setId} onSave={handleSaveComplete} onCancel={() => setEditingQuestionId(null)} />
            ) : (
              // This is the read-only view for the list
              <>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                      <span style={{ padding: "4px 10px", borderRadius: 999, background: "var(--primary)", color: "white", fontWeight: 700 }}>Q{index + 1}</span>
                      <span style={{ padding: "4px 10px", borderRadius: 999, background: "var(--secondary)", color: "white" }}>{question.question_type}</span>
                      <span style={{ padding: "4px 10px", borderRadius: 999, background: "var(--primary-light)", color: "white" }}>{question.bloom_level}</span>
                      <span style={{ padding: "4px 10px", borderRadius: 999, background: "rgba(16,185,129,0.12)", color: "var(--success)" }}>{question.concept}</span>
                    </div>

                    <p style={{ margin: 0, color: "var(--text-primary)" }}>{question.question_text}</p>

                    {/* --- UPDATED VISUALS SECTION (for list view) --- */}
                    <div style={{ marginTop: 8 }}>
                      {question.image_path && (
                        <img 
                          src={`${API_BASE_URL}${question.image_path}`} 
                          alt="q" 
                          style={{ maxWidth: 320, borderRadius: 8, border: "1px solid var(--border)" }} 
                        />
                      )}
                      {question.scratch_text && !question.image_path && (
                        <pre 
                          className="admin-question-list-scratch" // Class for useEffect to find
                          data-text={question.scratch_text} // Store raw text here
                          style={{ overflow: 'auto', background: '#f0f0f0', padding: '5px' }}
                        >
                          {/* We set text content via useEffect */}
                        </pre>
                      )}
                    </div>
                    {/* --- END VISUALS SECTION --- */}

                    {question.question_type === "MCQ" && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ color: "var(--text-secondary)", fontWeight: 700, marginBottom: 6 }}>Options</div>
                        <div style={{ display: "grid", gap: 8 }}>
                          {Object.entries(question.options || {}).map(([k, v]) => (
                            <div key={k} style={{ display: "flex", gap: 12, alignItems: "center", padding: 8, borderRadius: 8, border: `1px solid var(--border)`, background: k === question.correct_answer ? "rgba(16,185,129,0.07)" : "var(--surface-2)" }}>
                              <div style={{ minWidth: 34, textAlign: "center", fontWeight: 800, background: k === question.correct_answer ? "var(--secondary)" : "var(--border)", color: k === question.correct_answer ? "white" : "var(--text-primary)", padding: "4px 8px", borderRadius: 6 }}>{k}</div>
                              <div style={{ color: "var(--text-primary)" }}>{String(v)}</div>
                              {k === question.correct_answer && <div style={{ marginLeft: "auto", color: "var(--success)", fontWeight: 800 }}>✓ Correct</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {question.question_type === "BOOLEAN" && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ color: "var(--text-secondary)", fontWeight: 700 }}>Correct Answer</div>
                        <div style={{ marginTop: 6, padding: 8, borderRadius: 8, background: "rgba(16,185,129,0.08)", color: "var(--text-primary)", fontWeight: 700 }}>
                          {question.correct_answer === "A" ? "True" : question.correct_answer === "B" ? "False" : question.correct_answer}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setEditingQuestionId(question.id)} className="submit-button">Edit</button>
                    <button onClick={() => handleDeleteQuestion(question.id)} className="secondary" style={{ background: "var(--error)", color: "white", border: "none" }}>Delete</button>
                  </div>
                </div>

                <div style={{ marginTop: 10, borderTop: "1px solid var(--border)", paddingTop: 8, color: "var(--text-secondary)", fontSize: 13 }}>
                  <span style={{ marginRight: 12 }}><strong>ID:</strong> {question.id}</span>
                  <span><strong>Grade:</strong> {question.grade}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionSetViewer;