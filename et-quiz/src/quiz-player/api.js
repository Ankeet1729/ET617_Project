// quiz-player/api.js

// Mock student object
export const testStudent = { id: "test-1", grade: "middle", locale: "en-IN" };

// Mock modules
const modules = [
  {
    id: "module-1",
    title: "Intro to Scratch",
    desc: "Basic coding concepts",
    quiz_url: "/api/module_quiz-1"
  },
  {
    id: "module-2",
    title: "Geometry Patterns",
    desc: "Shapes and loops",
    quiz_url: "/api/module_quiz-2"
  }
];

// Mock quizzes
const quizzes = {
  "module-1": {
    multiple_choice: [
      {
        question: "What is Scratch?",
        options: ["A programming language", "A fruit", "A dance", "A car"],
        answer: "A programming language",
        explanation: "Scratch is a block-based programming language.",
        bloom_level: "Remembering",
        option_images: {
          "A programming language": "/images/scratch_lang.png"
        }
      }
    ],
    true_false: [
      {
        question: "Scratch is used for coding.",
        options: ["True", "False"],
        answer: "True",
        explanation: "Scratch is a coding tool.",
        bloom_level: "Remembering"
      }
    ]
  },
  "module-2": {
    multiple_choice: [
      {
        question: "What shape has 3 sides?",
        options: ["Triangle", "Square", "Circle", "Hexagon"],
        answer: "Triangle",
        explanation: "A triangle has 3 sides.",
        bloom_level: "Remembering"
      }
    ],
    true_false: []
  }
};

export function fetchModules() {
  return new Promise(resolve => setTimeout(() => resolve(modules), 300));
}

// Loads module-1 from the transcript_official/module_quiz-1.json file in the parent project
export function fetchQuiz(moduleId, grade, locale) {
  if (moduleId === "module-1") {
    // Vite will copy public assets from public/; so place the JSON in public/transcript_official/module_quiz-1.json
    return fetch("/transcript_official/module_quiz-1.json")
      .then(res => res.json())
      .catch(() => { throw new Error("Failed to load quiz JSON"); });
  }
  // fallback for other modules (mock)
  return Promise.reject(new Error("Quiz not found for this module"));
}

export function generateOptionImage({ module_id, question_index, option_text, student }) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ image_url: "/images/placeholder.png" });
    }, 200);
  });
}

// Utility to normalize quiz JSON
export function normalizeQuiz(quizJson) {
  const mcqs = (quizJson.multiple_choice || []).map(q => ({
    type: "mcq",
    question: q.question,
    options: q.options,
    correct: q.answer,
    explanation: q.explanation,
    bloom_level: q.bloom_level,
    option_images: q.option_images || {}
  }));
  const tfs = (quizJson.true_false || []).map(q => ({
    type: "tf",
    question: q.question,
    options: ["True", "False"],
    correct: q.answer,
    explanation: q.explanation,
    bloom_level: q.bloom_level
  }));
  return [...mcqs, ...tfs];
}
