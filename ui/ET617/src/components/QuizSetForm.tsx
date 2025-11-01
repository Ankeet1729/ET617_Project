import React, { useState } from "react";

const API_BASE_URL = import.meta.env.BACKEND_URL || "http://localhost:5000";

interface QuizSetFormProps {
  type: 'ai' | 'manual';
  grade: number;
  module: number;
  onBack: () => void;
  onSuccess: (newSet: any) => void;
}

const QuizSetForm: React.FC<QuizSetFormProps> = ({
  type,
  grade,
  module,
  onBack,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'mcq' as 'mcq' | 'tf',
    question: '',
    options: ['', '', '', ''],
    answer: '',
    explanation: '',
    bloom_level: 'Remember',
    concept: ''
  });
  const [questions, setQuestions] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const bloomLevels = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert('Please enter a question.');
      return;
    }
    if (currentQuestion.type === 'mcq') {
      const filledOptions = currentQuestion.options.filter(opt => opt.trim());
      if (filledOptions.length < 2) {
        alert('Please enter at least 2 options for MCQ.');
        return;
      }
      if (!currentQuestion.answer.trim()) {
        alert('Please select the correct answer.');
        return;
      }
    } else {
      if (!currentQuestion.answer) {
        alert('Please select True or False.');
        return;
      }
    }

    const newQ = {
      ...currentQuestion,
      grade,
      image_path: null
    };
    setQuestions(prev => [...prev, newQ]);

    setCurrentQuestion({
      type: 'mcq',
      question: '',
      options: ['', '', '', ''],
      answer: '',
      explanation: '',
      bloom_level: 'Remember',
      concept: ''
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleSubmit = async () => {
    if (type === 'manual' && questions.length === 0) {
      alert('Please add at least one question before creating the set.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('grade', grade.toString());
    formData.append('module', module.toString());
    formData.append('type', type);
    if (type === 'manual') formData.append('questions', JSON.stringify(questions));
    files.forEach(file => formData.append('images', file));

    try {
      const res = await fetch(`${API_BASE_URL}/admin/create_quiz_set`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        alert(`✅ Quiz set ${parseFloat(data.set_index).toFixed(1)} created successfully with ${data.questions_count} questions!`);
        onSuccess({ set_index: data.set_index });
        onBack();
      } else {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        alert(`❌ Error: ${err.error || 'Failed to create set'}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('❌ Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (type === 'ai') {
    return (
      <div className="quizset-card">
        <h3 className="section-title">🤖 AI Generate Quiz Set</h3>
        <p className="muted">
          This will automatically generate a new quiz set (7 MCQ + 3 True/False) for <strong>Grade {grade}, Module {module}</strong>.
        </p>

        <div className="info-box">
          <p>✨ Tailored to cognitive level of grade {grade}</p>
          <p>📚 Based on module video transcripts</p>
          <p>🎯 Distributed across Bloom's levels</p>
        </div>

        <div className="form-actions">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary"
            aria-busy={loading}
          >
            {loading ? '⏳ Generating...' : '🚀 Generate with AI'}
          </button>
          <button onClick={onBack} className="btn btn-secondary" disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Manual
  return (
    <div className="quizset-card">
      <button className="back-inline" onClick={onBack} disabled={loading} aria-label="Back to sets">← Back to Sets</button>
      <h3 className="section-title">✏️ Manual Quiz Set — Grade {grade}, Module {module}</h3>

      <div className="quiz-form">
        <div className="panel">
          <h4>Add Question #{questions.length + 1}</h4>

          <label className="label">Question Type</label>
          <select
            value={currentQuestion.type}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value as 'mcq' | 'tf' })}
            disabled={loading}
            className="form-select"
          >
            <option value="mcq">Multiple Choice (MCQ)</option>
            <option value="tf">True/False</option>
          </select>

          <label className="label">Question Text *</label>
          <textarea
            placeholder="Enter the question here..."
            value={currentQuestion.question}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
            rows={3}
            disabled={loading}
            className="form-input"
          />

          {currentQuestion.type === 'mcq' && (
            <>
              <label className="label">Options (at least 2 required)</label>
              <div className="options-grid">
                {currentQuestion.options.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...currentQuestion.options];
                      newOpts[i] = e.target.value;
                      setCurrentQuestion({ ...currentQuestion, options: newOpts });
                    }}
                    disabled={loading}
                    className="form-input"
                  />
                ))}
              </div>
            </>
          )}

          <label className="label">Correct Answer *</label>
          {currentQuestion.type === 'mcq' ? (
            <select
              value={currentQuestion.answer}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, answer: e.target.value })}
              disabled={loading}
              className="form-select"
            >
              <option value="">Select Answer</option>
              {currentQuestion.options.map((opt, i) => opt.trim() && (
                <option key={i} value={opt}>{String.fromCharCode(65 + i)}. {opt}</option>
              ))}
            </select>
          ) : (
            <select
              value={currentQuestion.answer}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, answer: e.target.value })}
              disabled={loading}
              className="form-select"
            >
              <option value="">Select</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          )}

          <label className="label">Bloom's Taxonomy Level</label>
          <select
            value={currentQuestion.bloom_level}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, bloom_level: e.target.value })}
            disabled={loading}
            className="form-select"
          >
            {bloomLevels.map(level => <option key={level} value={level}>{level}</option>)}
          </select>

          <label className="label">Concept/Topic</label>
          <input
            type="text"
            placeholder="e.g., Loops, Variables, Conditionals"
            value={currentQuestion.concept}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, concept: e.target.value })}
            disabled={loading}
            className="form-input"
          />

          <label className="label">Explanation (for teachers)</label>
          <textarea
            placeholder="Detailed explanation of why this answer is correct..."
            value={currentQuestion.explanation}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
            rows={2}
            disabled={loading}
            className="form-input"
          />

          <label className="label">Representative Image (optional)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} className="form-input" />

          <div style={{ marginTop: 12 }}>
            <button type="button" onClick={addQuestion} className="btn btn-primary" disabled={loading}>➕ Add This Question</button>
          </div>
        </div>

        {questions.length > 0 && (
          <div className="panel">
            <h4>Added Questions ({questions.length})</h4>
            <div className="questions-list">
              {questions.map((q, i) => (
                <div key={i} className="question-preview-item">
                  <div className="preview-content">
                    <strong>{q.type.toUpperCase()}:</strong> {q.question.substring(0, 120)}{q.question.length > 120 ? '…' : ''}
                    {q.type === 'mcq' ? <span> (Answer: {q.answer})</span> : <span> ({q.answer})</span>}
                    <div className="muted small">Bloom: {q.bloom_level} • Concept: {q.concept}</div>
                  </div>
                  <button type="button" onClick={() => removeQuestion(i)} className="btn btn-danger" aria-label={`Remove question ${i + 1}`}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={handleSubmit} disabled={loading || questions.length === 0} className="btn btn-primary">
            {loading ? '⏳ Creating...' : `✅ Create Set (${questions.length})`}
          </button>
          <button type="button" onClick={onBack} className="btn btn-secondary" disabled={loading}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default QuizSetForm;
