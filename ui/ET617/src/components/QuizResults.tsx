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
  quizName: string;
  evaluationResult: EvaluationResult;
  onBackToModules: () => void;
  onBackToDashboard: () => void;
  onRetakeQuiz: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ 
  quizName, 
  evaluationResult, 
  onBackToModules, 
  onBackToDashboard, 
  onRetakeQuiz 
}) => {
  const [showExplanation, setShowExplanation] = useState<number | null>(null);

  const toggleExplanation = (questionIndex: number) => {
    setShowExplanation(showExplanation === questionIndex ? null : questionIndex);
  };

  const getGradeColor = (gradeLevel: string) => {
    switch (gradeLevel) {
      case "Excellent": return "#28a745";
      case "Good": return "#17a2b8";
      case "Satisfactory": return "#ffc107";
      case "Below Average": return "#fd7e14";
      case "Needs Improvement": return "#dc3545";
      default: return "#6c757d";
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "30px",
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px"
      }}>
        <h1 style={{ margin: 0, color: "#333" }}>Quiz Results</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={onBackToModules}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            ← Back to Modules
          </button>
          <button 
            onClick={onBackToDashboard}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Score Summary */}
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          marginBottom: "30px",
          textAlign: "center"
        }}>
          <h2 style={{ color: "#333", marginBottom: "20px" }}>{quizName}</h2>
          
          <div style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: getGradeColor(evaluationResult.gradeLevel),
            margin: "20px 0"
          }}>
            {evaluationResult.percentage}%
          </div>
          
          <div style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: getGradeColor(evaluationResult.gradeLevel),
            marginBottom: "10px"
          }}>
            {evaluationResult.gradeLevel}
          </div>
          
          <p style={{ fontSize: "18px", color: "#666", margin: "10px 0" }}>
            {evaluationResult.correctAnswers} out of {evaluationResult.totalQuestions} questions correct
          </p>
          
          <div style={{
            fontSize: "14px",
            color: "#888",
            marginTop: "20px"
          }}>
            Submitted on {new Date(evaluationResult.submittedAt).toLocaleString()}
          </div>
        </div>

        {/* Detailed Results */}
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ color: "#333", marginBottom: "20px" }}>Question Review</h3>
          
          {evaluationResult.results.map((result, index) => (
            <div key={index} style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              marginBottom: "20px"
            }}>
              {/* Question Header */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px"
                }}>
                  <span style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#333"
                  }}>
                    Question {result.questionIndex}
                  </span>
                  <span style={{
                    padding: "4px 8px",
                    backgroundColor: result.type === 'multiple_choice' ? "#e3f2fd" : "#f3e5f5",
                    color: result.type === 'multiple_choice' ? "#1976d2" : "#7b1fa2",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}>
                    {result.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <span style={{
                    padding: "4px 8px",
                    backgroundColor: result.isCorrect ? "#d4edda" : "#f8d7da",
                    color: result.isCorrect ? "#155724" : "#721c24",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}>
                    {result.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                </div>
                
                <div style={{
                  fontSize: "12px",
                  color: "#666"
                }}>
                  {result.bloom_level} • {result.concept}
                  {result.needs_image && " • 📷 Needs Image"}
                </div>
              </div>

              {/* Question */}
              <div style={{
                fontSize: "16px",
                color: "#000000",
                marginBottom: "15px",
                lineHeight: "1.4"
              }}>
                {result.question}
              </div>

              {/* Answer Comparison */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "15px"
              }}>
                <div style={{
                  padding: "10px 15px",
                  backgroundColor: "#f8d7da",
                  borderRadius: "8px",
                  border: "1px solid #f5c6cb"
                }}>
                  <div style={{ fontSize: "12px", color: "#721c24", fontWeight: "bold", marginBottom: "5px" }}>
                    Your Answer:
                  </div>
                  <div style={{ fontSize: "14px", color: "#721c24" }}>
                    {result.userAnswer}
                  </div>
                </div>
                
                <div style={{
                  padding: "10px 15px",
                  backgroundColor: "#d4edda",
                  borderRadius: "8px",
                  border: "1px solid #c3e6cb"
                }}>
                  <div style={{ fontSize: "12px", color: "#155724", fontWeight: "bold", marginBottom: "5px" }}>
                    Correct Answer:
                  </div>
                  <div style={{ fontSize: "14px", color: "#155724" }}>
                    {result.correctAnswer}
                  </div>
                </div>
              </div>

              {/* Explanation Toggle */}
              <button
                onClick={() => toggleExplanation(result.questionIndex)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  marginBottom: "10px"
                }}
              >
                {showExplanation === result.questionIndex ? "Hide" : "Show"} Explanation
              </button>

              {/* Explanation */}
              {showExplanation === result.questionIndex && (
                <div style={{
                  padding: "15px",
                  backgroundColor: "#e9ecef",
                  borderRadius: "8px",
                  border: "1px solid #dee2e6",
                  marginTop: "10px"
                }}>
                  <div style={{ fontSize: "12px", color: "#495057", fontWeight: "bold", marginBottom: "5px" }}>
                    Explanation:
                  </div>
                  <div style={{ fontSize: "14px", color: "#495057", lineHeight: "1.4" }}>
                    {result.explanation}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "30px"
        }}>
          <button
            onClick={onRetakeQuiz}
            style={{
              padding: "12px 24px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
