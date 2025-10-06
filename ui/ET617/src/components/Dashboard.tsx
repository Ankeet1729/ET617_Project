import React, { useState, useEffect } from "react";
import QuizView from "./QuizView";

interface DashboardProps {
  username: string;
  grade?: string;
  onLogout: () => void;
}

interface Module {
  id: number;
  name: string;
  quizzes: string[];
}

interface MultipleChoiceQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  bloom_level: string;
  concept: string;
  needs_image: boolean;
  grade: number;
}

interface TrueFalseQuestion {
  question: string;
  answer: string;
  explanation: string;
  bloom_level: string;
  concept: string;
  needs_image: boolean;
  grade: number;
}

interface QuizData {
  multiple_choice: MultipleChoiceQuestion[];
  true_false: TrueFalseQuestion[];
}

const Dashboard: React.FC<DashboardProps> = ({ username, grade, onLogout }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [loadingModules, setLoadingModules] = useState<boolean>(true);
  const [loadingQuiz, setLoadingQuiz] = useState<string | null>(null);
  const [quizMessage, setQuizMessage] = useState<{ [key: string]: string }>({});
  const [currentQuiz, setCurrentQuiz] = useState<{ name: string; data: QuizData; quizId: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const displayGrade = grade && grade !== "null" && grade !== "undefined" && grade !== "" ? grade : (localStorage.getItem("currentGrade") || "");

  // Fetch modules from the backend API
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/modules");
        const data = await response.json();

        if (response.ok) {
          // Transform the data into the required format
          const transformedModules: Module[] = data.reduce((acc: Module[], row: any) => {
            const moduleIndex = acc.findIndex((m) => m.id === row.module);
            if (moduleIndex === -1) {
              acc.push({
                id: row.module,
                name: `Module ${row.module}`,
                quizzes: [`Quiz ${row.module}.${row.quiz_id}`],
              });
            } else {
              acc[moduleIndex].quizzes.push(`Quiz ${row.module}.${row.quiz_id}`);
            }
            return acc;
          }, []);
          setModules(transformedModules);
        } else {
          setError(data.error || "Failed to fetch modules");
        }
      } catch (err) {
        setError("Error connecting to server");
      } finally {
        setLoadingModules(false);
      }
    };

    fetchModules();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies if using session-based auth
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Call the parent logout function regardless of API success/failure
      onLogout();
    }
  };

  const handleModuleClick = (moduleId: number) => {
    setSelectedModule(moduleId);
    localStorage.setItem("selectedModule", moduleId.toString());
  };

  const handleBackToModules = () => {
    setSelectedModule(null);
    setCurrentQuiz(null);
    localStorage.removeItem("selectedModule");
    localStorage.removeItem("currentQuiz");
  };

  const handleBackToDashboard = () => {
    setSelectedModule(null);
    setCurrentQuiz(null);
    localStorage.removeItem("selectedModule");
    localStorage.removeItem("currentQuiz");
  };

  const getQuizIdFromName = (quizName: string): number => {
    const match = quizName.match(/Quiz (\d+)\.(\d+)/);
    if (match) {
      return parseInt(match[2]);
    }
    return 1;
  };

  const handleStartQuiz = async (quizName: string) => {
    setLoadingQuiz(quizName);
    setQuizMessage((prev) => ({ ...prev, [quizName]: "" }));

    try {
      console.log(displayGrade+"yeah");
      const response = await fetch("http://localhost:5000/api/generate_quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          quiz_id: getQuizIdFromName(quizName),
          grade: displayGrade || "8",
          username: username || localStorage.getItem("currentUser") || undefined
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.multiple_choice || data.true_false) {
          const quizId = getQuizIdFromName(quizName);
          const quizState = { name: quizName, data: data, quizId: quizId };
          setCurrentQuiz(quizState);
          localStorage.setItem("currentQuiz", JSON.stringify(quizState));
        } else {
          setQuizMessage((prev) => ({
            ...prev,
            [quizName]: `Quiz generated successfully! ${data.message || ""}`,
          }));
        }
      } else {
        setQuizMessage((prev) => ({
          ...prev,
          [quizName]: `Error: ${data.error || "Failed to generate quiz"}`,
        }));
      }
    } catch (error) {
      setQuizMessage((prev) => ({
        ...prev,
        [quizName]: "Error connecting to server",
      }));
    } finally {
      setLoadingQuiz(null);
    }
  };

  if (currentQuiz) {
    return (
      <QuizView
        quizName={currentQuiz.name}
        quizData={currentQuiz.data}
        quizId={currentQuiz.quizId}
        onBackToModules={handleBackToModules}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
        <h1 style={{ margin: 0, color: "#333" }}>{selectedModule ? `Module ${selectedModule}` : "Dashboard"}</h1>
        <div>
          <span style={{ marginRight: "20px", color: "#666" }}>Welcome, {username}{displayGrade ? ` (Grade ${displayGrade})` : ""}!</span>
          <button onClick={handleLogout} style={{ padding: "8px 16px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </header>

      {loadingModules ? (
        <p>Loading modules...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : selectedModule === null ? (
        <div>
            <h2 style={{ color: "#FFFF00", marginBottom: "20px" }}>Available Modules</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {modules.map((module) => (
              <div
                key={module.id}
                onClick={() => handleModuleClick(module.id)}
                style={{
                  padding: "25px",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  border: "2px solid #e0e0e0",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ margin: "0 0 10px 0", color: "#333", fontSize: "24px", fontWeight: "bold" }}>{module.name}</h3>
                <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "16px" }}>{module.quizzes.length} Quizzes Available</p>
                <div style={{ display: "flex", alignItems: "center", color: "#007bff", fontWeight: "500" }}>
                  <span>Click to view quizzes →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={handleBackToModules}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            ← Back to Modules
          </button>

          <h2 style={{ color: "#FFFF00", marginBottom: "20px" }}>
            Quizzes in {modules.find((m) => m.id === selectedModule)?.name}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {modules
              .find((m) => m.id === selectedModule)
              ?.quizzes.map((quiz, index) => {
                const isLoading = loadingQuiz === quiz;
                const message = quizMessage[quiz];
                const isSuccess = message && message.includes("successfully");

                return (
                  <div
                    key={index}
                    onClick={() => !isLoading && handleStartQuiz(quiz)}
                    style={{
                      padding: "20px",
                      backgroundColor: isLoading ? "#f8f9fa" : "#fff",
                      borderRadius: "10px",
                      border: isLoading ? "2px solid #ffc107" : "1px solid #e0e0e0",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      opacity: isLoading ? 0.7 : 1,
                    }}
                  >
                    <h4 style={{ margin: "0 0 10px 0", color: "#333", fontSize: "18px" }}>{quiz}</h4>
                    <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>
                      {isLoading ? "Generating quiz..." : "Click to start quiz"}
                    </p>

                    {message && (
                      <div
                        style={{
                          margin: "10px 0",
                          padding: "8px 12px",
                          backgroundColor: isSuccess ? "#d4edda" : "#f8d7da",
                          border: `1px solid ${isSuccess ? "#c3e6cb" : "#f5c6cb"}`,
                          borderRadius: "4px",
                          fontSize: "12px",
                          color: isSuccess ? "#155724" : "#721c24",
                        }}
                      >
                        {message}
                      </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          backgroundColor: isLoading ? "#ffc107" : isSuccess ? "#28a745" : "#e9ecef",
                          borderRadius: "4px",
                          fontSize: "12px",
                          color: isLoading ? "#333" : isSuccess ? "#fff" : "#495057",
                        }}
                      >
                        {isLoading ? "Generating..." : isSuccess ? "Generated" : "Not Started"}
                      </span>
                      <span style={{ color: isLoading ? "#666" : "#28a745", fontWeight: "500", fontSize: "14px" }}>
                        {isLoading ? "Please wait..." : "Start Quiz →"}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
