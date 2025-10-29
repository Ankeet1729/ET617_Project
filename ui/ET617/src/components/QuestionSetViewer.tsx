// import React, { useState, useEffect } from "react";
// import QuestionEditor from "./QuestionEditor";

// interface Question {
//   id: number;
//   question_text: string;
//   question_type: string;
//   options: any;
//   correct_answer: string;
//   bloom_level: string;
//   concept: string;
//   concept_id: number;
//   image_path: string | null;
//   grade: number;
// }

// interface QuestionSet {
//   id: number;
//   name: string;
//   created_at: string;
//   grade: number;
//   submodule_code: string;
//   submodule_name: string;
//   questions: Question[];
// }

// interface QuestionSetViewerProps {
//   setId: number;
//   onBack: () => void;
// }

// const QuestionSetViewer: React.FC<QuestionSetViewerProps> = ({ setId, onBack }) => {
//   const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
//   const [showAddForm, setShowAddForm] = useState(false);

//   useEffect(() => {
//     fetchQuestionSet();
//   }, [setId]);

//   const fetchQuestionSet = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`http://localhost:5000/admin/question_set/${setId}`, {
//         credentials: "include",
//       });
//       if (res.ok) {
//         const data = await res.json();
//         console.log("✅ Question set loaded:", data);
//         setQuestionSet(data);
//       }
//     } catch (err) {
//       console.error("Error fetching question set:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteQuestion = async (questionId: number) => {
//     if (!window.confirm("Are you sure you want to delete this question?")) {
//       return;
//     }

//     try {
//       const res = await fetch(`http://localhost:5000/admin/question/${questionId}`, {
//         method: "DELETE",
//         credentials: "include",
//       });

//       if (res.ok) {
//         alert("Question deleted successfully!");
//         fetchQuestionSet();
//       } else {
//         alert("Failed to delete question");
//       }
//     } catch (err) {
//       console.error("Error deleting question:", err);
//       alert("Error deleting question");
//     }
//   };

//   const handleSaveComplete = () => {
//     setEditingQuestionId(null);
//     setShowAddForm(false);
//     fetchQuestionSet();
//   };

//   if (loading) {
//     return <div style={{ padding: "20px", color: "#f1f5f9" }}>Loading...</div>;
//   }

//   if (!questionSet) {
//     return <div style={{ padding: "20px", color: "#ef4444" }}>Question set not found</div>;
//   }

//   return (
//     <div style={{ padding: "20px", minHeight: "100vh" }}>
//       {/* Header */}
//       <div style={{ marginBottom: "30px" }}>
//         <button
//           onClick={onBack}
//           style={{
//             padding: "12px 24px",
//             backgroundColor: "#334155",
//             color: "#f1f5f9",
//             border: "1px solid #475569",
//             borderRadius: "8px",
//             cursor: "pointer",
//             fontSize: "16px",
//             marginBottom: "20px",
//           }}
//         >
//           ← Back to Quiz Sets
//         </button>

//         <div
//           style={{
//             backgroundColor: "#1e293b",
//             padding: "25px",
//             borderRadius: "12px",
//             border: "1px solid #334155",
//           }}
//         >
//           <h2 style={{ color: "#f1f5f9", margin: "0 0 15px 0" }}>
//             {questionSet.name}
//           </h2>
//           <div style={{ color: "#94a3b8", fontSize: "14px" }}>
//             <p style={{ margin: "5px 0" }}>
//               <strong style={{ color: "#cbd5e1" }}>Submodule:</strong> {questionSet.submodule_code} - {questionSet.submodule_name}
//             </p>
//             <p style={{ margin: "5px 0" }}>
//               <strong style={{ color: "#cbd5e1" }}>Grade:</strong> {questionSet.grade}
//             </p>
//             <p style={{ margin: "5px 0" }}>
//               <strong style={{ color: "#cbd5e1" }}>Total Questions:</strong> {questionSet.questions.length}
//             </p>
//             <p style={{ margin: "5px 0" }}>
//               <strong style={{ color: "#cbd5e1" }}>Created:</strong>{" "}
//               {new Date(questionSet.created_at).toLocaleString()}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Add Question Button */}
//       <div style={{ marginBottom: "30px" }}>
//         <button
//           onClick={() => setShowAddForm(!showAddForm)}
//           style={{
//             padding: "15px 30px",
//             backgroundColor: "#10b981",
//             color: "white",
//             border: "none",
//             borderRadius: "8px",
//             cursor: "pointer",
//             fontSize: "16px",
//             fontWeight: "bold",
//             boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
//           }}
//         >
//           {showAddForm ? "❌ Cancel Adding" : "➕ Add New Question"}
//         </button>
//       </div>

