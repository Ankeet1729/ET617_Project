const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const pool = require('./db');

const app = express();

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000', 
      'http://localhost:5173', 
      'http://127.0.0.1:3000', 
      'http://127.0.0.1:5173'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Add logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} from ${req.get('Origin') || 'no-origin'}`);
  next();
});

app.use(express.json());

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const password_hash = await bcrypt.hash(password, 10);
  const userExists = await pool.query(
    "SELECT * FROM users WHERE username = $1 OR email = $2",
    [username, email]
  );
  if (userExists.rows.length > 0) {
    return res.status(400).json({ error: "User already exists." });
  }
  try {
    await pool.query(
      "INSERT INTO users (username, password_hash, email) VALUES ($1, $2, $3)",
      [username, password_hash, email]
    );
    res.status(201).json({ message: "User registered!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (result.rows.length === 0)
      return res.status(401).json({ error: "No user found." });
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ error: "Invalid password." });
    res.json({ message: "Login successful!", user: { username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/generate_quiz', async (req, res) => {
  const { quiz_id, grade } = req.body;
  
  // Validate required parameters
  if (!quiz_id || !grade) {
    return res.status(400).json({ 
      error: "Missing required parameters: quiz_id and grade are required" 
    });
  }

  // Validate quiz_id is a number starting from 1
  if (typeof quiz_id !== 'number' || quiz_id < 1) {
    return res.status(400).json({ 
      error: "quiz_id must be a number starting from 1" 
    });
  }

  // Validate grade is a string
  if (typeof grade !== 'string') {
    return res.status(400).json({ 
      error: "grade must be a string" 
    });
  }

  try {
    // Placeholder quiz data without explanations (explanations will be shown after submission)
    const placeholderQuiz = {
      multiple_choice: [
        {
          question: `What is the primary focus of Module ${Math.ceil(quiz_id / 3)}?`,
          options: [
            "Option A - Basic concepts",
            "Option B - Advanced topics", 
            "Option C - Practical applications",
            "Option D - Theoretical foundations"
          ],
          answer: "Option A - Basic concepts",
          bloom_level: "Remembering",
          concept: `Module ${Math.ceil(quiz_id / 3)} Core Concept`,
          needs_image: false,
          grade: parseInt(grade) || 8
        },
        {
          question: `Which statement best describes the learning outcome for Quiz ${quiz_id}?`,
          options: [
            "Students will memorize facts",
            "Students will analyze complex problems",
            "Students will create original solutions",
            "Students will evaluate different approaches"
          ],
          answer: "Students will analyze complex problems",
          bloom_level: "Analyzing",
          concept: `Quiz ${quiz_id} Learning Outcome`,
          needs_image: true,
          grade: parseInt(grade) || 8
        }
      ],
      true_false: [
        {
          question: `Module ${Math.ceil(quiz_id / 3)} covers advanced mathematical concepts.`,
          answer: "True",
          bloom_level: "Understanding",
          concept: `Module ${Math.ceil(quiz_id / 3)} Content`,
          needs_image: false,
          grade: parseInt(grade) || 8
        },
        {
          question: `Quiz ${quiz_id} is designed for students at grade level ${grade}.`,
          answer: "True",
          bloom_level: "Remembering",
          concept: "Grade Appropriateness",
          needs_image: true,
          grade: parseInt(grade) || 8
        }
      ]
    };

    // Log the request for debugging
    console.log(`Quiz generation requested - Quiz ID: ${quiz_id}, Grade: ${grade}`);
    
    res.json(placeholderQuiz);
  } catch (err) {
    console.error('Error generating quiz:', err);
    res.status(500).json({ 
      error: "Internal server error while generating quiz" 
    });
  }
});

app.post('/api/evaluate_quiz', async (req, res) => {
  const { quiz_id, answers, grade } = req.body;
  
  // Validate required parameters
  if (!quiz_id || !answers || !grade) {
    return res.status(400).json({ 
      error: "Missing required parameters: quiz_id, answers, and grade are required" 
    });
  }

  // Validate quiz_id is a number starting from 1
  if (typeof quiz_id !== 'number' || quiz_id < 1) {
    return res.status(400).json({ 
      error: "quiz_id must be a number starting from 1" 
    });
  }

  try {
    // Generate the same quiz data for evaluation (in real app, this would come from database)
    const quizData = {
      multiple_choice: [
        {
          question: `What is the primary focus of Module ${Math.ceil(quiz_id / 3)}?`,
          options: [
            "Option A - Basic concepts",
            "Option B - Advanced topics", 
            "Option C - Practical applications",
            "Option D - Theoretical foundations"
          ],
          answer: "Option A - Basic concepts",
          explanation: "This question tests your understanding of the module's primary learning objectives.",
          bloom_level: "Remembering",
          concept: `Module ${Math.ceil(quiz_id / 3)} Core Concept`,
          needs_image: false,
          grade: parseInt(grade) || 8
        },
        {
          question: `Which statement best describes the learning outcome for Quiz ${quiz_id}?`,
          options: [
            "Students will memorize facts",
            "Students will analyze complex problems",
            "Students will create original solutions",
            "Students will evaluate different approaches"
          ],
          answer: "Students will analyze complex problems",
          explanation: "This quiz focuses on analytical thinking and problem-solving skills.",
          bloom_level: "Analyzing",
          concept: `Quiz ${quiz_id} Learning Outcome`,
          needs_image: true,
          grade: parseInt(grade) || 8
        }
      ],
      true_false: [
        {
          question: `Module ${Math.ceil(quiz_id / 3)} covers advanced mathematical concepts.`,
          answer: "True",
          explanation: "This module includes both basic and advanced mathematical principles relevant to the curriculum.",
          bloom_level: "Understanding",
          concept: `Module ${Math.ceil(quiz_id / 3)} Content`,
          needs_image: false,
          grade: parseInt(grade) || 8
        },
        {
          question: `Quiz ${quiz_id} is designed for students at grade level ${grade}.`,
          answer: "True",
          explanation: `This quiz has been specifically tailored for ${grade}th grade students' cognitive development.`,
          bloom_level: "Remembering",
          concept: "Grade Appropriateness",
          needs_image: true,
          grade: parseInt(grade) || 8
        }
      ]
    };

    // Evaluate answers
    const allQuestions = [
      ...quizData.multiple_choice.map((q, i) => ({ ...q, type: 'multiple_choice', id: `mc_${i}` })),
      ...quizData.true_false.map((q, i) => ({ ...q, type: 'true_false', id: `tf_${i}` }))
    ];

    let correctCount = 0;
    const detailedResults = allQuestions.map((question, index) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.answer;
      if (isCorrect) correctCount++;
      
      return {
        questionIndex: index + 1,
        question: question.question,
        userAnswer: userAnswer || "Not answered",
        correctAnswer: question.answer,
        isCorrect: isCorrect,
        explanation: question.explanation,
        bloom_level: question.bloom_level,
        concept: question.concept,
        type: question.type,
        needs_image: question.needs_image
      };
    });

    const totalQuestions = allQuestions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    
    // Determine grade level
    let gradeLevel = "Needs Improvement";
    if (percentage >= 90) gradeLevel = "Excellent";
    else if (percentage >= 80) gradeLevel = "Good";
    else if (percentage >= 70) gradeLevel = "Satisfactory";
    else if (percentage >= 60) gradeLevel = "Below Average";

    const evaluationResult = {
      quiz_id: quiz_id,
      totalQuestions: totalQuestions,
      correctAnswers: correctCount,
      percentage: percentage,
      gradeLevel: gradeLevel,
      results: detailedResults,
      submittedAt: new Date().toISOString()
    };

    // Log the evaluation for debugging
    console.log(`Quiz evaluation completed - Quiz ID: ${quiz_id}, Score: ${percentage}%`);
    
    res.json(evaluationResult);
  } catch (err) {
    console.error('Error evaluating quiz:', err);
    res.status(500).json({ 
      error: "Internal server error while evaluating quiz" 
    });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
