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
  options?: string[] | Record<string, string>;
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

  // Helper function to get option content
  const getOptionContent = (options: string[] | Record<string, string> | undefined, key: string): string => {
    if (!options) return key;
    
    // If options is an object (like {"A": "content", "B": "content"})
    if (typeof options === 'object' && !Array.isArray(options)) {
      return options[key] || key;
    }
    
    // If options is an array or for True/False
    return key;
  };

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
                  <div style={{ marginTop: 8, color: 'var(--text-primary)' }}>
                    {res.userAnswer === "Not answered" ? (
                      <span>{res.userAnswer}</span>
                    ) : res.type === 'MCQ' && res.options && typeof res.options === 'object' && !Array.isArray(res.options) ? (
                      <span>
                        <strong>{res.userAnswer}:</strong> {getOptionContent(res.options, res.userAnswer)}
                      </span>
                    ) : (
                      <span>{res.userAnswer}</span>
                    )}
                  </div>
                </div>

                <div style={{ borderRadius: 8, padding: 12, background: 'rgba(220,255,235,0.95)', border: `1px solid var(--success)` }}>
                  <div style={{ fontWeight: 700, color: 'var(--success)' }}>Correct Answer</div>
                  <div style={{ marginTop: 8, color: 'var(--text-primary)' }}>
                    {res.type === 'MCQ' && res.options && typeof res.options === 'object' && !Array.isArray(res.options) ? (
                      <span>
                        <strong>{res.correctAnswer}:</strong> {getOptionContent(res.options, res.correctAnswer)}
                      </span>
                    ) : (
                      <span>{res.correctAnswer}</span>
                    )}
                  </div>
                </div>
              </div>

              {res.options && ((Array.isArray(res.options) && res.options.length > 0) || (typeof res.options === 'object' && Object.keys(res.options).length > 0)) && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Options</div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {Array.isArray(res.options) ? (
                      res.options.map((opt, i) => {
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
                      })
                    ) : (
                      Object.entries(res.options).map(([key, value]) => {
                        const isUser = key === res.userAnswer;
                        const isCorrect = key === res.correctAnswer;
                        return (
                          <div
                            key={key}
                            style={{
                              padding: 10,
                              borderRadius: 8,
                              border: '1px solid var(--border)',
                              background: isCorrect ? 'rgba(220,255,235,0.9)' : isUser ? 'rgba(255,235,238,0.95)' : 'var(--surface-2)',
                              color: isCorrect ? 'var(--success)' : isUser ? 'var(--error)' : 'var(--text-primary)',
                              fontWeight: isCorrect || isUser ? 700 : 500
                            }}
                          >
                            <strong>{key}:</strong> {value}
                          </div>
                        );
                      })
                    )}
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
