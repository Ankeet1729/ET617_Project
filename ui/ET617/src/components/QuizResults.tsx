// import React, { useState } from "react";

// interface QuizResult {
//   questionIndex: number;
//   question: string;
//   userAnswer: string;
//   correctAnswer: string;
//   isCorrect: boolean;
//   explanation: string;
//   bloom_level: string;
//   concept: string;
//   type: string;
//   needs_image: boolean;
//   options?: string[];
// }

// interface EvaluationResult {
//   quiz_id: number;
//   totalQuestions: number;
//   correctAnswers: number;
//   percentage: number;
//   gradeLevel: string;
//   results: QuizResult[];
//   submittedAt: string;
// }

// interface QuizResultsProps {
//   evaluationResult: EvaluationResult;
//   onReturnToDashboard: () => void;
// }

// const QuizResults: React.FC<QuizResultsProps> = ({
//   evaluationResult,
//   onReturnToDashboard
// }) => {
//   const [showExplanation, setShowExplanation] = useState<number | null>(null);

//   const toggleExplanation = (questionIndex: number) => {
//     setShowExplanation(showExplanation === questionIndex ? null : questionIndex);
//   };

//   const getGradeColor = (gradeLevel: string) => {
//     switch (gradeLevel) {
//       case "Excellent": return "#28a745";
//       case "Good": return "#17a2b8";
//       case "Satisfactory": return "#ffc107";
//       case "Below Average": return "#fd7e14";
//       case "Needs Improvement": return "#dc3545";
//       default: return "#6c757d";
//     }
//   };

//   return (
//     <div style={{ 
//       fontFamily: "Arial, sans-serif", 
//       maxWidth: "1200px", 
//       margin: "0 auto", 
//       padding: "20px" 
//     }}>
//       {/* Score Summary Card */}
//       <div style={{
//         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//         color: "white",
//         padding: "40px",
//         borderRadius: "15px",
//         marginBottom: "30px",
//         boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//         textAlign: "center"
//       }}>
//         <h1 style={{ margin: "0 0 20px 0", fontSize: "32px" }}>Quiz Results</h1>
//         <div style={{ fontSize: "72px", fontWeight: "bold", marginBottom: "10px" }}>
//           {evaluationResult.percentage}%
//         </div>
//         <div style={{ 
//           fontSize: "24px", 
//           marginBottom: "15px",
//           backgroundColor: "rgba(255,255,255,0.2)",
//           padding: "10px 20px",
//           borderRadius: "8px",
//           display: "inline-block"
//         }}>
//           {evaluationResult.gradeLevel}
//         </div>
//         <p style={{ fontSize: "18px", margin: "15px 0 5px 0", opacity: 0.9 }}>
//           {evaluationResult.correctAnswers} out of {evaluationResult.totalQuestions} questions correct
//         </p>
//         <p style={{ fontSize: "14px", margin: 0, opacity: 0.8 }}>
//           Submitted on {new Date(evaluationResult.submittedAt).toLocaleString()}
//         </p>
//       </div>

//       {/* Detailed Results */}
//       <div style={{ marginBottom: "30px" }}>
//         <h2 style={{ color: "#333", marginBottom: "20px" }}>Question Review</h2>
//         <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
//           {evaluationResult.results.map((result, index) => (
//             <div 
//               key={index}
//               style={{
//                 backgroundColor: "white",
//                 border: `3px solid ${result.isCorrect ? "#28a745" : "#dc3545"}`,
//                 borderRadius: "10px",
//                 padding: "20px",
//                 boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
//               }}
//             >
//               {/* Question Header */}
//               <div style={{ 
//                 display: "flex", 
//                 justifyContent: "space-between", 
//                 alignItems: "center",
//                 marginBottom: "15px",
//                 flexWrap: "wrap",
//                 gap: "10px"
//               }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
//                   <span style={{ 
//                     fontWeight: "bold", 
//                     fontSize: "18px",
//                     color: "#333"
//                   }}>
//                     Question {result.questionIndex}
//                   </span>
//                   <span style={{
//                     backgroundColor: "#667eea",
//                     color: "white",
//                     padding: "4px 12px",
//                     borderRadius: "12px",
//                     fontSize: "12px",
//                     fontWeight: "bold"
//                   }}>
//                     {result.type.replace('_', ' ').toUpperCase()}
//                   </span>
//                   <span style={{
//                     backgroundColor: result.isCorrect ? "#28a745" : "#dc3545",
//                     color: "white",
//                     padding: "4px 12px",
//                     borderRadius: "12px",
//                     fontSize: "12px",
//                     fontWeight: "bold"
//                   }}>
//                     {result.isCorrect ? "✓ Correct" : "✗ Incorrect"}
//                   </span>
//                 </div>
//                 <div style={{ fontSize: "12px", color: "#666" }}>
//                   {result.bloom_level} • {result.concept}
//                   {result.needs_image && " • 📷"}
//                 </div>
//               </div>

//               {/* Question */}
//               <div style={{ 
//                 fontSize: "16px", 
//                 marginBottom: "15px",
//                 color: "#333",
//                 lineHeight: 1.6
//               }}>
//                 {result.question}
//               </div>

