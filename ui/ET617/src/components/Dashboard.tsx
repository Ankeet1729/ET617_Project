// import React, { useState, useEffect } from "react";
// import QuizView from "./QuizView";
// import QuizResults from "./QuizResults";


// interface Supermodule {
//   id: number;
//   supermodule_code: string;
//   supermodule_name: string;
// }


// interface Module {
//   id: number;
//   submodule_code: string;
//   submodule_name: string;
//   image_path: string | null;
//   set_count: number;
// }


// interface QuizSet {
//   id: number;
//   name: string;
//   question_count: number;
//   created_at: string;
//   submodule_name: string;
//   attempted?: boolean;
//   reattempts_allowed?: boolean;
// }


// interface DashboardProps {
//   username: string;
//   grade: number | null;
//   onLogout: () => void;
// }


// const Dashboard: React.FC<DashboardProps> = ({ username, grade, onLogout }) => {
//   const [viewLevel, setViewLevel] = useState<"supermodules" | "modules" | "sets" | "quiz" | "results">("supermodules");
//   const [supermodules, setSupermodules] = useState<Supermodule[]>([]);
//   const [modules, setModules] = useState<Module[]>([]);
//   const [selectedSupermodule, setSelectedSupermodule] = useState<string | null>(null);
//   const [selectedModule, setSelectedModule] = useState<string | null>(null);
//   const [selectedModuleName, setSelectedModuleName] = useState<string>("");
//   const [sets, setSets] = useState<QuizSet[]>([]);
//   const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [resultsData, setResultsData] = useState<any>(null);


//   // Fetch supermodules on mount
//   useEffect(() => {
//     if (grade) {
//       fetchSupermodules();
//     }
//   }, [grade]);


//   const fetchSupermodules = async () => {
//     console.log("📚 [Dashboard] Fetching supermodules");
//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await fetch("http://localhost:5000/api/supermodules", {
//         credentials: "include",
//       });
//       if (res.ok) {
//         const data = await res.json();
//         console.log("✅ [Dashboard] Supermodules fetched:", data);
//         setSupermodules(data);
//       } else {
//         console.error("❌ [Dashboard] Failed to fetch supermodules");
//         setMessage("Failed to load supermodules");
//       }
//     } catch (error) {
//       console.error("❌ [Dashboard] Error fetching supermodules:", error);
//       setMessage("Error loading supermodules");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const fetchModules = async (supermoduleCode: string) => {
//     console.log("📚 [Dashboard] Fetching submodules for:", supermoduleCode);
//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await fetch(`http://localhost:5000/api/supermodules/${supermoduleCode}/children`, {
//         credentials: "include",
//       });
//       if (res.ok) {
//         const data = await res.json();
//         console.log("✅ [Dashboard] Submodules fetched:", data);
//         setModules(data);
//         setViewLevel("modules");
//       } else {
//         console.error("❌ [Dashboard] Failed to fetch submodules");
//         setMessage("Failed to load submodules");
//       }
//     } catch (error) {
//       console.error("❌ [Dashboard] Error fetching submodules:", error);
//       setMessage("Error loading submodules");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const fetchQuizSets = async (submoduleCode: string) => {
//     console.log("📝 [Dashboard] Fetching quiz sets for:", submoduleCode, "grade:", grade);
//     setLoading(true);
//     setMessage("");
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/student/quiz-sets/${grade}/${submoduleCode}`,
//         { credentials: "include" }
//       );
//       if (res.ok) {
//         const data = await res.json();
//         console.log("✅ [Dashboard] Quiz sets fetched:", data);
//         setSets(data);
//         setViewLevel("sets");
//       } else {
//         const errorText = await res.text();
//         console.error("❌ [Dashboard] Failed to fetch quiz sets:", errorText);
//         setMessage("Failed to load quiz sets");
//       }
//     } catch (error) {
//       console.error("❌ [Dashboard] Error fetching quiz sets:", error);
//       setMessage("Error loading quiz sets");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleSupermoduleClick = (supermodule: Supermodule) => {
//     console.log("🔘 [Dashboard] Supermodule clicked:", supermodule.supermodule_code);
//     setSelectedSupermodule(supermodule.supermodule_code);
//     fetchModules(supermodule.supermodule_code);
//   };


//   const handleModuleClick = (module: Module) => {
//     console.log("🔘 [Dashboard] Module clicked:", module.submodule_code);
//     setSelectedModule(module.submodule_code);
//     setSelectedModuleName(module.submodule_name);
//     fetchQuizSets(module.submodule_code);
//   };


//   const handleStartQuiz = async (setId: number, setName: string) => {
//     console.log("🎯 [Dashboard] Starting quiz:", setId);
//     setMessage("");
//     try {
//       const res = await fetch(`http://localhost:5000/api/fetch_quiz/${setId}`, {
//         credentials: "include",
//       });
//       if (res.ok) {
//         const quizData = await res.json();
//         console.log("✅ [Dashboard] Quiz data fetched:", quizData);
//         setSelectedQuiz({ id: setId, name: setName, data: quizData });
//         setViewLevel("quiz");
//       } else {
//         console.error("❌ [Dashboard] Failed to load quiz");
//         setMessage("Failed to load quiz");
//       }
//     } catch (error) {
//       console.error("❌ [Dashboard] Error fetching quiz:", error);
//       setMessage("Error loading quiz");
//     }
//   };