//       {/* Add Question Form */}
//       {showAddForm && (
//         <QuestionEditor
//           mode="add"
//           submoduleCode={questionSet.submodule_code}
//           grade={questionSet.grade}
//           setId={setId}
//           onSave={handleSaveComplete}
//           onCancel={() => setShowAddForm(false)}
//         />
//       )}

//       {/* Questions List */}
//       <div>
//         <h3 style={{ color: "#cbd5e1", marginBottom: "20px" }}>Questions</h3>
        
//         {questionSet.questions.map((question, index) => (
//           <div key={question.id}>
//             {editingQuestionId === question.id ? (
//               <QuestionEditor
//                 mode="edit"
//                 questionData={question}
//                 submoduleCode={questionSet.submodule_code}
//                 grade={questionSet.grade}
//                 setId={setId}
//                 onSave={handleSaveComplete}
//                 onCancel={() => setEditingQuestionId(null)}
//               />
//             ) : (
//               <div
//                 style={{
//                   backgroundColor: "#1e293b",
//                   border: "1px solid #334155",
//                   borderRadius: "12px",
//                   padding: "20px",
//                   marginBottom: "20px",
//                 }}
//               >
//                 {/* Question Header */}
//                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
//                   <div style={{ flex: 1 }}>
//                     <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
//                       <span
//                         style={{
//                           backgroundColor: "#6366f1",
//                           color: "white",
//                           padding: "4px 12px",
//                           borderRadius: "12px",
//                           fontSize: "12px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         Q{index + 1}
//                       </span>
//                       <span
//                         style={{
//                           backgroundColor: "#8b5cf6",
//                           color: "white",
//                           padding: "4px 12px",
//                           borderRadius: "12px",
//                           fontSize: "12px",
//                         }}
//                       >
//                         {question.question_type}
//                       </span>
//                       <span
//                         style={{
//                           backgroundColor: "#3b82f6",
//                           color: "white",
//                           padding: "4px 12px",
//                           borderRadius: "12px",
//                           fontSize: "12px",
//                         }}
//                       >
//                         {question.bloom_level}
//                       </span>
//                       <span
//                         style={{
//                           backgroundColor: "#10b981",
//                           color: "white",
//                           padding: "4px 12px",
//                           borderRadius: "12px",
//                           fontSize: "12px",
//                         }}
//                       >
//                         {question.concept}
//                       </span>
//                     </div>
//                   </div>
                  
//                   <div style={{ display: "flex", gap: "10px" }}>
//                     <button
//                       onClick={() => setEditingQuestionId(question.id)}
//                       style={{
//                         padding: "8px 16px",
//                         backgroundColor: "#f59e0b",
//                         color: "white",
//                         border: "none",
//                         borderRadius: "6px",
//                         cursor: "pointer",
//                         fontSize: "14px",
//                       }}
//                     >
//                       ✏️ Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteQuestion(question.id)}
//                       style={{
//                         padding: "8px 16px",
//                         backgroundColor: "#ef4444",
//                         color: "white",
//                         border: "none",
//                         borderRadius: "6px",
//                         cursor: "pointer",
//                         fontSize: "14px",
//                       }}
//                     >
//                       🗑️ Delete
//                     </button>
//                   </div>
//                 </div>

//                 {/* Question Text */}
//                 <div style={{ marginBottom: "15px" }}>
//                   <p
//                     style={{
//                       color: "#f1f5f9",
//                       fontSize: "16px",
//                       lineHeight: "1.6",
//                       margin: "0",
//                     }}
//                   >
//                     {question.question_text}
//                   </p>
//                 </div>

