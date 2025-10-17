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
  sets: Set[];  // CHANGED: From quizzes to sets
}

interface Set {
  set_index: number;
  question_count: number;
  created_at: string;
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
  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingQuiz, setLoadingQuiz] = useState<string | null>(null);
  const [quizMessage, setQuizMessage] = useState<{ [key: string]: string }>({});
  const [currentQuiz, setCurrentQuiz] = useState<{ name: string; data: QuizData; quizId: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const displayGrade = grade && grade !== "null" && grade !== "undefined" && grade !== "" 
    ? grade 
    : (localStorage.getItem("currentGrade") || "");

  // UPDATED: Fetch modules with available sets from quiz_sets table
  useEffect(() => {
    const fetchModules = async () => {
      if (!displayGrade) {
        setError("Grade not found. Please log in again.");
        setLoadingModules(false);
        return;
      }
  
      try {
        console.log('📚 Fetching modules for grade:', displayGrade);
        
        // Fetch all 7 modules and their sets
        const moduleData: Module[] = [];
        
        for (let m = 1; m <= 7; m++) {
          try {
            // CHANGED: Use student endpoint instead of admin endpoint
            const response = await fetch(
              `http://localhost:5000/api/student/quiz_sets/${displayGrade}/${m}`,
              { credentials: "include" }
            );
  
            if (response.ok) {
              const sets = await response.json();
              
              if (sets.length > 0) {
                moduleData.push({
                  id: m,
                  name: `Module ${m}`,
                  sets: sets
                });
              }
            }
          } catch (err) {
            console.warn(`Module ${m} fetch failed:`, err);
            // Continue to next module
          }
        }
  
        console.log('📚 Modules fetched:', moduleData);
        
        if (moduleData.length === 0) {
          setError("No quiz sets available yet. Please contact your teacher.");
        }
        
        setModules(moduleData);
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError("Error connecting to server");
      } finally {
        setLoadingModules(false);
      }
    };
    fetchModules();
  }, [displayGrade]);
  

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
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

  // UPDATED: Start quiz with set_index instead of quiz_id
  const handleStartQuiz = async (setIndex: number, setName: string) => {
    const moduleId = selectedModule;

    if (!displayGrade || !moduleId) {
      setQuizMessage({ [setName]: "Error: Grade or module not found" });
      return;
    }

    setLoadingQuiz(setName);
    setQuizMessage({});

    try {
      console.log(`🎯 Fetching quiz set: Grade ${displayGrade}, Module ${moduleId}, Set ${setIndex}`);
      
      // Fetch specific quiz set
      const response = await fetch(
        `http://localhost:5000/api/fetch_quiz?grade=${displayGrade}&module=${moduleId}&set_index=${setIndex}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch quiz");
      }

      const { questions, set_index } = await response.json();

      // Convert fetched questions to old format for QuizView compatibility
      const quizData: QuizData = {
        multiple_choice: questions.filter((q: any) => q.type === 'mcq').map((q: any) => ({
          question: q.question,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation || "",
          bloom_level: q.bloom_level,
          concept: q.concept,
          needs_image: q.needs_image || false,
          grade: q.grade,
        })),
        true_false: questions.filter((q: any) => q.type === 'tf').map((q: any) => ({
          question: q.question,
          answer: q.answer,
          explanation: q.explanation || "",
          bloom_level: q.bloom_level,
          concept: q.concept,
          needs_image: q.needs_image || false,
          grade: q.grade,
        })),
      };

      setCurrentQuiz({
        name: setName,
        data: quizData,
        quizId: moduleId,
      });
      
      // UPDATED: Store with module and set_index info
      localStorage.setItem("currentQuiz", JSON.stringify({
        ...quizData,
        moduleId: moduleId,
        set_index: set_index
      }));
      
      setQuizMessage({ [setName]: `Quiz set ${set_index} loaded successfully!` });
    } catch (error) {
      console.error("Error fetching quiz:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Error fetching quiz. Please try again.";
      setQuizMessage({ [setName]: errorMessage });
    } finally {
      setLoadingQuiz(null);
    }
  };

  if (currentQuiz) {
    return (
      <QuizView
        quizData={currentQuiz.data}
        quizName={currentQuiz.name}
        quizId={currentQuiz.quizId}
        username={username}
        grade={displayGrade}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "30px",
          borderRadius: "15px",
          marginBottom: "30px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ margin: "0 0 10px 0", fontSize: "32px" }}>
              Welcome, {username}!
            </h1>
            <p style={{ margin: 0, fontSize: "18px", opacity: 0.9 }}>
              {displayGrade && `Grade: ${displayGrade} | `}Ready to learn?
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "12px 24px",
              backgroundColor: "rgba(255,255,255,0.2)",
              border: "2px solid white",
              borderRadius: "8px",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {loadingModules ? (
        <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>
          Loading modules...
        </div>
      ) : error ? (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fee",
            border: "2px solid #fcc",
            borderRadius: "10px",
            color: "#c00",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      ) : selectedModule === null ? (
        <>
          <h2
            style={{
              color: "#333",
              marginBottom: "25px",
              fontSize: "24px",
            }}
          >
            Available Modules
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "25px",
            }}
          >
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(102, 126, 234, 0.2)";
                  e.currentTarget.style.borderColor = "#667eea";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                  e.currentTarget.style.borderColor = "#e0e0e0";
                }}
              >
                <h3
                  style={{
                    color: "#667eea",
                    marginTop: 0,
                    marginBottom: "15px",
                    fontSize: "22px",
                  }}
                >
                  {module.name}
                </h3>
                <p
                  style={{
                    color: "#666",
                    marginBottom: "15px",
                    fontSize: "16px",
                  }}
                >
                  {module.sets.length} Quiz {module.sets.length === 1 ? 'Set' : 'Sets'} Available
                </p>
                <p style={{ color: "#999", margin: 0, fontSize: "14px" }}>
                  Click to view quiz sets →
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            onClick={handleBackToModules}
            style={{
              padding: "10px 20px",
              backgroundColor: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "20px",
              fontSize: "16px",
            }}
          >
            ← Back to Modules
          </button>
          <h2 style={{ color: "#333", marginBottom: "25px", fontSize: "24px" }}>
            Quiz Sets in {modules.find((m) => m.id === selectedModule)?.name}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {modules
              .find((m) => m.id === selectedModule)
              ?.sets.map((set, index) => {
                const setName = `Set ${parseFloat(String(set.set_index)).toFixed(1)}`;
                const isLoading = loadingQuiz === setName;
                const message = quizMessage[setName];
                const isSuccess = message && message.includes("successfully");

                return (
                  <div
                    key={index}
                    onClick={() => !isLoading && handleStartQuiz(set.set_index, setName)}
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
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 16px rgba(102, 126, 234, 0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 2px 4px rgba(0,0,0,0.1)";
                      }
                    }}
                  >
                    <h3 style={{ color: "#667eea", marginTop: 0, marginBottom: "10px" }}>
                      {setName}
                    </h3>
                    <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>
                      {set.question_count} Questions
                    </p>
                    <p style={{ color: "#999", fontSize: "12px", marginBottom: "15px" }}>
                      Created: {new Date(set.created_at).toLocaleDateString()}
                    </p>
                    {message && (
                      <p
                        style={{
                          marginTop: "10px",
                          padding: "8px",
                          backgroundColor: isSuccess ? "#d4edda" : "#f8d7da",
                          color: isSuccess ? "#155724" : "#721c24",
                          borderRadius: "5px",
                          fontSize: "13px",
                        }}
                      >
                        {message}
                      </p>
                    )}
                    <div
                      style={{
                        marginTop: "15px",
                        padding: "8px 12px",
                        backgroundColor: isLoading ? "#fff3cd" : isSuccess ? "#d4edda" : "#e9ecef",
                        borderRadius: "5px",
                        fontSize: "12px",
                        color: "#333",
                      }}
                    >
                      {isLoading ? "Loading..." : isSuccess ? "Loaded" : "Click to start"}
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
