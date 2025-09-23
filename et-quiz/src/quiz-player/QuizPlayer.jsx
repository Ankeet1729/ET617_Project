// import React, { useState, useRef, useEffect } from "react";

// function ProgressBar({ current, total }) {
//   const percent = Math.round((current / total) * 100);
//   return (
//     <div className="w-full h-2 bg-[#E5E7EB] rounded">
//       <div
//         className="h-2 bg-[#0A72FF] rounded"
//         style={{ width: `${percent}%` }}
//         role="progressbar"
//         aria-valuenow={percent}
//         aria-valuemin={0}
//         aria-valuemax={100}
//         aria-label="Quiz progress"
//       />
//     </div>
//   );
// }

// function OptionCard({ option, image, selected, onSelect, disabled, index, total, isLast, optionId }) {
//   return (
//     <li
//       className={`relative flex flex-col items-center border rounded-lg p-4 mb-3 cursor-pointer transition-all outline-none focus:ring-2 focus:ring-[#0A72FF] ${
//         selected ? "border-[#0A72FF] shadow-lg" : "border-[#E5E7EB]"
//       } ${disabled ? "opacity-60 pointer-events-none" : "hover:shadow"}`}
//       tabIndex={0}
//       role="radio"
//       aria-checked={selected}
//       aria-disabled={disabled}
//       onClick={onSelect}
//       onKeyDown={e => {
//         if (e.key === "Enter" || e.key === " ") onSelect();
//       }}
//       id={optionId}
//     >
//       {image && (
//         <img
//           src={image}
//           alt={option}
//           className="w-10 h-10 object-contain mb-2"
//           onError={e => (e.target.style.display = "none")}
//         />
//       )}
//       <span className="text-lg text-[#0F172A] font-medium">{option}</span>
//       {selected && (
//         <span className="absolute top-2 right-2 text-[#0A72FF]" aria-label="Selected">✔</span>
//       )}
//     </li>
//   );
// }

// export default function QuizPlayer({ module, quiz, onBack, onSubmit }) {
//   const [current, setCurrent] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [showFull, setShowFull] = useState(false);
//   const questionRef = useRef();
//   const total = quiz.length;
//   const q = quiz[current];
//   const selected = answers[current];

//   useEffect(() => {
//     if (questionRef.current) questionRef.current.focus();
//   }, [current]);

//   // Keyboard navigation
//   useEffect(() => {
//     const handler = e => {
//       if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
//       if (e.key === "ArrowRight" && current < total - 1) setCurrent(c => c + 1);
//       if (e.key === "ArrowLeft" && current > 0) setCurrent(c => c - 1);
//       if (/^[1-4]$/.test(e.key) && q.options[parseInt(e.key) - 1]) {
//         setAnswers(a => ({ ...a, [current]: q.options[parseInt(e.key) - 1] }));
//       }
//     };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [current, total, q.options]);

//   const handleSelect = opt => setAnswers(a => ({ ...a, [current]: opt }));

//   // Truncate question text if needed
//   const isLong = q.question.length > 120;
//   const displayText = !showFull && isLong ? q.question.slice(0, 120) + "..." : q.question;

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center w-full">
//       <main className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-10 my-8 flex flex-col justify-between">
//         {/* Top bar */}
//         <header className="w-full flex items-center justify-between px-2 mb-2">
//           <button
//             onClick={onBack}
//             className="text-[#0A72FF] font-medium px-2 py-1 rounded hover:underline focus:outline-none"
//             aria-label="Back to module list"
//           >
//             ← {module.title}
//           </button>
//           <div className="text-[#64748B] text-sm mx-auto">
//             {current + 1}/{total}
//           </div>
//         </header>
//         <div className="w-full px-2 mb-2">
//           <ProgressBar current={current + 1} total={total} />
//         </div>
//         {/* Question */}
//         <section
//           ref={questionRef}
//           tabIndex={-1}
//           className="w-full bg-white rounded-lg p-6 mb-2 outline-none"
//           aria-label={`Question ${current + 1}`}
//         >
//           <div className="flex items-center justify-between mb-4">
//             <span className="text-xl font-bold text-[#0F172A]" style={{ lineHeight: 1.2 }}>
//               {displayText}
//             </span>
//             {isLong && !showFull && (
//               <button
//                 className="ml-2 text-[#0A72FF] underline text-sm"
//                 onClick={() => setShowFull(true)}
//                 aria-label="Show full question"
//               >
//                 Show full
//               </button>
//             )}
//           </div>
//           <form
//             className="mt-2"
//             onSubmit={e => {
//               e.preventDefault();
//               if (current < total - 1) setCurrent(c => c + 1);
//             }}
//           >
//             <fieldset className="border-0 p-0" aria-label="Options">
//               <legend className="sr-only">Options</legend>
//               <ul className="grid grid-cols-1 gap-2" role="radiogroup" aria-label="Answer options">
//                 {q.options.map((opt, i) => (
//                   <OptionCard
//                     key={opt}
//                     option={opt}
//                     image={q.option_images && q.option_images[opt]}
//                     selected={selected === opt}
//                     onSelect={() => handleSelect(opt)}
//                     disabled={false}
//                     index={i}
//                     total={q.options.length}
//                     isLast={i === q.options.length - 1}
//                     optionId={`option-${i}`}
//                   />
//                 ))}
//               </ul>
//             </fieldset>
//           </form>
//         </section>
//         {/* Controls */}
//         <div className="w-full flex justify-between items-center px-2">
//           <button
//             onClick={() => setCurrent(c => Math.max(0, c - 1))}
//             disabled={current === 0}
//             className="px-4 py-2 rounded bg-[#E5E7EB] text-[#64748B] font-medium disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#0A72FF]"
//           >
//             Prev
//           </button>
//           <button
//             onClick={() => {
//               if (current < total - 1) setCurrent(c => c + 1);
//             }}
//             disabled={!selected || current === total - 1}
//             className="px-4 py-2 rounded bg-[#0A72FF] text-white font-medium disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#0A72FF]"
//           >
//             Next
//           </button>
//           <button
//             onClick={() => onSubmit(answers)}
//             className="px-4 py-2 rounded bg-[#00C2A8] text-white font-medium ml-2 focus:outline-none focus:ring-2 focus:ring-[#00C2A8]"
//           >
//             Save & Finish
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }


import React, { useState, useRef, useEffect } from "react";

function ProgressBar({ current, total }) {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="w-full h-2 bg-[#E5E7EB] rounded">
      <div
        className="h-2 bg-[#0A72FF] rounded"
        style={{ width: `${percent}%` }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Quiz progress"
      />
    </div>
  );
}

function OptionCard({ option, image, selected, onSelect, disabled, optionId }) {
  return (
    <li
      className={`relative flex flex-col items-center border rounded-lg p-4 cursor-pointer transition-all outline-none focus:ring-2 focus:ring-[#0A72FF] ${
        selected ? "border-[#0A72FF] shadow-lg" : "border-[#E5E7EB]"
      } ${disabled ? "opacity-60 pointer-events-none" : "hover:shadow"}`}
      tabIndex={0}
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      id={optionId}
    >
      {image && (
        <img
          src={image}
          alt={option}
          className="w-10 h-10 lg:w-16 lg:h-16 object-contain mb-2"
          onError={(e) => (e.target.style.display = "none")}
        />
      )}
      <span className="text-lg lg:text-xl text-[#0F172A] font-medium text-center">
        {option}
      </span>
      {selected && (
        <span className="absolute top-2 right-2 text-[#0A72FF]" aria-label="Selected">
          ✔
        </span>
      )}
    </li>
  );
}

export default function QuizPlayer({ module, quiz, onBack, onSubmit }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFull, setShowFull] = useState(false);
  const questionRef = useRef();
  const total = quiz.length;
  const q = quiz[current];
  const selected = answers[current];

  useEffect(() => {
    if (questionRef.current) questionRef.current.focus();
  }, [current]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight" && current < total - 1) setCurrent((c) => c + 1);
      if (e.key === "ArrowLeft" && current > 0) setCurrent((c) => c - 1);
      if (/^[1-4]$/.test(e.key) && q.options[parseInt(e.key) - 1]) {
        setAnswers((a) => ({ ...a, [current]: q.options[parseInt(e.key) - 1] }));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, total, q.options]);

  const handleSelect = (opt) => setAnswers((a) => ({ ...a, [current]: opt }));

  // Truncate question text if needed
  const isLong = q.question.length > 120;
  const displayText = !showFull && isLong ? q.question.slice(0, 120) + "..." : q.question;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center w-full py-8">
      <main className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-10 my-4">
        {/* Top bar */}
        <header className="w-full flex items-center justify-between px-2 mb-4">
          <button
            onClick={onBack}
            className="text-[#0A72FF] font-medium px-2 py-1 rounded hover:underline focus:outline-none"
            aria-label="Back to module list"
          >
            ← {module.title}
          </button>
          <div className="text-[#64748B] text-base">
            {current + 1}/{total}
          </div>
        </header>
        <div className="w-full px-2 mb-6">
          <ProgressBar current={current + 1} total={total} />
        </div>

        {/* Question + Options side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Question */}
          <section
            ref={questionRef}
            tabIndex={-1}
            className="bg-white rounded-lg p-6 outline-none"
            aria-label={`Question ${current + 1}`}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-xl lg:text-2xl font-bold text-[#0F172A]">
                {displayText}
              </span>
              {isLong && !showFull && (
                <button
                  className="ml-2 text-[#0A72FF] underline text-sm"
                  onClick={() => setShowFull(true)}
                  aria-label="Show full question"
                >
                  Show full
                </button>
              )}
            </div>
          </section>

          {/* Options */}
          <section className="bg-white rounded-lg p-6">
            <form
              className="mt-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (current < total - 1) setCurrent((c) => c + 1);
              }}
            >
              <fieldset className="border-0 p-0" aria-label="Options">
                <legend className="sr-only">Options</legend>
                <ul
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                  role="radiogroup"
                  aria-label="Answer options"
                >
                  {q.options.map((opt, i) => (
                    <OptionCard
                      key={opt}
                      option={opt}
                      image={q.option_images && q.option_images[opt]}
                      selected={selected === opt}
                      onSelect={() => handleSelect(opt)}
                      disabled={false}
                      optionId={`option-${i}`}
                    />
                  ))}
                </ul>
              </fieldset>
            </form>
          </section>
        </div>

        {/* Controls */}
        <div className="w-full flex justify-end gap-3 mt-8">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="px-4 py-2 rounded bg-[#E5E7EB] text-[#64748B] font-medium disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => {
              if (current < total - 1) setCurrent((c) => c + 1);
            }}
            disabled={!selected || current === total - 1}
            className="px-4 py-2 rounded bg-[#0A72FF] text-white font-medium disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => onSubmit(answers)}
            className="px-4 py-2 rounded bg-[#00C2A8] text-white font-medium"
          >
            Save & Finish
          </button>
        </div>
      </main>
    </div>
  );
}
