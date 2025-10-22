import React, { useState, useEffect } from "react";
import SetManager from "./SetManager";
import QuizSetForm from "./QuizSetForm";

interface QuizSummary {
  grade: number;
  quiz_count: number;
}

interface Module {
  module: number;
  transcripts: number;
}

const QuizzesPanel: React.FC = () => {
  const [viewLevel, setViewLevel] = useState<'grades' | 'modules' | 'sets' | 'form'>('grades');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [grades, setGrades] = useState<QuizSummary[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [sets, setSets] = useState<any[]>([]);
  const [showFormType, setShowFormType] = useState<'ai' | 'manual' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('🔷 QuizzesPanel mounted, calling fetchGrades...');
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    console.log('🔵 fetchGrades: START');
    setLoading(true);
    setError('');
    try {
      console.log('🔵 fetchGrades: Creating grade array...');
      const gradeData: QuizSummary[] = [];
      for (let g = 1; g <= 12; g++) {
        gradeData.push({ grade: g, quiz_count: 0 });
      }
      console.log('🔵 fetchGrades: Grade array created:', gradeData);
      setGrades(gradeData);
      console.log('🔵 fetchGrades: State updated successfully');
    } catch (err: any) {
      console.error('❌ fetchGrades: ERROR caught:', err);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error stack:', err.stack);
      setError('Failed to load grades: ' + (err.message || 'Unknown error'));
    } finally {
      console.log('🔵 fetchGrades: Setting loading to false');
      setLoading(false);
    }
  };

  const fetchModules = async (grade: number) => {
    console.log('🟢 fetchModules: START for grade', grade);
    setLoading(true);
    setError('');
    try {
      const url = `http://localhost:5000/admin/quizzes/grades/modules?grade=${grade}`;
      console.log('🟢 fetchModules: Fetching from:', url);
      
      const res = await fetch(url, {
        credentials: 'include',
      });
      
      console.log('🟢 fetchModules: Response status:', res.status);
      console.log('🟢 fetchModules: Response ok?', res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ fetchModules: Response not OK. Body:', errorText);
        throw new Error(`Failed to fetch modules: ${res.status} ${errorText}`);
      }
      
      const data = await res.json();
      console.log('🟢 fetchModules: Data received:', data);
      
      setModules(data.modules || []);
      setSelectedGrade(grade);
      setViewLevel('modules');
      console.log('🟢 fetchModules: SUCCESS');
    } catch (err: any) {
      console.error('❌ fetchModules: ERROR:', err);
      console.error('❌ Error message:', err.message);
      setError('Error loading modules: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchSets = async (grade: number, module: number) => {
    console.log('🟡 fetchSets: START for grade', grade, 'module', module);
    setLoading(true);
    setError('');
    try {
      const url = `http://localhost:5000/admin/quizzes/${grade}/${module}/sets`;
      console.log('🟡 fetchSets: Fetching from:', url);
      
      const res = await fetch(url, {
        credentials: 'include',
      });
      
      console.log('🟡 fetchSets: Response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ fetchSets: Response not OK. Body:', errorText);
        throw new Error(`Failed to fetch sets: ${res.status} ${errorText}`);
      }
      
      const data = await res.json();
      console.log('🟡 fetchSets: Data received:', data);
      
      setSets(data || []);
      setSelectedModule(module);
      setViewLevel('sets');
      console.log('🟡 fetchSets: SUCCESS');
    } catch (err: any) {
      console.error('❌ fetchSets: ERROR:', err);
      setError('Error loading quiz sets: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSet = (type: 'ai' | 'manual') => {
    console.log('🔶 handleCreateSet:', type);
    if (!selectedGrade || !selectedModule) return;
    setShowFormType(type);
    setViewLevel('form');
  };

  const handleFormSuccess = (newSet: any) => {
    console.log('✅ handleFormSuccess:', newSet);
    if (selectedGrade && selectedModule) {
      fetchSets(selectedGrade, selectedModule);
    }
  };

  const handleBackToGrades = () => {
    console.log('⬅️ handleBackToGrades');
    setViewLevel('grades');
    setSelectedGrade(null);
    setSelectedModule(null);
    setModules([]);
    setSets([]);
    setError('');
  };

  const handleBackToModules = () => {
    console.log('⬅️ handleBackToModules');
    setViewLevel('modules');
    setSelectedModule(null);
    setSets([]);
    setError('');
  };

  console.log('🔷 QuizzesPanel render:', {
    viewLevel,
    loading,
    error,
    gradesCount: grades.length,
    modulesCount: modules.length,
    setsCount: sets.length
  });

  if (loading && viewLevel === 'grades') {
    console.log('📊 Rendering: Loading grades...');
    return <div className="loading">Loading grades...</div>;
  }

  if (error && viewLevel === 'grades') {
    console.log('📊 Rendering: Error for grades:', error);
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchGrades} style={{ marginLeft: '10px', padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Retry
        </button>
      </div>
    );
  }

  console.log('📊 Rendering: Main panel view');

  return (
    <div className="quizzes-panel">
      <h2 className="panel-title">Quizzes Management</h2>
      
      {error && viewLevel !== 'grades' && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )}
      
      {viewLevel === 'grades' && (
        <div className="grades-view">
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Select a grade to manage quiz sets by module
          </p>
          <div className="grades-grid">
            {grades.map((gr) => (
              <div 
                key={gr.grade} 
                className="grade-card" 
                onClick={() => {
                  console.log('👆 Grade card clicked:', gr.grade);
                  fetchModules(gr.grade);
                }}
              >
                <h3>Grade {gr.grade}</h3>
                <p>Click to view modules →</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewLevel === 'modules' && selectedGrade && (
        <div className="modules-view">
          <button className="back-btn" onClick={handleBackToGrades}>← Back to Grades</button>
          <h3>Modules for Grade {selectedGrade}</h3>
          {loading ? (
            <div className="loading">Loading modules...</div>
          ) : (
            <div className="modules-grid">
              {modules.map((mod) => (
                <div 
                  key={mod.module} 
                  className="module-card" 
                  onClick={() => {
                    console.log('👆 Module card clicked:', mod.module);
                    fetchSets(selectedGrade, mod.module);
                  }}
                >
                  <h4>Module {mod.module}</h4>
                  <p>{mod.transcripts} Topics Available</p>
                  <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Click to manage quiz sets →
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {viewLevel === 'sets' && selectedGrade && selectedModule && (
        <SetManager
          grade={selectedGrade}
          module={selectedModule}
          sets={sets}
          onBack={handleBackToModules}
          onCreateAI={() => handleCreateSet('ai')}
          onCreateManual={() => handleCreateSet('manual')}
          onRefresh={fetchSets}
        />
      )}

      {viewLevel === 'form' && showFormType && selectedGrade && selectedModule && (
        <QuizSetForm
          type={showFormType}
          grade={selectedGrade}
          module={selectedModule}
          onBack={() => {
            setShowFormType(null);
            setViewLevel('sets');
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      <style jsx>{`
        .quizzes-panel { 
          background: white; 
          padding: 1.5rem; 
          border-radius: 10px; 
          box-shadow: 0 2px 10px rgba(0,0,0,0.05); 
        }
        .panel-title { 
          color: #333; 
          margin-bottom: 1rem; 
          font-size: 1.8rem;
        }
        .grades-view, .modules-view { 
          margin-top: 1rem; 
        }
        .grades-grid, .modules-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
          gap: 1rem; 
        }
        .grade-card, .module-card { 
          background: #f8f9ff; 
          padding: 1.5rem; 
          border-radius: 8px; 
          cursor: pointer; 
          transition: all 0.2s; 
          border: 2px solid #e1e5e9; 
        }
        .grade-card:hover, .module-card:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 4px 8px rgba(102, 126, 234, 0.15); 
          border-color: #667eea; 
        }
        .grade-card h3, .module-card h4 { 
          color: #667eea; 
          margin: 0 0 0.5rem 0; 
        }
        .grade-card p, .module-card p { 
          margin: 0.25rem 0; 
          color: #666; 
        }
        .back-btn { 
          background: #667eea; 
          color: white; 
          border: none; 
          padding: 0.75rem 1.5rem; 
          border-radius: 5px; 
          cursor: pointer; 
          margin-bottom: 1rem; 
          font-size: 0.9rem;
          transition: background 0.2s;
        }
        .back-btn:hover {
          background: #5568d3;
        }
        .loading { 
          text-align: center; 
          padding: 2rem; 
          color: #666; 
        }
        .error { 
          background: #f8d7da; 
          color: #721c24; 
          padding: 1.5rem; 
          border-radius: 5px; 
          text-align: center; 
        }
        .error button {
          background: #721c24;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .error-banner {
          background: #fff3cd;
          color: #856404;
          padding: 1rem;
          border-radius: 5px;
          margin-bottom: 1rem;
          border-left: 4px solid #ffc107;
        }
      `}</style>
    </div>
  );
};

export default QuizzesPanel;
