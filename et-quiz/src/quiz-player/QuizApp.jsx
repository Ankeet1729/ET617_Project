// import React, { useState, useEffect } from "react";
// import ModuleList from "./ModuleList";
// import QuizPlayer from "./QuizPlayer";
// import { fetchModules, fetchQuiz, normalizeQuiz, testStudent } from "./api";

// export default function QuizApp() {
//   const [modules, setModules] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [view, setView] = useState("list");
//   const [selectedModule, setSelectedModule] = useState(null);
//   const [quiz, setQuiz] = useState([]);
//   const [quizLoading, setQuizLoading] = useState(false);
//   const [quizError, setQuizError] = useState(null);
//   const [scores, setScores] = useState({});

//   useEffect(() => {
//     setLoading(true);
//     fetchModules()
//       .then(setModules)
//       .catch(e => setError(e.message))
//       .finally(() => setLoading(false));
//   }, []);

//   function handleStartQuiz(mod) {
//     setSelectedModule(mod);
//     setQuizLoading(true);
//     setQuizError(null);
//     setView("quiz");
//     fetchQuiz(mod.id, testStudent.grade, testStudent.locale)
//       .then(qj => setQuiz(normalizeQuiz(qj)))
//       .catch(e => {
//         setQuizError(e.message);
//         setView("list");
//       })
//       .finally(() => setQuizLoading(false));
//   }

//   function handleBack() {
//     setView("list");
//     setSelectedModule(null);
//     setQuiz([]);
//   }

//   function handleSubmit(answers) {
//     // Calculate score
//     let score = 0;
//     let total = quiz.length;
//     quiz.forEach((q, i) => {
//       if (answers[i] && answers[i] === (q.type === "tf" ? q.correct : (q.options[q.correct] || q.correct))) {
//         score++;
//       } else if (answers[i] && q.type === "mcq" && q.options[q.correct] === answers[i]) {
//         score++;
//       } else if (answers[i] && q.type === "tf" && q.correct === answers[i]) {
//         score++;
//       }
//     });
//     setScores(prev => ({ ...prev, [selectedModule.id]: { score, total } })); // Overwrite score for reattempts
//     setView("list");
//     setSelectedModule(null);
//     setQuiz([]);
//   }

//   if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-[#0A72FF]">Loading modules...</div>;
//   if (error) return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
//       <div className="text-[#EF4444] mb-4">{error}</div>
//       <button className="px-4 py-2 bg-[#0A72FF] text-white rounded" onClick={() => window.location.reload()}>Retry</button>
//     </div>
//   );
//   if (view === "quiz") {
//     if (quizLoading) return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-[#0A72FF]">Loading quiz...</div>;
//     if (quizError) return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
//         <div className="text-[#EF4444] mb-4">{quizError}</div>
//         <button className="px-4 py-2 bg-[#0A72FF] text-white rounded" onClick={handleBack}>Retry</button>
//       </div>
//     );
//     return <QuizPlayer module={selectedModule} quiz={quiz} onBack={handleBack} onSubmit={handleSubmit} />;
//   }
//   return <ModuleList modules={modules} onStart={handleStartQuiz} scores={scores} />;
// }


import React, { useState, useEffect } from "react";
import ModuleList from "./ModuleList";
import QuizPlayer from "./QuizPlayer";
import { fetchModules, fetchQuiz, normalizeQuiz, testStudent } from "./api";

export default function QuizApp() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("list");
  const [selectedModule, setSelectedModule] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState(null);
  const [scores, setScores] = useState({});

  useEffect(() => {
    setLoading(true);
    fetchModules()
      .then(setModules)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function handleStartQuiz(mod) {
    setSelectedModule(mod);
    setQuizLoading(true);
    setQuizError(null);
    setView("quiz");
    fetchQuiz(mod.id, testStudent.grade, testStudent.locale)
      .then((qj) => setQuiz(normalizeQuiz(qj)))
      .catch((e) => {
        setQuizError(e.message);
        setView("list");
      })
      .finally(() => setQuizLoading(false));
  }

  function handleBack() {
    setView("list");
    setSelectedModule(null);
    setQuiz([]);
  }

  function handleSubmit(answers) {
    let score = 0;
    let total = quiz.length;
    quiz.forEach((q, i) => {
      if (answers[i]) {
        if (q.type === "mcq") {
          const correctValue =
            typeof q.correct === "number" ? q.options[q.correct] : q.correct;
          if (answers[i] === correctValue) score++;
        } else if (q.type === "tf") {
          if (answers[i] === q.correct) score++;
        }
      }
    });
    setScores((prev) => ({ ...prev, [selectedModule.id]: { score, total } }));
    setView("list");
    setSelectedModule(null);
    setQuiz([]);
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-[#0A72FF]">
        Loading modules...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="text-[#EF4444] mb-4">{error}</div>
        <button
          className="px-4 py-2 bg-[#0A72FF] text-white rounded"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  if (view === "quiz") {
    if (quizLoading)
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-[#0A72FF]">
          Loading quiz...
        </div>
      );
    if (quizError)
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
          <div className="text-[#EF4444] mb-4">{quizError}</div>
          <button className="px-4 py-2 bg-[#0A72FF] text-white rounded" onClick={handleBack}>
            Retry
          </button>
        </div>
      );
    return <QuizPlayer module={selectedModule} quiz={quiz} onBack={handleBack} onSubmit={handleSubmit} />;
  }
  return <ModuleList modules={modules} onStart={handleStartQuiz} scores={scores} />;
}
