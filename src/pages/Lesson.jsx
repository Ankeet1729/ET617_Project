// src/pages/Lesson.jsx
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../utils/AuthContext";
import { logEvent } from "../utils/clickLogger";
import { useNavigate, useParams } from "react-router-dom";

function Lesson() {
  const { moduleId } = useParams();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds

  const questionRefs = useRef([]);
  const timerRef = useRef(null);

  const getUserId = () => currentUser?.uid || "anonymous";

  useEffect(() => {
    const uid = getUserId();
    logEvent(uid, "page_view", {
      page: `lesson_${moduleId}`,
      path: window.location.pathname,
    });
  }, [currentUser, moduleId]);

  const normalizeAnswer = (ans) => {
    if (!ans) return "";
    const trimmed = ans.trim().toLowerCase();
    if (trimmed === "true" || trimmed === "t") return "TRUE";
    if (trimmed === "false" || trimmed === "f") return "FALSE";
    return ans.trim().charAt(0).toUpperCase();
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      setIsLoading(true);
      setError(null);
      const url = `/data/module_quiz-${moduleId}.json?cb=${Date.now()}`;
      try {
        const res = await fetch(url);
        const text = await res.text();

        if (text.trim().startsWith("<!DOCTYPE html") || text.trim().startsWith("<html")) {
          throw new Error("Expected JSON but got HTML");
        }

        let data = JSON.parse(text);
        if (!Array.isArray(data)) throw new Error("Invalid quiz data format (expected array)");

        data = data.map((q) => {
          const isTrueFalse =
            (!q.options || q.options.length === 0) &&
            (q.answer?.toLowerCase().includes("true") || q.answer?.toLowerCase().includes("false"));

          if (isTrueFalse) {
            q.options = ["True", "False"];
            q.normalizedAnswer = normalizeAnswer(q.answer);
          } else {
            if (!q.options || q.options.length === 0) {
              q.options = ["Option A", "Option B", "Option C", "Option D"];
            }
            q.options = q.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              if (!/^[A-D]\)/i.test(opt)) return `${letter}) ${opt}`;
              return opt;
            });
            q.normalizedAnswer = normalizeAnswer(q.answer);
          }
          return q;
        });

        setQuizData(data);
        setTimeLeft(data.length * 2 * 60);
      } catch (err) {
        console.error("Failed to load quiz:", err);
        setError(`Failed to load quiz data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [moduleId]);

  useEffect(() => {
    if (quizData.length === 0 || showResults) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setShowResults(true); // Auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [quizData, showResults]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleLogout = async () => {
    try {
      if (logout) await logout();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      navigate("/login");
    }
  };

  const handleQuizAnswer = (index, answer) => {
    setUserAnswers((prev) => ({ ...prev, [index]: answer }));
    logEvent(getUserId(), "quiz_answer", {
      module: moduleId,
      questionIndex: index,
      answer,
    });
  };

  const calculateScore = () => {
    let score = 0;
    quizData.forEach((q, idx) => {
      if (normalizeAnswer(userAnswers[idx]) === q.normalizedAnswer) score += 1;
    });
    return score;
  };

  const goToQuestion = (idx) => {
    if (idx >= 0 && idx < quizData.length) setCurrentQuestion(idx);
    questionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        Loading Module {moduleId}...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500 p-4">
        <p>{error}</p>
      </div>
    );

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-white">Your Results</h2>
        <p className="text-lg mb-6 text-white">
          You scored <span className="font-semibold">{score}</span> out of{" "}
          <span className="font-semibold">{quizData.length}</span>
        </p>

        <ul className="space-y-4">
          {quizData.map((q, idx) => {
            const userAnswer = userAnswers[idx] || "";
            const isCorrect = normalizeAnswer(userAnswer) === q.normalizedAnswer;
            const correctOption =
              q.options.find((o) => normalizeAnswer(o) === q.normalizedAnswer) || q.normalizedAnswer;

            return (
              <li key={idx} className="p-5 border rounded-lg bg-white shadow-lg">
                <p className="font-semibold mb-1 text-gray-900">{q.question}</p>

                {q.bloom_level && (
                  <p className="text-sm mb-2 text-gray-700">
                    <span className="font-medium">Bloom Level:</span> {q.bloom_level}
                  </p>
                )}

                <p>
                  <span className="font-medium text-gray-800">Your Answer:</span>{" "}
                  <span
                    className={
                      userAnswer
                        ? isCorrect
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                        : "text-gray-500"
                    }
                  >
                    {userAnswer || "Not Attempted"}
                  </span>
                </p>
                {!isCorrect && (
                  <p className="mt-1 text-gray-800">
                    <span className="font-medium">Correct Answer:</span>{" "}
                    <span className="font-semibold text-gray-900">{correctOption}</span>
                  </p>
                )}
                {q.explanation && (
                  <p className="mt-2 text-gray-700">
                    <span className="font-medium">Explanation:</span> {q.explanation}
                  </p>
                )}
              </li>
            );
          })}
        </ul>

        <button
          className="mt-8 px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
          onClick={() => {
            setShowResults(false);
            setCurrentQuestion(0);
            setUserAnswers({});
          }}
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  const q = quizData[currentQuestion];
  const userAnswer = userAnswers[currentQuestion] || "";

  return (
    <div className="flex flex-col p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-white">Module {moduleId}</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Timer */}
      <div className="mb-4 text-white font-semibold text-lg">
        Time Left: <span>{formatTime(timeLeft)}</span>
      </div>

      <div
        ref={(el) => (questionRefs.current[currentQuestion] = el)}
        className="p-5 border rounded-lg bg-white shadow-md mb-4"
      >
        <p className="font-semibold mb-4 text-gray-900">{q.question}</p>
        <div className="flex flex-col items-start gap-2">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuizAnswer(currentQuestion, opt)}
              className={`px-4 py-2 rounded transition w-full text-left ${
                userAnswer === opt
                  ? "bg-blue-200 text-black font-medium"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal question navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {quizData.map((_, idx) => {
          const isAttempted = !!userAnswers[idx];
          const isCurrent = currentQuestion === idx;
          return (
            <button
              key={idx}
              onClick={() => goToQuestion(idx)}
              className={`w-10 h-10 rounded-full border flex items-center justify-center font-medium transition
                ${isCurrent ? "bg-blue-500 text-white" : ""}
                ${!isCurrent && isAttempted ? "bg-green-400 text-white" : ""}
                ${!isCurrent && !isAttempted ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : ""}
              `}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => goToQuestion(currentQuestion - 1)}
          disabled={currentQuestion === 0}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          Previous
        </button>

        {currentQuestion === quizData.length - 1 ? (
          <button
            onClick={() => setShowResults(true)}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => goToQuestion(currentQuestion + 1)}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default Lesson;
