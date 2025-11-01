import React, { useState, useEffect } from "react";
import QuizResults from "./QuizResults";

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
  bloom_level: string;
  concept: string;
  image_path: string | null;
  scratch_text?: string | null; // <-- ADDED
}
// --- END UPDATED ---

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

const QuizView: React.FC<QuizViewProps> = ({ quizName, quizData, quizId, username, grade, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allQuestions = quizData.questions || [];
  const currentQuestion = allQuestions[currentQuestionIndex];

  // --- *** UPDATED *** useEffect for Scratchblocks ---
  useEffect(() => {
    if (currentQuestion && currentQuestion.scratch_text) {
      
      const elementId = `quiz-scratch-block-${currentQuestion.id}`;
      
      // Use a timeout to ensure React has rendered the element
      setTimeout(() => {
        const targetElement = document.getElementById(elementId);

        if (targetElement) {
          // 1. Prepare the element with the raw text
          targetElement.innerHTML = '';
          targetElement.textContent = currentQuestion.scratch_text;

          // 2. Define the *selector string*
          const selector = `#${elementId}`; // e.g., "#quiz-scratch-block-123"

          // 3. Render using the selector string
          try {
            scratchblocks.renderMatching(selector, {
              style: 'scratch3',
              scale: 0.85,
            });
          } catch (renderError) {
            console.error("Scratchblocks rendering failed:", renderError);
            targetElement.textContent = `[Error rendering visual]`;
          }
        }
      }, 0);
    }
  }, [currentQuestion]); // Dependency: Re-run when currentQuestion changes
  // --- *** END UPDATED *** ---

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) setCurrentQuestionIndex((p) => p + 1);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((p) => p - 1);
  };

  const handleJumpToQuestion = (index: number) => setCurrentQuestionIndex(index);

  const submitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/evaluate_quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          question_set_id: quizData.set_id,
          answers,
          grade,
          username
        })
      });

      const result = await response.json();
      if (response.ok) {
        setEvaluationResult(result);
        setShowResults(true);
      } else {
        alert(result?.error || "Error submitting quiz");
      }
    } catch (err) {
      console.error(err);
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
      <div style={{ padding: 28 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading quiz...
        </div>
      </div>
    );
  }

  // parse options safely
  let questionOptions = currentQuestion.options;
  if (typeof questionOptions === 'string') {
    try { questionOptions = JSON.parse(questionOptions); } catch (e) { questionOptions = {}; }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,var(--background), #f8fbff)', padding: 18 }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 18, alignItems: 'start' }}>
        {/* Sidebar palette (collapses on small screens) */}
        <aside style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          padding: 12,
          borderRadius: 10,
          height: 'fit-content'
        }}>
          <h3 style={{ margin: 0, marginBottom: 8 }}>Questions</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10
          }}>
            {allQuestions.map((q, idx) => {
              const selected = answers[q.id];
              const isActive = idx === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => handleJumpToQuestion(idx)}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: isActive ? 'var(--primary)' : selected ? 'var(--secondary)' : 'var(--surface-2)',
                    color: isActive || selected ? 'white' : 'var(--text-primary)',
                    cursor: 'pointer',
                    fontWeight: 800
                  }}
                  aria-label={`Go to question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <main style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 18, borderRadius: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ margin: 0 }}>{quizName}</h1>
              <div style={{ color: 'var(--text-secondary)', marginTop: 6 }}>{username} • Grade {grade}</div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={onBack} className="secondary">Exit Quiz</button>
            </div>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ color: 'var(--text-secondary)' }}>Question {currentQuestionIndex + 1} of {allQuestions.length}</div>
              <div style={{ color: 'var(--primary)', fontWeight: 800 }}>{Math.round(((currentQuestionIndex + 1) / allQuestions.length) * 100)}%</div>
            </div>
            <div style={{ height: 10, background: 'var(--surface-2)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%`, height: '100%', background: 'var(--primary)', transition: 'width .3s' }} />
            </div>
          </div>

          {/* Question card */}
          <article style={{ padding: 14, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ padding: '6px 12px', background: 'var(--primary)', color: 'white', borderRadius: 999, fontWeight: 800 }}>{currentQuestion.question_type}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{currentQuestion.bloom_level} • {currentQuestion.concept}</div>
              </div>
            </div>

            <h2 style={{ marginTop: 0, color: 'var(--text-primary)', lineHeight: 1.6 }}>{currentQuestion.question_text}</h2>

            {/* --- UPDATED VISUALS SECTION --- */}
            <div className="question-visual-container" style={{ margin: '16px 0', minHeight: '50px', display: 'flex', justifyContent: 'center' }}>
              
              {currentQuestion.image_path && (
                <img 
                  src={`${API_BASE_URL}${currentQuestion.image_path}`}
                  alt="Question visual" 
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: 8, marginBottom: 12 }} 
                />
              )}
              
              {currentQuestion.scratch_text && !currentQuestion.image_path && (
                <pre 
                  // The unique ID for the useEffect to find
                  id={`quiz-scratch-block-${currentQuestion.id}`} 
                  className="blocks"
                >
                  {currentQuestion.scratch_text}
                </pre>
              )}
            </div>
            {/* --- END VISUALS SECTION --- */}

            <div style={{ display: 'grid', gap: 10 }}>
              {currentQuestion.question_type === "MCQ" && questionOptions && Object.entries(questionOptions).map(([key, value]) => {
                const selected = answers[currentQuestion.id] === key;
                return (
                  <label key={key} style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 8,
                    border: `1px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                    background: selected ? 'rgba(37,99,235,0.06)' : 'transparent',
                    cursor: 'pointer'
                  }}>
                    <input type="radio" name={`q-${currentQuestion.id}`} value={key} checked={selected} onChange={() => handleAnswerSelect(currentQuestion.id, key)} />
                    <div style={{ color: 'var(--text-primary)' }}><strong>{key}:</strong> {String(value)}</div>
                  </label>
                );
              })}

              {currentQuestion.question_type !== "MCQ" && (["True", "False"].map(opt => {
                const selected = answers[currentQuestion.id] === opt;
                return (
                  <label key={opt} style={{
                    display: 'flex', gap: 12, alignItems: 'center',
                    padding: 12, borderRadius: 8,
                    border: `1px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                    background: selected ? 'rgba(37,99,235,0.06)' : 'transparent',
                    cursor: 'pointer'
                  }}>
                    <input type="radio" name={`q-${currentQuestion.id}`} value={opt} checked={selected} onChange={() => handleAnswerSelect(currentQuestion.id, opt)} />
                    <div style={{ color: 'var(--text-primary)' }}>{opt}</div>
                  </label>
                );
              }))}
            </div>
          </article>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            <div>
              <button onClick={handlePrevious} className="secondary" disabled={currentQuestionIndex === 0} style={{ opacity: currentQuestionIndex === 0 ? 0.6 : 1 }}>
                ← Previous
              </button>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {currentQuestionIndex < allQuestions.length - 1 ? (
                <button onClick={handleNext} style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--primary)', color: 'white', fontWeight: 800 }}>Next →</button>
              ) : (
                <button onClick={submitQuiz} disabled={isSubmitting} style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--secondary)', color: 'white', fontWeight: 800 }}>
                  {isSubmitting ? 'Submitting...' : 'Finish Quiz'}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Small screens: stack layout */}
      <style>{`
        @media (max-width: 880px) {
          .container { padding-left: 12px; padding-right: 12px; }
          .container[style] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default QuizView;