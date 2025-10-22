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

const QuizResults: React.FC<QuizResultsProps> = ({
  evaluationResult,
  onReturnToDashboard
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
    <div style={{ 
      fontFamily: "Arial, sans-serif", 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "20px" 
    }}>
      {/* Score Summary Card */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "40px",
        borderRadius: "15px",
        marginBottom: "30px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        <h1 style={{ margin: "0 0 20px 0", fontSize: "32px" }}>Quiz Results</h1>
        <div style={{ fontSize: "72px", fontWeight: "bold", marginBottom: "10px" }}>
          {evaluationResult.percentage}%
        </div>
        <div style={{ 
          fontSize: "24px", 
          marginBottom: "15px",
          backgroundColor: "rgba(255,255,255,0.2)",
          padding: "10px 20px",
          borderRadius: "8px",
          display: "inline-block"
        }}>
          {evaluationResult.gradeLevel}
        </div>
        <p style={{ fontSize: "18px", margin: "15px 0 5px 0", opacity: 0.9 }}>
          {evaluationResult.correctAnswers} out of {evaluationResult.totalQuestions} questions correct
        </p>
        <p style={{ fontSize: "14px", margin: 0, opacity: 0.8 }}>
          Submitted on {new Date(evaluationResult.submittedAt).toLocaleString()}
        </p>
      </div>

      {/* Detailed Results */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#333", marginBottom: "20px" }}>Question Review</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {evaluationResult.results.map((result, index) => (
            <div 
              key={index}
              style={{
                backgroundColor: "white",
                border: `3px solid ${result.isCorrect ? "#28a745" : "#dc3545"}`,
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              {/* Question Header */}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: "15px",
                flexWrap: "wrap",
                gap: "10px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <span style={{ 
                    fontWeight: "bold", 
                    fontSize: "18px",
                    color: "#333"
                  }}>
                    Question {result.questionIndex}
                  </span>
                  <span style={{
                    backgroundColor: "#667eea",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}>
                    {result.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <span style={{
                    backgroundColor: result.isCorrect ? "#28a745" : "#dc3545",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}>
                    {result.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {result.bloom_level} • {result.concept}
                  {result.needs_image && " • 📷"}
                </div>
              </div>

              {/* Question */}
              <div style={{ 
                fontSize: "16px", 
                marginBottom: "15px",
                color: "#333",
                lineHeight: 1.6
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
                  backgroundColor: result.isCorrect ? "#d4edda" : "#f8d7da",
                  padding: "15px",
                  borderRadius: "8px",
                  border: `2px solid ${result.isCorrect ? "#28a745" : "#dc3545"}`
                }}>
                  <div style={{ 
                    fontWeight: "bold", 
                    marginBottom: "8px",
                    color: result.isCorrect ? "#155724" : "#721c24"
                  }}>
                    Your Answer:
                  </div>
                  <div style={{ 
                    fontSize: "16px",
                    color: result.isCorrect ? "#155724" : "#721c24"
                  }}>
                    {result.userAnswer}
                  </div>
                </div>
                <div style={{
                  backgroundColor: "#d4edda",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "2px solid #28a745"
                }}>
                  <div style={{ 
                    fontWeight: "bold", 
                    marginBottom: "8px",
                    color: "#155724"
                  }}>
                    Correct Answer:
                  </div>
                  <div style={{ 
                    fontSize: "16px",
                    color: "#155724"
                  }}>
                    {result.correctAnswer}
                  </div>
                </div>
              </div>

              {/* Options (if multiple choice) */}
              {result.type === "multiple_choice" && result.options && result.options.length > 0 && (
                <div style={{ marginBottom: "15px" }}>
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: "#333", marginBottom: "8px" }}>
                    Options:
                  </div>
                  <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                    {result.options.map((opt, i) => (
                      <li
                        key={i}
                        style={{
                          backgroundColor:
                            opt === result.correctAnswer
                              ? "#d4edda"
                              : opt === result.userAnswer
                              ? "#f8d7da"
                              : "#f8f9fa",
                          border:
                            opt === result.correctAnswer
                              ? "1px solid #c3e6cb"
                              : opt === result.userAnswer
                              ? "1px solid #f5c6cb"
                              : "1px solid #dee2e6",
                          borderRadius: "6px",
                          padding: "8px 12px",
                          marginBottom: "6px",
                          color:
                            opt === result.correctAnswer
                              ? "#155724"
                              : opt === result.userAnswer
                              ? "#721c24"
                              : "#333",
                          fontWeight:
                            opt === result.correctAnswer || opt === result.userAnswer
                              ? "bold"
                              : "normal",
                        }}
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Explanation Toggle */}
              <button
                onClick={() => toggleExplanation(result.questionIndex)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  marginBottom: showExplanation === result.questionIndex ? "15px" : "0"
                }}
              >
                {showExplanation === result.questionIndex ? "Hide" : "Show"} Explanation
              </button>

              {/* Explanation */}
              {showExplanation === result.questionIndex && (
                <div style={{
                  backgroundColor: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #dee2e6",
                  marginTop: "10px"
                }}>
                  <div style={{ fontWeight: "bold", marginBottom: "8px", color: "#333" }}>
                    Explanation:
                  </div>
                  <div style={{ color: "#666", lineHeight: 1.6 }}>
                    {result.explanation}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: "15px",
        marginTop: "30px" 
      }}>
        <button
          onClick={onReturnToDashboard}
          style={{
            padding: "15px 40px",
            backgroundColor: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "all 0.3s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#5568d3";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#667eea";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default QuizResults;
