import React, { useState, useEffect } from "react";

interface Attempt {
  id: number;
  grade: number;
  module: number;
  set_index: number;
  score: number;
  total_questions: number;
  percentage: number;
  grade_level: string;
  submitted_at: string;
  answers: any[];
}

interface Stats {
  total_attempts: number;
  avg_score: number;
  best_score: number;
  worst_score: number;
  modules_attempted: number;
}

interface StudentActivityPanelProps {
  username: string;
  onBack: () => void;
}

const StudentActivityPanel: React.FC<StudentActivityPanelProps> = ({ username, onBack }) => {
  console.log('🎯 StudentActivityPanel: Mounted with username:', username);
  
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 StudentActivityPanel: useEffect triggered for username:', username);
    fetchData();
  }, [username]);

  const fetchData = async () => {
    console.log('📡 Fetching data for username:', username);
    setLoading(true);
    setError(null);
    
    try {
      const attemptsUrl = `http://localhost:5000/admin/student_attempts/${username}`;
      const statsUrl = `http://localhost:5000/admin/student_stats/${username}`;
      
      console.log('📡 Fetching from:', attemptsUrl);
      console.log('📡 Fetching from:', statsUrl);

      const [attemptsRes, statsRes] = await Promise.all([
        fetch(attemptsUrl, { credentials: 'include' }),
        fetch(statsUrl, { credentials: 'include' })
      ]);

      console.log('📥 Attempts response status:', attemptsRes.status);
      console.log('📥 Stats response status:', statsRes.status);

      if (!attemptsRes.ok) {
        const errorText = await attemptsRes.text();
        console.error('❌ Attempts fetch failed:', errorText);
        throw new Error(`Failed to fetch attempts: ${attemptsRes.status}`);
      }

      if (!statsRes.ok) {
        const errorText = await statsRes.text();
        console.error('❌ Stats fetch failed:', errorText);
        throw new Error(`Failed to fetch stats: ${statsRes.status}`);
      }

      const attemptsData = await attemptsRes.json();
      const statsData = await statsRes.json();

      console.log('✅ Attempts data:', attemptsData);
      console.log('✅ Stats data:', statsData);

      setAttempts(attemptsData);
      setStats(statsData);
    } catch (error: any) {
      console.error('❌ Error fetching student activity:', error);
      setError(error.message || 'Failed to load activity data');
    } finally {
      console.log('✅ Fetch complete, setting loading to false');
      setLoading(false);
    }
  };

  const getGradeColor = (gradeLevel: string) => {
    const colors: any = {
      'Excellent': '#28a745',
      'Good': '#17a2b8',
      'Satisfactory': '#ffc107',
      'Below Average': '#fd7e14',
      'Needs Improvement': '#dc3545'
    };
    return colors[gradeLevel] || '#6c757d';
  };

  console.log('🖼️ Rendering StudentActivityPanel. Loading:', loading, 'Error:', error, 'Attempts:', attempts.length);

  if (loading) {
    console.log('📊 Rendering: Loading state');
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="loading">Loading activity for {username}...</div>
      </div>
    );
  }

  if (error) {
    console.log('📊 Rendering: Error state:', error);
    return (
      <div style={{ padding: '2rem' }}>
        <button onClick={onBack} style={{ 
          background: '#667eea', 
          color: 'white', 
          border: 'none', 
          padding: '0.75rem 1.5rem', 
          borderRadius: '5px', 
          cursor: 'pointer',
          marginBottom: '1rem'
        }}>
          ← Back to Students
        </button>
        <div style={{ 
          background: '#f8d7da', 
          color: '#721c24', 
          padding: '1rem', 
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      </div>
    );
  }

  console.log('📊 Rendering: Main view');

  return (
    <div className="activity-panel">
      <button className="back-btn" onClick={() => {
        console.log('⬅️ Back button clicked');
        onBack();
      }}>← Back to Students</button>
      
      <h2 className="panel-title">Quiz Activity for {username}</h2>

      {/* Stats Summary */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total_attempts}</div>
            <div className="stat-label">Total Attempts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.avg_score}%</div>
            <div className="stat-label">Average Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.best_score}%</div>
            <div className="stat-label">Best Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.modules_attempted}</div>
            <div className="stat-label">Modules Attempted</div>
          </div>
        </div>
      )}