//   const handleBackToSupermodules = () => {
//     console.log("⬅️ [Dashboard] Back to supermodules");
//     setViewLevel("supermodules");
//     setSelectedSupermodule(null);
//     setModules([]);
//     setMessage("");
//   };


//   const handleBackToModules = () => {
//     console.log("⬅️ [Dashboard] Back to modules");
//     setViewLevel("modules");
//     setSelectedModule(null);
//     setSelectedModuleName("");
//     setSets([]);
//     setMessage("");
//   };


//   const handleBackToSets = () => {
//     console.log("⬅️ [Dashboard] Back to sets");
//     setViewLevel("sets");
//     setSelectedQuiz(null);
//     setResultsData(null);
//     setMessage("");
//   };


//   const handleShowResults = async (quizSetId: number, quizName: string) => {
//     try {
//       console.log('🔍 [Dashboard] Fetching results for quiz set:', quizSetId);
//       setMessage("Loading results...");
//       setLoading(true);
      
//       const res = await fetch(
//         `http://localhost:5000/api/get_last_result/${quizSetId}`,
//         { credentials: "include" }
//       );
  
//       if (!res.ok) {
//         throw new Error("Failed to fetch results");
//       }
  
//       const data = await res.json();
//       console.log("✅ [Dashboard] Last result fetched:", data);
  
//       // The answers_json already contains detailed results with all fields
//       const results = data.results;
//       const correctAnswers = results.filter((r: any) => r.isCorrect).length;
//       const totalQuestions = results.length;
//       const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
//       // Transform to match QuizResults component expectations
//       const transformedData = {
//         quiz_id: quizSetId,
//         totalQuestions: totalQuestions,
//         correctAnswers: correctAnswers,
//         percentage: percentage,
//         gradeLevel: calculateGradeLevel(results),
//         results: results.map((r: any) => ({
//           questionIndex: r.questionIndex,
//           question: r.question,
//           userAnswer: r.userAnswer,
//           correctAnswer: r.correctAnswer,
//           isCorrect: r.isCorrect,
//           explanation: r.explanation,
//           bloom_level: r.bloom_level,
//           concept: r.concept,
//           type: r.type,
//           needs_image: !!r.image_path,
//           options: r.options || []
//         })),
//         submittedAt: data.submitted_at
//       };
  
//       setResultsData(transformedData);
//       setViewLevel("results");
//       setMessage("");
//     } catch (error) {
//       console.error("❌ [Dashboard] Error fetching results:", error);
//       setMessage("Failed to load results");
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   // Helper function to calculate grade level
//   const calculateGradeLevel = (results: any[]) => {
//     const correctCount = results.filter((r: any) => r.is_correct).length;
//     const percentage = Math.round((correctCount / results.length) * 100);
    
//     if (percentage >= 90) return "Excellent";
//     if (percentage >= 80) return "Good";
//     if (percentage >= 70) return "Satisfactory";
//     if (percentage >= 60) return "Below Average";
//     return "Needs Improvement";
//   };


