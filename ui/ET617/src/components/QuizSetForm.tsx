// import React, { useState } from "react";

// interface QuizSetFormProps {
//   type: 'ai' | 'manual';
//   grade: number;
//   module: number;
//   onBack: () => void;
//   onSuccess: (newSet: any) => void;
// }

// const QuizSetForm: React.FC<QuizSetFormProps> = ({ 
//   type, 
//   grade, 
//   module, 
//   onBack, 
//   onSuccess 
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [currentQuestion, setCurrentQuestion] = useState({ 
//     type: 'mcq' as 'mcq' | 'tf', 
//     question: '', 
//     options: ['', '', '', ''], 
//     answer: '', 
//     explanation: '',
//     bloom_level: 'Remember',
//     concept: ''
//   });
//   const [questions, setQuestions] = useState<any[]>([]);
//   const [files, setFiles] = useState<File[]>([]);

//   const bloomLevels = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];

//   const addQuestion = () => {
//     if (!currentQuestion.question.trim()) {
//       alert('Please enter a question.');
//       return;
//     }
//     if (currentQuestion.type === 'mcq') {
//       const filledOptions = currentQuestion.options.filter(opt => opt.trim());
//       if (filledOptions.length < 2) {
//         alert('Please enter at least 2 options for MCQ.');
//         return;
//       }
//       if (!currentQuestion.answer.trim()) {
//         alert('Please select the correct answer.');
//         return;
//       }
//     } else {
//       if (!currentQuestion.answer) {
//         alert('Please select True or False.');
//         return;
//       }
//     }
    
//     const newQ = { 
//       ...currentQuestion, 
//       grade,
//       image_path: null
//     };
//     setQuestions([...questions, newQ]);
//     // Reset form
//     setCurrentQuestion({ 
//       type: 'mcq', 
//       question: '', 
//       options: ['', '', '', ''], 
//       answer: '', 
//       explanation: '',
//       bloom_level: 'Remember',
//       concept: ''
//     });
//   };

//   const removeQuestion = (index: number) => {
//     setQuestions(questions.filter((_, i) => i !== index));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const newFiles = Array.from(e.target.files);
//       setFiles(prev => [...prev, ...newFiles]);
//     }
//   };

//   const handleSubmit = async () => {
//     if (type === 'manual' && questions.length === 0) {
//       alert('Please add at least one question before creating the set.');
//       return;
//     }
    
//     setLoading(true);
//     const formData = new FormData();
//     formData.append('grade', grade.toString());
//     formData.append('module', module.toString());
//     formData.append('type', type);
    
//     if (type === 'manual') {
//       formData.append('questions', JSON.stringify(questions));
//     }
    
//     files.forEach(file => formData.append('images', file));

//     try {
//       const res = await fetch('http://localhost:5000/admin/create_quiz_set', {
//         method: 'POST',
//         body: formData,
//         credentials: 'include',
//       });
      
//       if (res.ok) {
//         const data = await res.json();
//         alert(`✅ Quiz set ${parseFloat(data.set_index).toFixed(1)} created successfully with ${data.questions_count} questions!`);
//         onSuccess({ set_index: data.set_index });
//         onBack();
//       } else {
//         const err = await res.json();
//         alert(`❌ Error: ${err.error || 'Failed to create set'}`);
//       }
//     } catch (error) {
//       console.error('Submit error:', error);
//       alert('❌ Connection error. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (type === 'ai') {
//     return (
//       <div className="ai-form">
//         <h3 className="section-title">🤖 AI Generate Quiz Set</h3>
//         <p className="description">
//           This will automatically generate a new quiz set (7 Multiple Choice + 3 True/False questions) 
//           for <strong>Grade {grade}, Module {module}</strong> using the module's video transcripts 
//           and NEP-aligned Bloom's Taxonomy levels.
//         </p>
//         <div className="info-box">
//           <p>✨ Questions will be tailored to the cognitive level of grade {grade}</p>
//           <p>📚 Based on actual video content from the module</p>
//           <p>🎯 Distributed across Remember, Understand, Apply, Analyze, Evaluate levels</p>
//         </div>
//         <div className="form-actions">
//           <button 
//             onClick={handleSubmit} 
//             disabled={loading}
//             className="btn-primary ai-submit"
//           >
//             {loading ? '⏳ Generating...' : '🚀 Generate with AI'}
//           </button>
//           <button 
//             onClick={onBack} 
//             className="btn-secondary cancel-btn"
//             disabled={loading}
//           >
//             Cancel
//           </button>
//         </div>
//         <style jsx>{`
//           .ai-form { 
//             background: white; 
//             padding: 2rem; 
//             border-radius: 10px; 
//             max-width: 600px; 
//             margin: 0 auto; 
//             box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//           }
//           .section-title { color: #333; margin-bottom: 1rem; }
//           .description { color: #666; margin-bottom: 1.5rem; line-height: 1.6; }
//           .info-box {
//             background: #f8f9ff;
//             border-left: 4px solid #667eea;
//             padding: 1rem;
//             margin-bottom: 1.5rem;
//             border-radius: 4px;
//           }
//           .info-box p { margin: 0.5rem 0; color: #555; }
//           .form-actions { display: flex; gap: 1rem; justify-content: center; }
//           .ai-submit { background: #4CAF50; min-width: 180px; }
//           .cancel-btn { background: #6c757d; }
//           .btn-primary, .btn-secondary { 
//             padding: 0.75rem 1.5rem; 
//             border: none; 
//             border-radius: 5px; 
//             color: white; 
//             cursor: pointer; 
//             font-size: 1rem; 
//             transition: all 0.2s;
//           }
//           .btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
//           .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
//         `}</style>
//       </div>
//     );
//   }

//   // Manual form
//   return (
//     <div className="manual-form">
//       <button className="back-btn" onClick={onBack} disabled={loading}>
//         ← Back to Sets
//       </button>
//       <h3 className="section-title">✏️ Manual Quiz Set - Grade {grade}, Module {module}</h3>
      
//       {/* REMOVED form tag to prevent HTML5 validation */}
//       <div className="quiz-form">
//         {/* Current Question Input */}
//         <div className="question-input-section">
//           <h4>Add Question #{questions.length + 1}</h4>
//           <div className="form-group">
//             <label>Question Type</label>
//             <select 
//               value={currentQuestion.type} 
//               onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value as 'mcq' | 'tf' })}
//               disabled={loading}
//             >
//               <option value="mcq">Multiple Choice (MCQ)</option>
//               <option value="tf">True/False</option>
//             </select>
//           </div>
          
//           <div className="form-group">
//             <label>Question Text *</label>
//             <textarea 
//               placeholder="Enter the question here..."
//               value={currentQuestion.question} 
//               onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
//               rows={3}
//               disabled={loading}
//             />
//           </div>
          
//           {currentQuestion.type === 'mcq' && (
//             <div className="form-group">
//               <label>Options (at least 2 required)</label>
//               {currentQuestion.options.map((opt, i) => (
//                 <input 
//                   key={i} 
//                   type="text"
//                   placeholder={`Option ${String.fromCharCode(65 + i)}`}
//                   value={opt} 
//                   onChange={(e) => {
//                     const newOpts = [...currentQuestion.options];
//                     newOpts[i] = e.target.value;
//                     setCurrentQuestion({ ...currentQuestion, options: newOpts });
//                   }}
//                   disabled={loading}
//                 />
//               ))}
//             </div>
//           )}
          
//           <div className="form-group">
//             <label>Correct Answer *</label>
//             {currentQuestion.type === 'mcq' ? (
//               <select 
//                 value={currentQuestion.answer} 
//                 onChange={(e) => setCurrentQuestion({ ...currentQuestion, answer: e.target.value })}
//                 disabled={loading}
//               >
//                 <option value="">Select Answer</option>
//                 {currentQuestion.options.map((opt, i) => opt.trim() && (
//                   <option key={i} value={opt}>{String.fromCharCode(65 + i)}. {opt}</option>
//                 ))}
//               </select>
//             ) : (
//               <select 
//                 value={currentQuestion.answer} 
//                 onChange={(e) => setCurrentQuestion({ ...currentQuestion, answer: e.target.value })}
//                 disabled={loading}
//               >
//                 <option value="">Select</option>
//                 <option value="true">True</option>
//                 <option value="false">False</option>
//               </select>
//             )}
//           </div>
          
//           <div className="form-group">
//             <label>Bloom's Taxonomy Level</label>
//             <select 
//               value={currentQuestion.bloom_level} 
//               onChange={(e) => setCurrentQuestion({ ...currentQuestion, bloom_level: e.target.value })}
//               disabled={loading}
//             >
//               {bloomLevels.map(level => <option key={level} value={level}>{level}</option>)}
//             </select>
//           </div>
          
//           <div className="form-group">
//             <label>Concept/Topic</label>
//             <input 
//               type="text"
//               placeholder="e.g., Loops, Variables, Conditionals"
//               value={currentQuestion.concept} 
//               onChange={(e) => setCurrentQuestion({ ...currentQuestion, concept: e.target.value })}
//               disabled={loading}
//             />
//           </div>
          
//           <div className="form-group">
//             <label>Explanation (for teachers)</label>
//             <textarea 
//               placeholder="Detailed explanation of why this answer is correct..."
//               value={currentQuestion.explanation} 
//               onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
//               rows={2}
//               disabled={loading}
//             />
//           </div>
          
//           <div className="form-group">
//             <label>Representative Image (optional)</label>
//             <input 
//               type="file" 
//               accept="image/*" 
//               onChange={handleFileChange}
//               disabled={loading}
//             />
//           </div>
          
//           <button 
//             type="button" 
//             onClick={addQuestion} 
//             className="btn-primary add-question-btn"
//             disabled={loading}
//           >
//             ➕ Add This Question
//           </button>
//         </div>

//         {/* Added Questions Preview */}
//         {questions.length > 0 && (
//           <div className="questions-preview-section">
//             <h4>Added Questions ({questions.length})</h4>
//             <div className="questions-list">
//               {questions.map((q, i) => (
//                 <div key={i} className="question-preview-item">
//                   <div className="preview-content">
//                     <strong>{q.type.toUpperCase()}:</strong> {q.question.substring(0, 60)}...
//                     {q.type === 'mcq' && <span> (Answer: {q.answer})</span>}
//                     {q.type === 'tf' && <span> ({q.answer})</span>}
//                     <br />
//                     <small>Bloom: {q.bloom_level} | Concept: {q.concept}</small>
//                   </div>
//                   <button 
//                     type="button" 
//                     onClick={() => removeQuestion(i)}
//                     className="btn-danger remove-btn"
//                     title="Remove this question"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Submit Actions */}
//         <div className="form-actions">
//           <button 
//             type="button"
//             onClick={handleSubmit}
//             disabled={loading || questions.length === 0}
//             className="btn-primary submit-btn"
//           >
//             {loading ? '⏳ Creating...' : `✅ Create Set with ${questions.length} Questions`}
//           </button>
//           <button 
//             type="button"
//             onClick={onBack} 
//             className="btn-secondary cancel-btn"
//             disabled={loading}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
      
//       <style jsx>{`
//         .manual-form { 
//           background: white; 
//           padding: 1.5rem; 
//           border-radius: 10px; 
//           max-width: 800px; 
//           margin: 0 auto; 
//           box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//         }
//         .back-btn { 
//           background: #667eea; 
//           color: white; 
//           border: none; 
//           padding: 0.5rem 1rem; 
//           border-radius: 5px; 
//           cursor: pointer; 
//           margin-bottom: 1rem; 
//           font-size: 0.9rem; 
//         }
//         .section-title { color: #333; margin-bottom: 1rem; }
//         .quiz-form { display: flex; flex-direction: column; gap: 1.5rem; }
//         .question-input-section, .questions-preview-section { 
//           background: #f8f9ff; 
//           padding: 1.5rem; 
//           border-radius: 8px; 
//           border: 1px solid #e1e5e9; 
//         }
//         .form-group { margin-bottom: 1rem; }
//         .form-group label { display: block; font-weight: bold; margin-bottom: 0.25rem; color: #555; }
//         input, textarea, select { 
//           width: 100%; 
//           padding: 0.75rem; 
//           border: 1px solid #ddd; 
//           border-radius: 5px; 
//           font-size: 1rem; 
//           box-sizing: border-box; 
//         }
//         textarea { resize: vertical; min-height: 80px; }
//         .add-question-btn { 
//           background: #28a745; 
//           color: white; 
//           border: none; 
//           padding: 0.75rem 1.5rem; 
//           border-radius: 5px; 
//           cursor: pointer; 
//           font-size: 1rem; 
//           align-self: flex-start; 
//         }
//         .questions-list { 
//           max-height: 300px; 
//           overflow-y: auto; 
//           border: 1px solid #dee2e6; 
//           border-radius: 5px; 
//           padding: 1rem; 
//           background: white; 
//         }
//         .question-preview-item { 
//           display: flex; 
//           justify-content: space-between; 
//           align-items: center; 
//           padding: 0.75rem; 
//           border-bottom: 1px solid #eee; 
//         }
//         .preview-content { flex: 1; padding-right: 1rem; }
//         .remove-btn { 
//           background: #dc3545; 
//           color: white; 
//           border: none; 
//           width: 30px; 
//           height: 30px; 
//           border-radius: 50%; 
//           cursor: pointer; 
//           font-size: 1.2rem; 
//           display: flex; 
//           align-items: center; 
//           justify-content: center; 
//         }
//         .form-actions { 
//           display: flex; 
//           gap: 1rem; 
//           justify-content: center; 
//           margin-top: 1.5rem; 
//           padding-top: 1rem; 
//           border-top: 1px solid #eee; 
//         }
//         .submit-btn { 
//           background: #667eea; 
//           min-width: 200px; 
//         }
//         .btn-primary, .btn-secondary { 
//           padding: 0.75rem 1.5rem; 
//           border: none; 
//           border-radius: 5px; 
//           color: white; 
//           cursor: pointer; 
//           font-size: 1rem; 
//           transition: all 0.2s; 
//         }
//         .btn-secondary { background: #6c757d; }
//         .btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
//         .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
//       `}</style>
//     </div>
//   );
// };

// export default QuizSetForm;
import React, { useState } from "react";

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
      const res = await fetch('http://localhost:5000/admin/create_quiz_set', {
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