//               {/* Answer Comparison */}
//               <div style={{ 
//                 display: "grid", 
//                 gridTemplateColumns: "1fr 1fr", 
//                 gap: "15px",
//                 marginBottom: "15px"
//               }}>
//                 <div style={{
//                   backgroundColor: result.isCorrect ? "#d4edda" : "#f8d7da",
//                   padding: "15px",
//                   borderRadius: "8px",
//                   border: `2px solid ${result.isCorrect ? "#28a745" : "#dc3545"}`
//                 }}>
//                   <div style={{ 
//                     fontWeight: "bold", 
//                     marginBottom: "8px",
//                     color: result.isCorrect ? "#155724" : "#721c24"
//                   }}>
//                     Your Answer:
//                   </div>
//                   <div style={{ 
//                     fontSize: "16px",
//                     color: result.isCorrect ? "#155724" : "#721c24"
//                   }}>
//                     {result.userAnswer}
//                   </div>
//                 </div>
//                 <div style={{
//                   backgroundColor: "#d4edda",
//                   padding: "15px",
//                   borderRadius: "8px",
//                   border: "2px solid #28a745"
//                 }}>
//                   <div style={{ 
//                     fontWeight: "bold", 
//                     marginBottom: "8px",
//                     color: "#155724"
//                   }}>
//                     Correct Answer:
//                   </div>
//                   <div style={{ 
//                     fontSize: "16px",
//                     color: "#155724"
//                   }}>
//                     {result.correctAnswer}
//                   </div>
//                 </div>
//               </div>

//               {/* Options (if multiple choice) */}
//               {result.type === "multiple_choice" && result.options && result.options.length > 0 && (
//                 <div style={{ marginBottom: "15px" }}>
//                   <div style={{ fontSize: "14px", fontWeight: "bold", color: "#333", marginBottom: "8px" }}>
//                     Options:
//                   </div>
//                   <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
//                     {result.options.map((opt, i) => (
//                       <li
//                         key={i}
//                         style={{
//                           backgroundColor:
//                             opt === result.correctAnswer
//                               ? "#d4edda"
//                               : opt === result.userAnswer
//                               ? "#f8d7da"
//                               : "#f8f9fa",
//                           border:
//                             opt === result.correctAnswer
//                               ? "1px solid #c3e6cb"
//                               : opt === result.userAnswer
//                               ? "1px solid #f5c6cb"
//                               : "1px solid #dee2e6",
//                           borderRadius: "6px",
//                           padding: "8px 12px",
//                           marginBottom: "6px",
//                           color:
//                             opt === result.correctAnswer
//                               ? "#155724"
//                               : opt === result.userAnswer
//                               ? "#721c24"
//                               : "#333",
//                           fontWeight:
//                             opt === result.correctAnswer || opt === result.userAnswer
//                               ? "bold"
//                               : "normal",
//                         }}
//                       >
//                         {opt}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {/* Explanation Toggle */}
//               <button
//                 onClick={() => toggleExplanation(result.questionIndex)}
//                 style={{
//                   padding: "10px 20px",
//                   backgroundColor: "#007bff",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                   fontSize: "14px",
//                   marginBottom: showExplanation === result.questionIndex ? "15px" : "0"
//                 }}
//               >
//                 {showExplanation === result.questionIndex ? "Hide" : "Show"} Explanation
//               </button>

//               {/* Explanation */}
//               {showExplanation === result.questionIndex && (
//                 <div style={{
//                   backgroundColor: "#f8f9fa",
//                   padding: "15px",
//                   borderRadius: "8px",
//                   border: "1px solid #dee2e6",
//                   marginTop: "10px"
//                 }}>
//                   <div style={{ fontWeight: "bold", marginBottom: "8px", color: "#333" }}>
//                     Explanation:
//                   </div>
//                   <div style={{ color: "#666", lineHeight: 1.6 }}>
//                     {result.explanation}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Action Button */}
//       <div style={{ 
//         display: "flex", 
//         justifyContent: "center", 
//         gap: "15px",
//         marginTop: "30px" 
//       }}>
//         <button
//           onClick={onReturnToDashboard}
//           style={{
//             padding: "15px 40px",
//             backgroundColor: "#667eea",
//             color: "white",
//             border: "none",
//             borderRadius: "8px",
//             cursor: "pointer",
//             fontSize: "16px",
//             fontWeight: "bold",
//             transition: "all 0.3s ease"
//           }}
//           onMouseOver={(e) => {
//             e.currentTarget.style.backgroundColor = "#5568d3";
//             e.currentTarget.style.transform = "translateY(-2px)";
//           }}
//           onMouseOut={(e) => {
//             e.currentTarget.style.backgroundColor = "#667eea";
//             e.currentTarget.style.transform = "translateY(0)";
//           }}
//         >
//           Back to Dashboard
//         </button>
//       </div>
//     </div>
//   );
// };

// export default QuizResults;
import React, { useState } from "react";