//   if (viewLevel === "quiz" && selectedQuiz) {
//     return (
//       <QuizView
//         quizName={selectedQuiz.name}
//         quizData={selectedQuiz.data}
//         quizId={selectedQuiz.id}
//         username={username}
//         grade={String(grade)}
//         onBack={handleBackToSets}
//       />
//     );
//   }

//   // ✅ NEW: Render QuizResults view when results are available
//   if (viewLevel === "results" && resultsData) {
//     return (
//       <QuizResults
//         evaluationResult={resultsData}
//         onReturnToDashboard={handleBackToSets}
//       />
//     );
//   }


//   return (
//     <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", padding: "20px" }}>
//       {/* Header */}
//       <div
//         style={{
//           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//           borderRadius: "16px",
//           padding: "30px",
//           marginBottom: "30px",
//           color: "white",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
//         }}
//       >
//         <div>
//           <h1 style={{ margin: "0 0 10px 0", fontSize: "28px", fontWeight: "bold" }}>
//             Welcome, {username}!
//           </h1>
//           <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>
//             Grade: {grade} | Ready to learn?
//           </p>
//         </div>
//         <button
//           onClick={onLogout}
//           style={{
//             padding: "12px 24px",
//             backgroundColor: "rgba(255,255,255,0.2)",
//             color: "white",
//             border: "1px solid rgba(255,255,255,0.3)",
//             borderRadius: "8px",
//             cursor: "pointer",
//             fontSize: "16px",
//             fontWeight: "bold",
//             transition: "all 0.2s",
//           }}
//           onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)")}
//           onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)")}
//         >
//           Logout
//         </button>
//       </div>


//       {/* Message */}
//       {message && (
//         <div
//           style={{
//             backgroundColor: "#fef3c7",
//             color: "#92400e",
//             padding: "15px 20px",
//             borderRadius: "8px",
//             marginBottom: "20px",
//             border: "1px solid #fbbf24",
//             fontSize: "14px",
//           }}
//         >
//           {message}
//         </div>
//       )}


//       {/* Loading */}
//       {loading && (
//         <div style={{ color: "#f1f5f9", textAlign: "center", padding: "60px 20px" }}>
//           <div
//             style={{
//               display: "inline-block",
//               width: "50px",
//               height: "50px",
//               border: "5px solid #334155",
//               borderTopColor: "#6366f1",
//               borderRadius: "50%",
//               animation: "spin 1s linear infinite",
//             }}
//           ></div>
//           <p style={{ fontSize: "18px", marginTop: "20px" }}>Loading...</p>
//           <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//         </div>
//       )}


//       {/* Supermodules View */}
//       {!loading && viewLevel === "supermodules" && (
//         <div>
//           <h2 style={{ color: "#f1f5f9", marginBottom: "25px", fontSize: "24px", fontWeight: "bold" }}>
//             Select a Module
//           </h2>
//           {supermodules.length > 0 ? (
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
//               {supermodules.map((sm) => (
//                 <div
//                   key={sm.supermodule_code}
//                   onClick={() => handleSupermoduleClick(sm)}
//                   style={{
//                     backgroundColor: "#1e293b",
//                     borderRadius: "12px",
//                     padding: "30px",
//                     cursor: "pointer",
//                     border: "2px solid #334155",
//                     transition: "all 0.2s",
//                     textAlign: "center",
//                   }}
//                   onMouseOver={(e) => {
//                     e.currentTarget.style.borderColor = "#6366f1";
//                     e.currentTarget.style.transform = "translateY(-5px)";
//                   }}
//                   onMouseOut={(e) => {
//                     e.currentTarget.style.borderColor = "#334155";
//                     e.currentTarget.style.transform = "translateY(0)";
//                   }}
//                 >
//                   <h3 style={{ color: "#6366f1", fontSize: "22px", fontWeight: "bold", margin: "0 0 10px 0" }}>
//                     {sm.supermodule_code}
//                   </h3>
//                   <p style={{ color: "#cbd5e1", margin: 0, fontSize: "14px" }}>{sm.supermodule_name}</p>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div style={{ backgroundColor: "#1e293b", padding: "60px", borderRadius: "16px", textAlign: "center", border: "2px dashed #334155" }}>
//               <p style={{ color: "#f87171", fontSize: "20px", margin: "0 0 15px 0", fontWeight: "bold" }}>
//                 📚 No modules available yet.
//               </p>
//             </div>
//           )}
//         </div>
//       )}


