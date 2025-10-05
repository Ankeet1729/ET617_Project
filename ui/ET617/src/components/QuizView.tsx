import React, { useState } from "react";
import QuizResults from "./QuizResults";

interface MultipleChoiceQuestion {
  question: string;
  options: string[];
  answer: string;
  bloom_level: string;
  concept: string;
  needs_image: boolean;
  grade: number;
}

interface TrueFalseQuestion {
  question: string;
  answer: string;
  bloom_level: string;
  concept: string;
  needs_image: boolean;
  grade: number;
}

interface QuizData {
  multiple_choice: MultipleChoiceQuestion[];
  true_false: TrueFalseQuestion[];
}

interface QuizViewProps {
  quizName: string;
  quizData: QuizData;
  quizId: number;
  onBackToModules: () => void;
  onBackToDashboard: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ 
  quizName, 
  quizData, 
  quizId,
  onBackToModules, 
  onBackToDashboard 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allQuestions = [
    ...quizData.multiple_choice.map((q, i) => ({ ...q, type: 'multiple_choice', id: `mc_${i}` })),
    ...quizData.true_false.map((q, i) => ({ ...q, type: 'true_false', id: `tf_${i}` }))
  ];

  const currentQuestion = allQuestions[currentQuestionIndex];

  const handleAnswerSelect = (questionId: string, answer: string) => {
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
    try {
      const response = await fetch("http://localhost:5001/api/evaluate_quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quiz_id: quizId,
          answers: answers,
          grade: "8"
        }),
        credentials: "include"
      });

      const result = await response.json();
      
      if (response.ok) {
        setEvaluationResult(result);
        setShowResults(true);
      } else {
        console.error("Error submitting quiz:", result.error);
        alert("Error submitting quiz. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Error submitting quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResults && evaluationResult) {
    return (
      <QuizResults
        quizName={quizName}
        evaluationResult={evaluationResult}
        onBackToModules={onBackToModules}
        onBackToDashboard={onBackToDashboard}
        onRetakeQuiz={() => {
          setShowResults(false);
          setEvaluationResult(null);
          setCurrentQuestionIndex(0);
          setAnswers({});
        }}
      />
    );
  }

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
        <h1 style={{ margin: 0, color: "#333" }}>{quizName}</h1>
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
      </header>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* Question Palette */}
        <div style={{
          width: "200px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          padding: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ fontSize: "16px", marginBottom: "10px", color: "#333" }}>Question Palette</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {allQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => handleJumpToQuestion(index)}
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: index === currentQuestionIndex ? "#007bff" : answers[allQuestions[index].id] ? "#28a745" : "#e9ecef",
                  color: index === currentQuestionIndex ? "white" : "#333",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Main Quiz Content */}
        <div style={{ flex: 1 }}>
          {/* Progress Bar */}
          <div style={{ marginBottom: "30px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px"
            }}>
              <span style={{ fontSize: "14px", color: "#666" }}>
                Question {currentQuestionIndex + 1} of {allQuestions.length}
              </span>
              <span style={{ fontSize: "14px", color: "#666" }}>
                {Math.round(((currentQuestionIndex + 1) / allQuestions.length) * 100)}%
              </span>
            </div>
            <div style={{
              width: "100%",
              height: "8px",
              backgroundColor: "#e9ecef",
              borderRadius: "4px",
              overflow: "hidden"
            }}>
              <div style={{
                width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%`,
                height: "100%",
                backgroundColor: "#007bff",
                transition: "width 0.3s ease"
              }} />
            </div>
          </div>

          {/* Question Card */}
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            marginBottom: "20px"
          }}>
            <div style={{
              display: "inline-block",
              padding: "4px 12px",
              backgroundColor: currentQuestion.type === 'multiple_choice' ? "#e3f2fd" : "#f3e5f5",
              color: currentQuestion.type === 'multiple_choice' ? "#1976d2" : "#7b1fa2",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "15px"
            }}>
              {currentQuestion.type.replace('_', ' ').toUpperCase()}
            </div>

            <h2 style={{ 
              color: "#000000", 
              marginBottom: "20px",
              lineHeight: "1.4"
            }}>
              {currentQuestion.question}
            </h2>

            {currentQuestion.type === 'multiple_choice' ? (
              <div style={{ marginBottom: "20px" }}>
                {(currentQuestion as any).options.map((option: string, index: number) => (
                  <label key={index} style={{
                    display: "block",
                    padding: "12px 16px",
                    margin: "8px 0",
                    backgroundColor: answers[currentQuestion.id] === option ? "#e3f2fd" : "#f8f9fa",
                    border: `2px solid ${answers[currentQuestion.id] === option ? "#1976d2" : "#e9ecef"}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    color: "#000000"
                  }}>
                    <input
                      type="radio"
                      name={`question_${currentQuestion.id}`}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                      style={{ marginRight: "10px" }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            ) : (
              <div style={{ marginBottom: "20px" }}>
                {['True', 'False'].map((option) => (
                  <label key={option} style={{
                    display: "block",
                    padding: "12px 16px",
                    margin: "8px 0",
                    backgroundColor: answers[currentQuestion.id] === option ? "#f3e5f5" : "#f8f9fa",
                    border: `2px solid ${answers[currentQuestion.id] === option ? "#7b1fa2" : "#e9ecef"}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    color: "#000000"
                  }}>
                    <input
                      type="radio"
                      name={`question_${currentQuestion.id}`}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                      style={{ marginRight: "10px" }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              style={{
                padding: "12px 24px",
                backgroundColor: currentQuestionIndex === 0 ? "#e9ecef" : "#6c757d",
                color: currentQuestionIndex === 0 ? "#6c757d" : "white",
                border: "none",
                borderRadius: "4px",
                cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer",
                fontSize: "16px"
              }}
            >
              ← Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id] || isSubmitting}
              style={{
                padding: "12px 24px",
                backgroundColor: (!answers[currentQuestion.id] || isSubmitting) ? "#e9ecef" : "#007bff",
                color: (!answers[currentQuestion.id] || isSubmitting) ? "#6c757d" : "white",
                border: "none",
                borderRadius: "4px",
                cursor: (!answers[currentQuestion.id] || isSubmitting) ? "not-allowed" : "pointer",
                fontSize: "16px"
              }}
            >
              Next →
            </button>

            <button
              onClick={submitQuiz}
              disabled={isSubmitting}
              style={{
                padding: "12px 24px",
                backgroundColor: isSubmitting ? "#e9ecef" : "#28a745",
                color: isSubmitting ? "#6c757d" : "white",
                border: "none",
                borderRadius: "4px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "16px"
              }}
            >
              {isSubmitting ? "Submitting..." : "Finish Quiz"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizView;
