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
      const storedGrade = localStorage.getItem("currentGrade");
      const gradeToSend = storedGrade && storedGrade !== "null" && storedGrade !== "undefined" && storedGrade !== "" ? storedGrade : grade || "8";
  
      // NEW: Get module and set_index from localStorage (saved when quiz was loaded)
      const currentQuizData = localStorage.getItem("currentQuiz");
      let moduleId = quizId; // Default to quizId
      let setIndex = null;
      
      if (currentQuizData) {
        try {
          const parsed = JSON.parse(currentQuizData);
          // Check if we stored module/set info
          if (parsed.moduleId) moduleId = parsed.moduleId;
          if (parsed.set_index) setIndex = parsed.set_index;
        } catch (e) {
          console.warn('Could not parse stored quiz data');
        }
      }
  
      const response = await fetch("http://localhost:5000/api/evaluate_quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          quiz_id: moduleId,
          answers: answers,
          grade: gradeToSend,
          username: localStorage.getItem("currentUser") || username || undefined,
          module: moduleId,
          set_index: setIndex
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setEvaluationResult(result);
        setShowResults(true);
      } else {
        console.error("Error submitting quiz:", response.status, result);
        alert(result?.error ? `Error submitting quiz: ${result.error}` : "Error submitting quiz. Please try again.");
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

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "1400px", margin: "0 auto", padding: "20px", display: "flex", gap: "20px" }}>
      {/* Question Palette Sidebar */}
      <div style={{ width: "200px", backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "10px", position: "sticky", top: "20px", height: "fit-content" }}>
        <h3 style={{ marginTop: 0, color: "#333", fontSize: "16px", marginBottom: "15px" }}>Question Palette</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
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
                fontWeight: "bold",
                fontSize: "14px",
                transition: "all 0.2s"
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Quiz Content */}
      <div style={{ flex: 1 }}>
        <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", padding: "20px", borderRadius: "10px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "24px" }}>{quizName}</h2>
              <p style={{ margin: "5px 0 0 0", opacity: 0.9 }}>Username: {username} | Grade: {grade}</p>
            </div>
            <button
              onClick={onBack}
              style={{
                padding: "10px 20px",
                backgroundColor: "rgba(255,255,255,0.2)",
                border: "2px solid white",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Exit Quiz
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: "20px", backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px", color: "#666" }}>
            <span>Question {currentQuestionIndex + 1} of {allQuestions.length}</span>
            <span>{Math.round(((currentQuestionIndex + 1) / allQuestions.length) * 100)}%</span>
          </div>
          <div style={{ height: "8px", backgroundColor: "#e9ecef", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%`, backgroundColor: "#667eea", transition: "width 0.3s" }} />
          </div>
        </div>

        {/* Question Card */}
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
          <div style={{ marginBottom: "15px" }}>
            <span style={{ backgroundColor: "#667eea", color: "white", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
              {currentQuestion.type.replace('_', ' ').toUpperCase()}
            </span>
            <span style={{ marginLeft: "10px", color: "#999", fontSize: "12px" }}>
              {currentQuestion.bloom_level} • {currentQuestion.concept}
            </span>
          </div>
          <h3 style={{ color: "#333", fontSize: "20px", marginBottom: "25px", lineHeight: 1.6 }}>
            {currentQuestion.question}
          </h3>

          {currentQuestion.type === 'multiple_choice' ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {(currentQuestion as any).options.map((option: string, index: number) => (
                <label
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "15px",
                    backgroundColor: answers[currentQuestion.id] === option ? "#e7f3ff" : "#f8f9fa",
                    border: answers[currentQuestion.id] === option ? "2px solid #667eea" : "2px solid #e9ecef",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                    style={{ marginRight: "10px", width: "18px", height: "18px" }}
                  />
                  <span style={{ fontSize: "16px", color: "#333" }}>{option}</span>
                </label>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "15px" }}>
              {['True', 'False'].map((option) => (
                <label
                  key={option}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    backgroundColor: answers[currentQuestion.id] === option ? "#e7f3ff" : "#f8f9fa",
                    border: answers[currentQuestion.id] === option ? "2px solid #667eea" : "2px solid #e9ecef",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                    style={{ marginRight: "10px", width: "18px", height: "18px" }}
                  />
                  <span style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "15px" }}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            style={{
              padding: "12px 24px",
              backgroundColor: currentQuestionIndex === 0 ? "#e9ecef" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer",
              fontSize: "16px"
            }}
          >
            ← Previous
          </button>

          {currentQuestionIndex < allQuestions.length - 1 ? (
            <button
              onClick={handleNext}
              style={{
                padding: "12px 24px",
                backgroundColor: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={submitQuiz}
              disabled={isSubmitting}
              style={{
                padding: "12px 24px",
                backgroundColor: isSubmitting ? "#6c757d" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "bold"
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