//       {/* Modules View */}
//       {!loading && viewLevel === "modules" && (
//         <div>
//           <button
//             onClick={handleBackToSupermodules}
//             style={{
//               padding: "12px 24px",
//               marginBottom: "25px",
//               backgroundColor: "#334155",
//               color: "#f1f5f9",
//               border: "1px solid #475569",
//               borderRadius: "8px",
//               cursor: "pointer",
//               fontSize: "16px",
//               fontWeight: "500",
//               transition: "all 0.2s",
//             }}
//             onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#475569")}
//             onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#334155")}
//           >
//             ← Back to Modules
//           </button>
//           <h2 style={{ color: "#f1f5f9", marginBottom: "25px", fontSize: "24px", fontWeight: "bold" }}>
//             {selectedSupermodule} - Select a Video
//           </h2>
//           {modules.length > 0 ? (
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
//               {modules.map((module) => (
//                 <div
//                   key={module.submodule_code}
//                   onClick={() => handleModuleClick(module)}
//                   style={{
//                     backgroundColor: "#1e293b",
//                     borderRadius: "16px",
//                     padding: "0",
//                     cursor: "pointer",
//                     border: "2px solid #334155",
//                     transition: "all 0.3s",
//                     boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
//                     overflow: "hidden",
//                   }}
//                   onMouseOver={(e) => {
//                     e.currentTarget.style.borderColor = "#6366f1";
//                     e.currentTarget.style.transform = "translateY(-8px)";
//                     e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.5)";
//                   }}
//                   onMouseOut={(e) => {
//                     e.currentTarget.style.borderColor = "#334155";
//                     e.currentTarget.style.transform = "translateY(0)";
//                     e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.3)";
//                   }}
//                 >
//                   {module.image_path && (
//                     <div style={{ width: "100%", height: "180px", overflow: "hidden" }}>
//                       <img
//                         src={`http://localhost:5000${module.image_path}`}
//                         alt={module.submodule_name}
//                         style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                       />
//                     </div>
//                   )}
//                   <div style={{ padding: "25px" }}>
//                     <h3 style={{ color: "#6366f1", margin: "0 0 12px 0", fontSize: "22px", fontWeight: "bold" }}>
//                       {module.submodule_code}
//                     </h3>
//                     <p style={{ color: "#cbd5e1", margin: "0", fontSize: "15px", lineHeight: 1.6 }}>
//                       {module.submodule_name}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div style={{ backgroundColor: "#1e293b", padding: "60px", borderRadius: "16px", textAlign: "center", border: "2px dashed #334155" }}>
//               <p style={{ color: "#f87171", fontSize: "20px", fontWeight: "bold" }}>
//                 📭 No videos available for this module yet.
//               </p>
//             </div>
//           )}
//         </div>
//       )}


//       {/* Quiz Sets View */}
//       {!loading && viewLevel === "sets" && (
//         <div>
//           <button
//             onClick={handleBackToModules}
//             style={{
//               padding: "12px 24px",
//               marginBottom: "25px",
//               backgroundColor: "#334155",
//               color: "#f1f5f9",
//               border: "1px solid #475569",
//               borderRadius: "8px",
//               cursor: "pointer",
//               fontSize: "16px",
//               fontWeight: "500",
//               transition: "all 0.2s",
//             }}
//             onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#475569")}
//             onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#334155")}
//           >
//             ← Back to Videos
//           </button>
//           <div style={{ marginBottom: "30px" }}>
//             <h2 style={{ color: "#f1f5f9", marginBottom: "8px", fontSize: "26px", fontWeight: "bold" }}>
//               Quiz Sets - {selectedModule}
//             </h2>
//             <p style={{ color: "#94a3b8", margin: 0, fontSize: "15px" }}>{selectedModuleName}</p>
//           </div>
//           {sets.length > 0 ? (
//             <div style={{ display: "grid", gap: "20px" }}>
//               {sets.map((set) => {
//                 const attempted = !!set.attempted;
//                 const noReattempts = set.reattempts_allowed === false;
//                 const blockReattempt = attempted && noReattempts;
                