//                 {/* Image (if exists) */}
//                 {question.image_path && (
//                   <div style={{ marginBottom: "15px" }}>
//                     <img
//                       src={`http://localhost:5000/${question.image_path}`}
//                       alt="Question"
//                       style={{
//                         maxWidth: "400px",
//                         borderRadius: "8px",
//                         border: "1px solid #334155",
//                       }}
//                     />
//                   </div>
//                 )}

//                 {/* Options */}
//                 {question.question_type === "MCQ" && (
//                   <div style={{ marginBottom: "15px" }}>
//                     <p style={{ color: "#cbd5e1", fontSize: "14px", marginBottom: "10px" }}>
//                       <strong>Options:</strong>
//                     </p>
//                     <div style={{ display: "grid", gap: "10px" }}>
//                       {Object.entries(question.options || {}).map(([key, value]) => (
//                         <div
//                           key={key}
//                           style={{
//                             backgroundColor: key === question.correct_answer ? "#10b98120" : "#0f172a",
//                             border: `2px solid ${key === question.correct_answer ? "#10b981" : "#334155"}`,
//                             borderRadius: "8px",
//                             padding: "12px",
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "10px",
//                           }}
//                         >
//                           <span
//                             style={{
//                               backgroundColor: key === question.correct_answer ? "#10b981" : "#475569",
//                               color: "white",
//                               padding: "4px 10px",
//                               borderRadius: "4px",
//                               fontWeight: "bold",
//                               minWidth: "30px",
//                               textAlign: "center",
//                             }}
//                           >
//                             {key}
//                           </span>
//                           <span style={{ color: "#f1f5f9", flex: 1 }}>{String(value)}</span>
//                           {key === question.correct_answer && (
//                             <span style={{ color: "#10b981", fontWeight: "bold" }}>✓ Correct</span>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* True/False - FIXED */}
//                 {question.question_type === "BOOLEAN" && (
//                   <div style={{ marginBottom: "15px" }}>
//                     <p style={{ color: "#cbd5e1", fontSize: "14px", marginBottom: "10px" }}>
//                       <strong>Correct Answer:</strong>
//                     </p>
//                     <div
//                       style={{
//                         backgroundColor: "#10b98120",
//                         border: "2px solid #10b981",
//                         borderRadius: "8px",
//                         padding: "12px",
//                         color: "#f1f5f9",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {/* Convert A/B to True/False if needed */}
//                       {question.correct_answer === 'A' ? 'True' : 
//                        question.correct_answer === 'B' ? 'False' : 
//                        question.correct_answer}
//                     </div>
//                   </div>
//                 )}

//                 {/* Metadata */}
//                 <div
//                   style={{
//                     borderTop: "1px solid #334155",
//                     paddingTop: "15px",
//                     display: "flex",
//                     gap: "20px",
//                     color: "#94a3b8",
//                     fontSize: "13px",
//                   }}
//                 >
//                   <span>
//                     <strong>ID:</strong> {question.id}
//                   </span>
//                   <span>
//                     <strong>Grade:</strong> {question.grade}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default QuestionSetViewer;
import React, { useState, useEffect } from "react";
import QuestionEditor from "./QuestionEditor";

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
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchQuestionSet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setId]);

  const fetchQuestionSet = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/admin/question_set/${setId}`, { credentials: "include" });
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
      const res = await fetch(`http://localhost:5000/admin/question/${questionId}`, { method: "DELETE", credentials: "include" });
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
    fetchQuestionSet();
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
          <QuestionEditor mode="add" submoduleCode={questionSet.submodule_code} grade={questionSet.grade} setId={setId} onSave={handleSaveComplete} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {questionSet.questions.map((question, index) => (
          <div key={question.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 12 }}>
            {editingQuestionId === question.id ? (
              <QuestionEditor mode="edit" questionData={question} submoduleCode={questionSet.submodule_code} grade={questionSet.grade} setId={setId} onSave={handleSaveComplete} onCancel={() => setEditingQuestionId(null)} />
            ) : (
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

                    {question.image_path && (
                      <div style={{ marginTop: 8 }}>
                        <img src={`http://localhost:5000/${question.image_path}`} alt="q" style={{ maxWidth: 320, borderRadius: 8, border: "1px solid var(--border)" }} />
                      </div>
                    )}

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