{/* Attempts List */}
<h3 style={{ marginTop: '2rem', color: '#333' }}>Recent Attempts</h3>
{attempts.length === 0 ? (
  <div className="no-data">No quiz attempts yet for {username}.</div>
) : (
  <div className="attempts-list">
    {attempts.map(attempt => {
      const setIndexNum = typeof attempt.set_index === 'string' ? parseFloat(attempt.set_index) : attempt.set_index;
      
      return (
        <div key={attempt.id} className="attempt-card">
          <div className="attempt-header">
            <div>
              <strong>Grade {attempt.grade}, Module {attempt.module}, Set {setIndexNum.toFixed(1)}</strong>
              <br />
              <small>{new Date(attempt.submitted_at).toLocaleString()}</small>
            </div>
            <div className="score-badge" style={{ backgroundColor: getGradeColor(attempt.grade_level) }}>
              {attempt.percentage}%
            </div>
          </div>
          <div className="attempt-body">
            <p><strong>Score:</strong> {attempt.score}/{attempt.total_questions} ({attempt.grade_level})</p>
            <button 
              className="btn-small btn-primary" 
              onClick={() => {
                console.log('🔍 Toggle details for attempt:', attempt.id);
                setSelectedAttempt(selectedAttempt?.id === attempt.id ? null : attempt);
              }}
            >
              {selectedAttempt?.id === attempt.id ? 'Hide' : 'View'} Details
            </button>
          </div>
          {selectedAttempt?.id === attempt.id && (
            <div className="attempt-details">
              <h4>Question-by-Question Breakdown:</h4>
              {attempt.answers.map((ans: any, i: number) => (
                <div key={i} className="question-result" style={{ 
                  borderLeft: `4px solid ${ans.isCorrect ? '#28a745' : '#dc3545'}`,
                  padding: '1rem',
                  marginBottom: '0.75rem',
                  background: '#f8f9fa',
                  borderRadius: '5px'
                }}>
                  <div><strong>Q{ans.questionIndex}:</strong> {ans.question}</div>
                  <div className="answer-row" style={{ display: 'flex', gap: '1rem', margin: '0.5rem 0' }}>
                    <span className={ans.isCorrect ? 'correct' : 'incorrect'} style={{
                      color: ans.isCorrect ? '#28a745' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      User: {ans.userAnswer}
                    </span>
                    {!ans.isCorrect && <span className="correct" style={{ color: '#28a745', fontWeight: 'bold' }}>Correct: {ans.correctAnswer}</span>}
                  </div>
                  <small>{ans.bloom_level} • {ans.concept}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    })}
  </div>
)}


      <style jsx>{`
        .activity-panel { padding: 1.5rem; background: white; border-radius: 10px; }
        .back-btn { background: #667eea; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 5px; cursor: pointer; margin-bottom: 1rem; }
        .panel-title { color: #333; margin-bottom: 1.5rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 10px; text-align: center; }
        .stat-value { font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
        .stat-label { font-size: 0.9rem; opacity: 0.9; }
        .attempts-list { display: flex; flex-direction: column; gap: 1rem; }
        .attempt-card { background: #f8f9ff; border: 1px solid #e1e5e9; border-radius: 8px; padding: 1rem; }
        .attempt-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .score-badge { color: white; padding: 0.5rem 1rem; border-radius: 20px; font-weight: bold; font-size: 1.1rem; }
        .attempt-body { display: flex; justify-content: space-between; align-items: center; }
        .btn-small { padding: 0.5rem 1rem; border: none; border-radius: 5px; cursor: pointer; font-size: 0.85rem; }
        .btn-primary { background: #667eea; color: white; }
        .attempt-details { margin-top: 1rem; padding: 1rem; background: white; border-radius: 5px; }
        .question-result { padding: 0.75rem; margin-bottom: 0.75rem; background: #f8f9fa; border-radius: 5px; }
        .answer-row { display: flex; gap: 1rem; margin: 0.5rem 0; }
        .correct { color: #28a745; font-weight: bold; }
        .incorrect { color: #dc3545; font-weight: bold; }
        .no-data { text-align: center; padding: 2rem; color: #999; background: #f8f9ff; border-radius: 8px; }
        .loading { text-align: center; padding: 2rem; color: #666; }
      `}</style>
    </div>
  );
};

export default StudentActivityPanel;