interface QuizResult {
  questionIndex: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  bloom_level: string;
  concept: string;
  type: string;
  needs_image: boolean;
  options?: string[];
}

interface EvaluationResult {
  quiz_id: number;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  gradeLevel: string;
  results: QuizResult[];
  submittedAt: string;
}

interface QuizResultsProps {
  evaluationResult: EvaluationResult;
  onReturnToDashboard: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ evaluationResult, onReturnToDashboard }) => {
  const [showExplanation, setShowExplanation] = useState<number | null>(null);

  const toggleExplanation = (questionIndex: number) =>
    setShowExplanation((cur) => (cur === questionIndex ? null : questionIndex));

  return (
    <div className="container" style={{ padding: "18px 16px 40px", maxWidth: 1100 }}>
      {/* Summary */}
      <section style={{
        background: 'linear-gradient(90deg,var(--primary),var(--primary-dark))',
        color: 'white',
        padding: 28,
        borderRadius: 12,
        textAlign: 'center',
        boxShadow: '0 8px 30px rgba(37,99,235,0.08)',
        marginBottom: 20
      }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Quiz Results</h1>
        <div style={{ fontSize: 56, fontWeight: 800, margin: '10px 0' }}>{evaluationResult.percentage}%</div>
        <div style={{ display: 'inline-block', padding: '8px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.14)', marginBottom: 8 }}>
          {evaluationResult.gradeLevel}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.9)', marginTop: 8 }}>
          {evaluationResult.correctAnswers} out of {evaluationResult.totalQuestions} correct
        </div>
        <div style={{ fontSize: 13, opacity: 0.9, marginTop: 6 }}>
          Submitted on {new Date(evaluationResult.submittedAt).toLocaleString()}
        </div>
      </section>

      {/* Questions list */}
      <section style={{ display: 'grid', gap: 16 }}>
        {evaluationResult.results.map((res) => {
          const correctBg = res.isCorrect ? 'rgba(220,255,235,0.9)' : 'rgba(255,235,238,0.98)';
          const borderColor = res.isCorrect ? 'var(--success)' : 'var(--error)';

          return (
            <article key={res.questionIndex} style={{ background: 'var(--surface)', borderRadius: 10, padding: 14, border: `1px solid var(--border)`, boxShadow: '0 4px 10px rgba(2,6,23,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>Q{res.questionIndex}</div>
                  <div style={{ padding: '6px 10px', borderRadius: 999, background: 'var(--surface-2)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700 }}>
                    {res.type.replace('_', ' ').toUpperCase()}
                  </div>
                  <div style={{ padding: '6px 10px', borderRadius: 999, background: res.isCorrect ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.08)', color: res.isCorrect ? 'var(--success)' : 'var(--error)', fontWeight: 700, fontSize: 12 }}>
                    {res.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </div>
                </div>

                <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                  {res.bloom_level} • {res.concept} {res.needs_image ? '• 📷' : ''}
                </div>
              </div>

              <div style={{ marginTop: 12, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                {res.question}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                <div style={{ borderRadius: 8, padding: 12, background: correctBg, border: `1px solid ${borderColor}` }}>
                  <div style={{ fontWeight: 700, color: res.isCorrect ? 'var(--success)' : 'var(--error)' }}>Your Answer</div>
                  <div style={{ marginTop: 8, color: 'var(--text-primary)' }}>{res.userAnswer}</div>
                </div>

                <div style={{ borderRadius: 8, padding: 12, background: 'rgba(220,255,235,0.95)', border: `1px solid var(--success)` }}>
                  <div style={{ fontWeight: 700, color: 'var(--success)' }}>Correct Answer</div>
                  <div style={{ marginTop: 8, color: 'var(--text-primary)' }}>{res.correctAnswer}</div>
                </div>
              </div>

              {res.options && res.options.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Options</div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {res.options.map((opt, i) => {
                      const isUser = opt === res.userAnswer;
                      const isCorrect = opt === res.correctAnswer;
                      return (
                        <div
                          key={i}
                          style={{
                            padding: 10,
                            borderRadius: 8,
                            border: '1px solid var(--border)',
                            background: isCorrect ? 'rgba(220,255,235,0.9)' : isUser ? 'rgba(255,235,238,0.95)' : 'var(--surface-2)',
                            color: isCorrect ? 'var(--success)' : isUser ? 'var(--error)' : 'var(--text-primary)',
                            fontWeight: isCorrect || isUser ? 700 : 500
                          }}
                        >
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ marginTop: 12 }}>
                <button
                  onClick={() => toggleExplanation(res.questionIndex)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  {showExplanation === res.questionIndex ? 'Hide Explanation' : 'Show Explanation'}
                </button>

                {showExplanation === res.questionIndex && (
                  <div style={{ marginTop: 10, padding: 12, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Explanation</div>
                    <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{res.explanation || 'No explanation provided.'}</div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
        <button
          onClick={onReturnToDashboard}
          style={{
            padding: '12px 28px',
            borderRadius: 10,
            background: 'linear-gradient(90deg,var(--primary),var(--primary-dark))',
            color: 'white',
            border: 'none',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default QuizResults;
