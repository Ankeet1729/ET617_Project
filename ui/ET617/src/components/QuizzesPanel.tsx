import React, { useState, useEffect } from "react";
import SetManager from "./SetManager";
import QuizSetForm from "./QuizSetForm";

const API_BASE_URL = import.meta.env.BACKEND_URL || "http://localhost:5000";

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
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const gradeData: QuizSummary[] = Array.from({ length: 12 }, (_, i) => ({
        grade: i + 1,
        quiz_count: 0,
      }));
      setGrades(gradeData);
    } catch (err: any) {
      setError('Failed to load grades: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async (grade: number) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/admin/quizzes/grades/modules?grade=${grade}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Failed to fetch modules: ${res.statusText}`);
      const data = await res.json();
      setModules(data.modules || []);
      setSelectedGrade(grade);
      setViewLevel('modules');
    } catch (err: any) {
      setError('Error loading modules: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchSets = async (grade: number, module: number) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/admin/quizzes/${grade}/${module}/sets`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Failed to fetch sets: ${res.statusText}`);
      const data = await res.json();
      setSets(data || []);
      setSelectedModule(module);
      setViewLevel('sets');
    } catch (err: any) {
      setError('Error loading quiz sets: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSet = (type: 'ai' | 'manual') => {
    if (!selectedGrade || !selectedModule) return;
    setShowFormType(type);
    setViewLevel('form');
  };

  const handleFormSuccess = (newSet: any) => {
    if (selectedGrade && selectedModule) fetchSets(selectedGrade, selectedModule);
  };

  const handleBackToGrades = () => {
    setViewLevel('grades');
    setSelectedGrade(null);
    setSelectedModule(null);
    setModules([]);
    setSets([]);
    setError('');
  };

  const handleBackToModules = () => {
    setViewLevel('modules');
    setSelectedModule(null);
    setSets([]);
    setError('');
  };

  return (
    <div className="panel-container">
      <h2 className="panel-heading">Quizzes Management</h2>

      {error && <div className="error-banner">⚠️ {error}</div>}

      {loading && <div className="loading">Loading...</div>}

      {!loading && viewLevel === 'grades' && (
        <div>
          <p className="panel-desc">Select a grade to manage its quiz modules</p>
          <div className="grid">
            {grades.map((gr) => (
              <div key={gr.grade} className="card clickable" onClick={() => fetchModules(gr.grade)}>
                <h3>Grade {gr.grade}</h3>
                <p>{gr.quiz_count} sets available</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && viewLevel === 'modules' && selectedGrade && (
        <div>
          <button className="btn back" onClick={handleBackToGrades}>← Back to Grades</button>
          <h3 className="subheading">Modules for Grade {selectedGrade}</h3>
          <div className="grid">
            {modules.map((mod) => (
              <div key={mod.module} className="card clickable" onClick={() => fetchSets(selectedGrade, mod.module)}>
                <h4>Module {mod.module}</h4>
                <p>{mod.transcripts} Topics</p>
              </div>
            ))}
          </div>
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
    </div>
  );
};

export default QuizzesPanel;