//                 return (
//                   <div
//                     key={set.id}
//                     style={{
//                       backgroundColor: "#1e293b",
//                       borderRadius: "12px",
//                       padding: "25px",
//                       border: "2px solid #334155",
//                       transition: "all 0.2s",
//                     }}
//                     onMouseOver={(e) => (e.currentTarget.style.borderColor = "#475569")}
//                     onMouseOut={(e) => (e.currentTarget.style.borderColor = "#334155")}
//                   >
//                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
//                       <div style={{ flex: 1, minWidth: "250px" }}>
//                         <h3 style={{ color: "#f1f5f9", margin: "0 0 15px 0", fontSize: "20px", fontWeight: "bold" }}>
//                           {set.name}
//                         </h3>
//                         <div style={{ color: "#94a3b8", fontSize: "14px" }}>
//                           <p style={{ margin: "8px 0" }}>
//                             <strong style={{ color: "#cbd5e1" }}>📝 Questions:</strong> {set.question_count}
//                           </p>
//                           <p style={{ margin: "8px 0" }}>
//                             <strong style={{ color: "#cbd5e1" }}>📅 Created:</strong> {new Date(set.created_at).toLocaleDateString()}
//                           </p>
//                           {blockReattempt && (
//                             <span style={{
//                               display: "inline-block",
//                               padding: "4px 12px",
//                               backgroundColor: "#fde68a",
//                               color: "#92400e",
//                               borderRadius: "8px",
//                               fontWeight: "bold",
//                               marginTop: "8px",
//                               fontSize: "13px"
//                             }}>
//                               Quiz already attempted (no reattempts)
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                       <div style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         gap: "14px",
//                         alignItems: "center"
//                       }}>
//                         <button
//                           onClick={() => handleStartQuiz(set.id, set.name)}
//                           disabled={blockReattempt}
//                           style={{
//                             padding: "16px 32px",
//                             backgroundColor: blockReattempt ? "#a1a1aa" : "#10b981",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "10px",
//                             cursor: blockReattempt ? "not-allowed" : "pointer",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                             boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
//                             transition: "all 0.2s",
//                             opacity: blockReattempt ? 0.6 : 1,
//                           }}
//                           onMouseOver={blockReattempt ? undefined : (e) => {
//                             e.currentTarget.style.backgroundColor = "#059669";
//                             e.currentTarget.style.transform = "translateY(-2px)";
//                             e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.4)";
//                           }}
//                           onMouseOut={blockReattempt ? undefined : (e) => {
//                             e.currentTarget.style.backgroundColor = "#10b981";
//                             e.currentTarget.style.transform = "translateY(0)";
//                             e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.3)";
//                           }}
//                           title={
//                             blockReattempt
//                               ? "You already attempted this quiz and reattempts are not allowed."
//                               : ""
//                           }
//                         >
//                           {blockReattempt ? "Attempted" : "Start Quiz"}
//                         </button>
//                         <button
//                           onClick={() => handleShowResults(set.id, set.name)}
//                           disabled={!attempted}
//                           style={{
//                             padding: "16px 32px",
//                             backgroundColor: attempted ? "#3b82f6" : "#a1a1aa",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "10px",
//                             cursor: attempted ? "pointer" : "not-allowed",
//                             fontSize: "16px",
//                             fontWeight: "bold",
//                             boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
//                             opacity: attempted ? 1 : 0.6,
//                             transition: "all 0.2s",
//                           }}
//                           onMouseOver={
//                             attempted
//                               ? (e) => {
//                                   e.currentTarget.style.backgroundColor = "#2563eb";
//                                   e.currentTarget.style.transform = "translateY(-2px)";
//                                   e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.4)";
//                                 }
//                               : undefined
//                           }
//                           onMouseOut={
//                             attempted
//                               ? (e) => {
//                                   e.currentTarget.style.backgroundColor = "#3b82f6";
//                                   e.currentTarget.style.transform = "translateY(0)";
//                                   e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.3)";
//                                 }
//                               : undefined
//                           }
//                           title={
//                             attempted
//                               ? "View your latest attempt's result"
//                               : "You need to attempt this quiz before viewing results."
//                           }
//                         >
//                           Results
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div style={{ backgroundColor: "#1e293b", padding: "60px 40px", borderRadius: "16px", textAlign: "center", border: "2px dashed #334155" }}>
//               <p style={{ color: "#f87171", fontSize: "20px", margin: "0 0 15px 0", fontWeight: "bold" }}>
//                 📭 No quiz sets available yet for this module.
//               </p>
//               <p style={{ color: "#94a3b8", margin: 0, fontSize: "16px" }}>
//                 Your teacher hasn't created any quizzes yet. Check back soon!
//               </p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };


// export default Dashboard;
import React, { useState, useEffect } from "react";
import QuizView from "./QuizView";
import QuizResults from "./QuizResults";

interface Supermodule { id: number; supermodule_code: string; supermodule_name: string; }
interface Module { id: number; submodule_code: string; submodule_name: string; image_path: string | null; set_count: number; }
interface QuizSet { id: number; name: string; question_count: number; created_at: string; submodule_name: string; attempted?: boolean; reattempts_allowed?: boolean; }

interface DashboardProps {
  username: string;
  grade: number | null;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ username, grade, onLogout }) => {
  const [viewLevel, setViewLevel] = useState<"supermodules" | "modules" | "sets" | "quiz" | "results">("supermodules");
  const [supermodules, setSupermodules] = useState<Supermodule[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedSupermodule, setSelectedSupermodule] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedModuleName, setSelectedModuleName] = useState<string>("");
  const [sets, setSets] = useState<QuizSet[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [resultsData, setResultsData] = useState<any>(null);

  useEffect(() => {
    if (grade) fetchSupermodules();
  }, [grade]);

  const fetchSupermodules = async () => {
    setLoading(true); setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/supermodules", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSupermodules(data);
      } else {
        setMessage("Failed to load modules");
      }
    } catch (err) {
      setMessage("Error loading modules");
    } finally { setLoading(false); }
  };

  const fetchModules = async (supermoduleCode: string) => {
    setLoading(true); setMessage("");
    try {
      const res = await fetch(`http://localhost:5000/api/supermodules/${supermoduleCode}/children`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setModules(data);
        setViewLevel("modules");
      } else setMessage("Failed to load submodules");
    } catch (err) { setMessage("Error loading submodules"); }
    finally { setLoading(false); }
  };

  const fetchQuizSets = async (submoduleCode: string) => {
    setLoading(true); setMessage("");
    try {
      const res = await fetch(`http://localhost:5000/api/student/quiz-sets/${grade}/${submoduleCode}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSets(data);
        setViewLevel("sets");
      } else setMessage("Failed to load quiz sets");
    } catch (err) { setMessage("Error loading quiz sets"); }
    finally { setLoading(false); }
  };

  const handleSupermoduleClick = (sm: Supermodule) => {
    setSelectedSupermodule(sm.supermodule_code);
    fetchModules(sm.supermodule_code);
  };

  const handleModuleClick = (m: Module) => {
    setSelectedModule(m.submodule_code);
    setSelectedModuleName(m.submodule_name);
    fetchQuizSets(m.submodule_code);
  };

  const handleStartQuiz = async (setId: number, setName: string) => {
    setMessage(""); setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/fetch_quiz/${setId}`, { credentials: "include" });
      if (res.ok) {
        const quizData = await res.json();
        setSelectedQuiz({ id: setId, name: setName, data: quizData });
        setViewLevel("quiz");
      } else setMessage("Failed to load quiz");
    } catch (err) { setMessage("Error loading quiz"); }
    finally { setLoading(false); }
  };

  const handleShowResults = async (quizSetId: number) => {
    setMessage("Loading results..."); setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/get_last_result/${quizSetId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch results");
      const data = await res.json();
      const results = data.results || [];
      const correctAnswers = results.filter((r: any) => r.isCorrect || r.is_correct).length;
      const totalQuestions = results.length || 1;
      const percentage = Math.round((correctAnswers / totalQuestions) * 100);

      const transformedData = {
        quiz_id: quizSetId,
        totalQuestions,
        correctAnswers,
        percentage,
        gradeLevel: calculateGradeLevel(results),
        results: results.map((r: any, idx: number) => ({
          questionIndex: idx + 1,
          question: r.question || r.q,
          userAnswer: r.userAnswer || r.answer,
          correctAnswer: r.correctAnswer || r.correct,
          isCorrect: !!(r.isCorrect || r.is_correct),
          explanation: r.explanation,
          bloom_level: r.bloom_level,
          concept: r.concept,
          type: r.type,
          needs_image: !!r.image_path,
          options: r.options || []
        })),
        submittedAt: data.submitted_at
      };

      setResultsData(transformedData);
      setViewLevel("results");
      setMessage("");
    } catch (err) {
      setMessage("Failed to load results");
    } finally { setLoading(false); }
  };

  const calculateGradeLevel = (results: any[]) => {
    if (!results || results.length === 0) return "No attempts";
    const correctCount = results.filter((r: any) => r.is_correct || r.isCorrect).length;
    const percentage = Math.round((correctCount / results.length) * 100);
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Good";
    if (percentage >= 70) return "Satisfactory";
    if (percentage >= 60) return "Below Average";
    return "Needs Improvement";
  };

  const handleBackToSupermodules = () => { setViewLevel("supermodules"); setSelectedSupermodule(null); setModules([]); setMessage(""); };
  const handleBackToModules = () => { setViewLevel("modules"); setSelectedModule(null); setSelectedModuleName(""); setSets([]); setMessage(""); };
  const handleBackToSets = () => { setViewLevel("sets"); setSelectedQuiz(null); setResultsData(null); setMessage(""); };

  if (viewLevel === "quiz" && selectedQuiz) {
    return (
      <QuizView
        quizName={selectedQuiz.name}
        quizData={selectedQuiz.data}
        quizId={selectedQuiz.id}
        username={username}
        grade={String(grade)}
        onBack={handleBackToSets}
      />
    );
  }

  if (viewLevel === "results" && resultsData) {
    return <QuizResults evaluationResult={resultsData} onReturnToDashboard={handleBackToSets} />;
  }

  return (
    <div style={{ minHeight: "100vh", padding: "20px 16px", background: "linear-gradient(180deg,var(--background), #eef6ff)" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: 0 }}>{`Welcome, ${username}`}</h1>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>Grade: {grade ?? "—"} • Ready to learn?</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onLogout} className="secondary" style={{ padding: "10px 14px" }}>Logout</button>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1100 }}>
        {message && (
          <div style={{ background: "rgba(255,244,229,0.9)", color: "var(--text-primary)", padding: 12, borderRadius: 10, marginBottom: 14, border: "1px solid var(--border)" }}>
            {message}
          </div>
        )}

        {loading && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>
            <div style={{ display: "inline-block", width: 48, height: 48, border: "6px solid var(--surface-2)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <p style={{ marginTop: 12 }}>Loading...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {!loading && viewLevel === "supermodules" && (
          <>
            <h2 style={{ marginTop: 0, marginBottom: 16 }}>Select a Module</h2>
            {supermodules.length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16
              }}>
                {supermodules.map((sm) => (
                  <button
                    key={sm.supermodule_code}
                    onClick={() => handleSupermoduleClick(sm)}
                    style={{
                      textAlign: "left",
                      padding: 20,
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                      cursor: "pointer",
                      boxShadow: "0 6px 18px rgba(2,6,23,0.04)",
                      transition: "transform .14s ease, box-shadow .14s ease"
                    }}
                    aria-label={`Open ${sm.supermodule_name}`}
                  >
                    <div style={{ color: "var(--primary)", fontWeight: 700, fontSize: 16 }}>{sm.supermodule_code}</div>
                    <div style={{ color: "var(--text-secondary)", marginTop: 8 }}>{sm.supermodule_name}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ padding: 30, borderRadius: 12, background: "var(--surface)", border: "1px dashed var(--border)" }}>
                <strong style={{ color: "var(--text-primary)" }}>No modules available yet.</strong>
                <div style={{ color: "var(--text-secondary)", marginTop: 8 }}>Check back later or contact your instructor.</div>
              </div>
            )}
          </>
        )}

        {!loading && viewLevel === "modules" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <button className="secondary" onClick={handleBackToSupermodules}>← Back</button>
              <h2 style={{ margin: 0 }}>{selectedSupermodule}</h2>
              <div />
            </div>

            {modules.length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 16
              }}>
                {modules.map((m) => (
                  <article key={m.submodule_code} style={{ borderRadius: 12, overflow: "hidden", background: "var(--surface)", border: "1px solid var(--border)" }}>
                    {m.image_path && (
                      <div style={{ width: "100%", height: 160, overflow: "hidden" }}>
                        <img src={`http://localhost:5000${m.image_path}`} alt={m.submodule_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    <div style={{ padding: 16 }}>
                      <h3 style={{ margin: 0, color: "var(--primary)" }}>{m.submodule_code}</h3>
                      <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>{m.submodule_name}</p>
                      <div style={{ marginTop: 12 }}>
                        <button onClick={() => handleModuleClick(m)} className="submit-button" style={{ padding: "10px 14px" }}>
                          Open videos & quizzes
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div style={{ padding: 30, borderRadius: 12, background: "var(--surface)", border: "1px dashed var(--border)" }}>
                <strong style={{ color: "var(--text-primary)" }}>No content yet for this module.</strong>
                <div style={{ color: "var(--text-secondary)", marginTop: 8 }}>Teacher hasn't uploaded videos/quizzes.</div>
              </div>
            )}
          </>
        )}

        {!loading && viewLevel === "sets" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <button className="secondary" onClick={handleBackToModules}>← Back</button>
              <div>
                <h2 style={{ margin: 0 }}>Quiz Sets - {selectedModule}</h2>
                <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>{selectedModuleName}</div>
              </div>
              <div />
            </div>

            {sets.length > 0 ? (
              <div style={{ display: "grid", gap: 12 }}>
                {sets.map((set) => {
                  const attempted = !!set.attempted;
                  const noReattempts = set.reattempts_allowed === false;
                  const blockReattempt = attempted && noReattempts;

                  return (
                    <div key={set.id} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 14,
                      borderRadius: 12,
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      gap: 12,
                      flexWrap: "wrap"
                    }}>
                      <div style={{ minWidth: 200, flex: 1 }}>
                        <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{set.name}</div>
                        <div style={{ color: "var(--text-secondary)", marginTop: 6 }}>
                          📝 {set.question_count} questions • Created {new Date(set.created_at).toLocaleDateString()}
                        </div>
                        {blockReattempt && <div style={{ marginTop: 8, display: "inline-block", padding: "6px 10px", background: "#fff7ed", color: "#92400e", borderRadius: 8, fontWeight: 600 }}>Attempted (no reattempts)</div>}
                      </div>

                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          onClick={() => handleStartQuiz(set.id, set.name)}
                          disabled={blockReattempt}
                          style={{
                            padding: "10px 14px",
                            background: blockReattempt ? "var(--surface-2)" : "var(--secondary)",
                            color: "white",
                            borderRadius: 10,
                            border: "none",
                            cursor: blockReattempt ? "not-allowed" : "pointer",
                            fontWeight: 700
                          }}
                        >
                          {blockReattempt ? "Attempted" : "Start Quiz"}
                        </button>

                        <button
                          onClick={() => handleShowResults(set.id)}
                          disabled={!attempted}
                          style={{
                            padding: "10px 14px",
                            background: attempted ? "var(--primary)" : "var(--surface-2)",
                            color: attempted ? "white" : "var(--text-secondary)",
                            borderRadius: 10,
                            border: "none",
                            cursor: attempted ? "pointer" : "not-allowed",
                            fontWeight: 700
                          }}
                        >
                          Results
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: 24, borderRadius: 12, background: "var(--surface)", border: "1px dashed var(--border)" }}>
                <strong style={{ color: "var(--text-primary)" }}>No quiz sets yet.</strong>
                <div style={{ color: "var(--text-secondary)", marginTop: 8 }}>Your teacher hasn't created quizzes for this topic.</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
