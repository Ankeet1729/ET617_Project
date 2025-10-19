import React, { useState } from "react";
import QuizResults from "./QuizResults";

interface Question {
  id: number;
  question_text: string;
  question_type: string;
  options: any;
  bloom_level: string;
  concept: string;
  image_path: string | null;
}

interface QuizViewProps {
  quizName: string;
  quizData: {
    set_id: number;
    set_name: string;
    questions: Question[];
  };
  quizId: number;
  username: string;
  grade: string;
  onBack: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({
  quizName,
  quizData,
  quizId,
  username,
  grade,
  onBack
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("🔍 [QuizView] Received quiz data:", quizData);

  // Use the questions array directly from the new API format
  const allQuestions = quizData.questions || [];
  const currentQuestion = allQuestions[currentQuestionIndex];

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    console.log("🔍 [QuizView] Submitting quiz with answers:", answers);
    
    try {
      const response = await fetch("http://localhost:5000/api/evaluate_quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          question_set_id: quizData.set_id,
          answers: answers,
          grade: grade,
          username: username
        }),
      });

      const result = await response.json();
      console.log("✅ [QuizView] Quiz evaluation result:", result);

      if (response.ok) {
        setEvaluationResult(result);
        setShowResults(true);
      } else {
        console.error("❌ [QuizView] Error submitting quiz:", result);
        alert(result?.error || "Error submitting quiz. Please try again.");
      }
    } catch (error) {
      console.error("❌ [QuizView] Error submitting quiz:", error);
      alert("Error submitting quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResults && evaluationResult) {
    return (
      <QuizResults
        evaluationResult={evaluationResult}
        onReturnToDashboard={() => {
          setShowResults(false);
          setEvaluationResult(null);
          setCurrentQuestionIndex(0);
          setAnswers({});
          onBack();
        }}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <div style={{ padding: "20px", color: "#f1f5f9" }}>
        <p>Loading quiz...</p>
      </div>
    );
  }

  // Parse options if it's a JSON string
  let questionOptions = currentQuestion.options;
  if (typeof questionOptions === 'string') {
    try {
      questionOptions = JSON.parse(questionOptions);
    } catch (e) {
      console.error("Failed to parse options:", questionOptions);
      questionOptions = {};
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0f172a" }}>
      {/* Question Palette Sidebar */}
      <div
        style={{
          width: "200px",
          backgroundColor: "#1e293b",
          padding: "20px",
          borderRight: "2px solid #334155",
        }}
      >
        <h3 style={{ color: "#f1f5f9", marginBottom: "20px", fontSize: "16px" }}>
          Question Palette
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
          }}
        >
          {allQuestions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => handleJumpToQuestion(index)}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor:
                  index === currentQuestionIndex
                    ? "#6366f1"
                    : answers[q.id]
                    ? "#10b981"
                    : "#334155",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
                transition: "all 0.2s",
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Quiz Content */}
      <div style={{ flex: 1, padding: "30px" }}>
        {/* Header */}
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "25px",
            borderRadius: "12px",
            marginBottom: "25px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ color: "#f1f5f9", margin: "0 0 10px 0", fontSize: "24px" }}>
              {quizName}
            </h1>
            <p style={{ color: "#94a3b8", margin: 0, fontSize: "14px" }}>
              Username: {username} | Grade: {grade}
            </p>
          </div>
          <button
            onClick={onBack}
            style={{
              padding: "12px 24px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Exit Quiz
          </button>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "15px 25px",
            borderRadius: "12px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span style={{ color: "#cbd5e1", fontSize: "14px" }}>
              Question {currentQuestionIndex + 1} of {allQuestions.length}
            </span>
            <span style={{ color: "#6366f1", fontSize: "14px", fontWeight: "bold" }}>
              {Math.round(((currentQuestionIndex + 1) / allQuestions.length) * 100)}%
            </span>
          </div>
          <div
            style={{
              height: "8px",
              backgroundColor: "#334155",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%`,
                backgroundColor: "#6366f1",
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "30px",
            borderRadius: "12px",
            marginBottom: "25px",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <span
              style={{
                backgroundColor: "#6366f1",
                color: "white",
                padding: "6px 16px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              {currentQuestion.question_type}
            </span>
            <span style={{ color: "#94a3b8", fontSize: "14px" }}>
              {currentQuestion.bloom_level} • {currentQuestion.concept}
            </span>
          </div>

          <h2
            style={{
              color: "#f1f5f9",
              fontSize: "20px",
              marginBottom: "25px",
              lineHeight: "1.6",
            }}
          >
            {currentQuestion.question_text}
          </h2>

          {currentQuestion.image_path && (
            <img
              src={`http://localhost:5000/${currentQuestion.image_path}`}
              alt="Question"
              style={{
                maxWidth: "400px",
                borderRadius: "8px",
                marginBottom: "25px",
              }}
            />
          )}

          {/* Options */}
          <div style={{ display: "grid", gap: "12px" }}>
            {currentQuestion.question_type === "MCQ" ? (
              Object.entries(questionOptions).map(([key, value]) => (
                <label
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor:
                      answers[currentQuestion.id] === key ? "#6366f120" : "#0f172a",
                    border: `2px solid ${
                      answers[currentQuestion.id] === key ? "#6366f1" : "#334155"
                    }`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    if (answers[currentQuestion.id] !== key) {
                      e.currentTarget.style.borderColor = "#475569";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (answers[currentQuestion.id] !== key) {
                      e.currentTarget.style.borderColor = "#334155";
                    }
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={key}
                    checked={answers[currentQuestion.id] === key}
                    onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                    style={{ marginRight: "12px", width: "20px", height: "20px" }}
                  />
                  <span style={{ color: "#f1f5f9", fontSize: "16px" }}>
                    <strong>{key}:</strong> {String(value)}
                  </span>
                </label>
              ))
            ) : (
              ["True", "False"].map((option) => (
                <label
                  key={option}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor:
                      answers[currentQuestion.id] === option ? "#6366f120" : "#0f172a",
                    border: `2px solid ${
                      answers[currentQuestion.id] === option ? "#6366f1" : "#334155"
                    }`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                    style={{ marginRight: "12px", width: "20px", height: "20px" }}
                  />
                  <span style={{ color: "#f1f5f9", fontSize: "16px" }}>{option}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            style={{
              padding: "14px 28px",
              backgroundColor: currentQuestionIndex === 0 ? "#334155" : "#475569",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            ← Previous
          </button>

          {currentQuestionIndex < allQuestions.length - 1 ? (
            <button
              onClick={handleNext}
              style={{
                padding: "14px 28px",
                backgroundColor: "#6366f1",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={submitQuiz}
              disabled={isSubmitting}
              style={{
                padding: "14px 28px",
                backgroundColor: isSubmitting ? "#64748b" : "#10b981",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {isSubmitting ? "Submitting..." : "Finish Quiz"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizView;
