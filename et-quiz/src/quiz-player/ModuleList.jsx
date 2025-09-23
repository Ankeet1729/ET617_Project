// import React from "react";

// export default function ModuleList({ modules, onStart, scores }) {
//   return (
//     <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-8 w-full">
//       <h1 className="text-3xl font-bold text-[#0A72FF] mb-8 w-full text-center">Available Modules</h1>
//       <ul className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
//         {modules.map((mod) => (
//           <li key={mod.id} className="bg-white rounded-lg shadow p-6 flex flex-col gap-2 border border-[#E5E7EB]">
//             <div className="flex items-center justify-between">
//               <div className="text-lg font-semibold text-[#0F172A]">{mod.title}</div>
//               {scores && scores[mod.id] !== undefined && (
//                 <span className="ml-2 px-3 py-1 rounded-full bg-[#00C2A8] text-white text-xs font-semibold">Score: {scores[mod.id].score} / {scores[mod.id].total}</span>
//               )}
//             </div>
//             <div className="text-[#64748B] text-sm">{mod.desc}</div>
//             {scores && scores[mod.id] !== undefined ? (
//               <button
//                 className="mt-2 self-end px-4 py-2 rounded bg-[#0A72FF] text-white font-medium hover:bg-[#005bb5] focus:outline-none focus:ring-2 focus:ring-[#0A72FF] focus:ring-offset-2"
//                 onClick={() => onStart(mod)}
//                 aria-label={`Reattempt quiz for ${mod.title}`}
//               >
//                 Reattempt Quiz
//               </button>
//             ) : (
//               <button
//                 className="mt-2 self-end px-4 py-2 rounded bg-[#0A72FF] text-white font-medium hover:bg-[#005bb5] focus:outline-none focus:ring-2 focus:ring-[#0A72FF] focus:ring-offset-2"
//                 onClick={() => onStart(mod)}
//                 aria-label={`Start quiz for ${mod.title}`}
//               >
//                 Start Quiz
//               </button>
//             )}
//           </li>
//         ))}
//       </ul>
//     </main>
//   );
// }

// import React from "react";

// export default function ModuleList({ modules, onStart, scores }) {
//   return (
//     <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-12 w-full">
//       <h1 className="text-4xl font-bold text-[#0A72FF] mb-10 w-full text-center">
//         Available Modules
//       </h1>
//       <ul className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
//         {modules.map((mod) => (
//           <li
//             key={mod.id}
//             className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4 border border-[#E5E7EB]"
//           >
//             <div className="flex items-start justify-between">
//               <div className="text-lg lg:text-xl font-semibold text-[#0F172A]">
//                 {mod.title}
//               </div>
//               {scores && scores[mod.id] !== undefined && (
//                 <span className="ml-2 px-3 py-1 rounded-full bg-[#00C2A8] text-white text-xs lg:text-sm font-semibold">
//                   Score: {scores[mod.id].score} / {scores[mod.id].total}
//                 </span>
//               )}
//             </div>
//             <div className="text-[#64748B] text-sm lg:text-base flex-grow">
//               {mod.desc}
//             </div>
//             <button
//               className="mt-auto self-end px-5 py-2 rounded bg-[#0A72FF] text-white text-sm lg:text-base font-medium hover:bg-[#005bb5] focus:outline-none focus:ring-2 focus:ring-[#0A72FF]"
//               onClick={() => onStart(mod)}
//               aria-label={`Start or reattempt quiz for ${mod.title}`}
//             >
//               {scores && scores[mod.id] !== undefined ? "Reattempt Quiz" : "Start Quiz"}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </main>
//   );
// }

import React from "react";

export default function ModuleList({ modules, onStart, scores }) {
  return (
    <main className="min-h-screen bg-[#F8FAFC] py-12 w-full">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-[#0A72FF] mb-10 text-center">
          Available Modules
        </h1>
        <ul className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((mod) => (
            <li
              key={mod.id}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4 border border-[#E5E7EB]"
            >
              <div className="flex items-start justify-between">
                <div className="text-lg lg:text-xl font-semibold text-[#0F172A]">
                  {mod.title}
                </div>
                {scores && scores[mod.id] !== undefined && (
                  <span className="ml-2 px-3 py-1 rounded-full bg-[#00C2A8] text-white text-xs lg:text-sm font-semibold">
                    Score: {scores[mod.id].score} / {scores[mod.id].total}
                  </span>
                )}
              </div>
              <div className="text-[#64748B] text-sm lg:text-base flex-grow">
                {mod.desc}
              </div>
              <button
                className="mt-auto self-end px-5 py-2 rounded bg-[#0A72FF] text-white text-sm lg:text-base font-medium hover:bg-[#005bb5] focus:outline-none focus:ring-2 focus:ring-[#0A72FF]"
                onClick={() => onStart(mod)}
                aria-label={`Start or reattempt quiz for ${mod.title}`}
              >
                {scores && scores[mod.id] !== undefined ? "Reattempt Quiz" : "Start Quiz"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
