import React from "react";

interface SetManagerProps {
  grade: number;
  module: number;
  sets: any[];
  onBack: () => void;
  onCreateAI: () => void;
  onCreateManual: () => void;
  onRefresh: (g: number, m: number) => void;
}

const SetManager: React.FC<SetManagerProps> = ({ 
  grade, 
  module, 
  sets, 
  onBack, 
  onCreateAI, 
  onCreateManual, 
  onRefresh 
}) => {
  const handleHide = async (id: number, isHidden: boolean) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/hide_quiz_set/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_hidden: !isHidden }),
      });
      if (res.ok) {
        onRefresh(grade, module);
      } else {
        console.error('Hide toggle failed');
      }
    } catch (error) {
      console.error('Hide error:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this quiz set? This action cannot be undone.')) return;
    try {
      const res = await fetch(`http://localhost:5000/admin/delete_quiz_set/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        onRefresh(grade, module);
      } else {
        console.error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="sets-view">
      <button className="back-btn" onClick={onBack}>
        ← Back to Modules
      </button>
      <h3 className="section-title">
        Quiz Sets for Grade {grade}, Module {module}
      </h3>
      <div className="action-buttons">
        <button 
          onClick={onCreateAI} 
          className="btn-primary ai-btn"
          title="Generate new quiz set using AI based on module transcripts"
        >
          🤖 AI Generate New Set
        </button>
        <button 
          onClick={onCreateManual} 
          className="btn-primary manual-btn"
          title="Manually add questions to create a new quiz set"
        >
          ✏️ Add Manual Set
        </button>
      </div>
      {sets.length > 0 ? (
        <div className="sets-grid">
          {sets.map((set) => (
            <div key={set.id} className="card set-card">
              <div className="card-header">
                <h4>Set {parseFloat(set.set_index).toFixed(1)}</h4>
                <span className={`status-badge ${set.is_hidden ? 'hidden' : 'active'}`}>
                  {set.is_hidden ? '🔒 Hidden' : '✅ Active'}
                </span>
              </div>
              <div className="card-body">
                <p className="set-info">
                  <strong>Questions:</strong> {Array.isArray(set.questions) ? set.questions.length : 0}
                </p>
                <p className="set-info">
                  <strong>Created:</strong> {new Date(set.created_at).toLocaleDateString()}
                </p>
                <details className="questions-preview">
                  <summary>View Questions (Teacher Only)</summary>
                  <pre className="json-view">
                    {JSON.stringify(set.questions, null, 2)}
                  </pre>
                </details>
              </div>
              <div className="card-actions">
                <button 
                  onClick={() => handleHide(set.id, set.is_hidden)} 
                  className={`btn-small ${set.is_hidden ? 'btn-warning' : 'btn-secondary'}`}
                >
                  {set.is_hidden ? '👁️ Unhide' : '🙈 Hide'}
                </button>
                <button 
                  onClick={() => handleDelete(set.id)} 
                  className="btn-small btn-danger"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data-card">
          <p>📭 No quiz sets yet for this grade and module.</p>
          <p>Use the buttons above to create the first set!</p>
        </div>
      )}
      <style jsx>{`
        .sets-view { padding: 1rem 0; }
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
        .back-btn:hover { background: #5568d3; }
        .section-title { color: #333; margin: 1rem 0 0.5rem 0; }
        .action-buttons { 
          display: flex; 
          gap: 1rem; 
          margin-bottom: 1.5rem; 
        }
        .btn-primary {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 5px;
          color: white;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .ai-btn { background: #4CAF50; }
        .manual-btn { background: #2196F3; }
        .ai-btn:hover { background: #45a049; }
        .manual-btn:hover { background: #1976d2; }
        .sets-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
          gap: 1rem; 
          margin-top: 1rem; 
        }
        .set-card { 
          background: #f8f9ff; 
          border: 1px solid #e1e5e9; 
          border-radius: 8px; 
          padding: 1rem; 
          transition: all 0.2s ease; 
        }
        .set-card:hover { box-shadow: 0 4px 8px rgba(102, 126, 234, 0.1); }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .card-header h4 { margin: 0; color: #667eea; }
        .status-badge { 
          padding: 0.25rem 0.5rem; 
          border-radius: 12px; 
          font-size: 0.8rem; 
          font-weight: bold; 
        }
        .status-badge.active { background: #d4edda; color: #155724; }
        .status-badge.hidden { background: #f8d7da; color: #721c24; }
        .card-body { margin-bottom: 1rem; }
        .set-info { margin: 0.25rem 0; color: #666; font-size: 0.9rem; }
        .questions-preview { margin-top: 0.5rem; }
        .questions-preview summary { cursor: pointer; color: #667eea; font-weight: bold; }
        .json-view { 
          background: #f8f9fa; 
          border: 1px solid #dee2e6; 
          border-radius: 4px; 
          padding: 0.75rem; 
          overflow-x: auto; 
          font-size: 0.8rem; 
          max-height: 200px; 
          white-space: pre-wrap; 
          margin-top: 0.5rem; 
        }
        .card-actions { 
          display: flex; 
          gap: 0.5rem; 
          justify-content: flex-end; 
        }
        .btn-small { 
          padding: 0.375rem 0.75rem; 
          border: none; 
          border-radius: 4px; 
          cursor: pointer; 
          font-size: 0.85rem; 
          transition: all 0.2s; 
        }
        .btn-secondary { background: #6c757d; color: white; }
        .btn-warning { background: #ffc107; color: #212529; }
        .btn-danger { background: #dc3545; color: white; }
        .btn-small:hover { opacity: 0.9; transform: translateY(-1px); }
        .no-data-card { 
          text-align: center; 
          padding: 2rem; 
          background: #f8f9ff; 
          border: 2px dashed #dee2e6; 
          border-radius: 8px; 
          color: #6c757d; 
        }
      `}</style>
    </div>
  );
};

export default SetManager;
