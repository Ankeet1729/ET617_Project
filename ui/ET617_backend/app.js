import express from "express";
import cors from "cors";
import session from "express-session";
// import connectPgSimple from "connect-pg-simple";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pool from "./db.js"; // note: add `.js` extension for ESM

dotenv.config();

// const { GoogleGenerativeAI } = pkg;
const app = express();

// const PgSession = connectPgSimple(session);

app.use(session({
  secret: process.env.SESSION_SECRET || "your_secret_here",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set true if using HTTPS
}));


// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

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

// Function to generate quiz using Gemini AI
async function generateQuizWithGemini(transcript, grade, no_of_mcq = 7, no_of_tf = 3) {
  const prompt = `
You are an expert in educational psychology and curriculum design. 
Your task is to generate a pedagogically sound quiz from the provided learning material,
keeping the learner's cognitive development in mind.

### Input Parameters
1. Grade Level: ${grade}
2. Transcript: Provided at the end.

### Instructions
1.  Read the entire transcript to understand the core concepts.
2.  Generate a quiz with exactly:
    - ${no_of_mcq} Multiple Choice Questions (4 options each, one correct).
    - ${no_of_tf} True/False Questions.
3.  **Grade-Level Adaptation (Based on NEP 5+3+3+4 System):**
    - **foundational (Grades 1-2):** Use very simple language. Questions should be direct and concrete. Focus on "Remembering."
    - **preparatory (Grades 3-5):** Use simple, clear language. Introduce questions that require basic "Understanding" and connections.
    - **middle (Grades 6-8):** Use standard terminology. Questions should test "Application" of concepts and basic "Analysis."
    - **secondary (Grades 9-12):** Use precise, academic language. Questions should challenge learners with "Analysis," "Evaluation," and synthesis of information.
4.  **Cognitive Diversity (Based on Bloom's Taxonomy):**
    - Structure the quiz to have a gradual increase in cognitive demand.
    - Start with Lower-Order Thinking Skills (LOTS) and move to Higher-Order Thinking Skills (HOTS).
    - Distribute questions across these levels as appropriate for the grade:
        - **Remembering:** Recalling facts and basic concepts.
        - **Understanding:** Explaining ideas or concepts.
        - **Applying:** Using information in new situations.
        - **Analyzing:** Drawing connections among ideas.
        - **Evaluating:** Justifying a stand or decision.
5.  **Question Quality:**
    - Ensure questions are unambiguous and directly based on the transcript's terminology.
    - The goal is to test comprehension and critical thinking, not just rote memorization.
6.  Provide a concise explanation for each answer, referencing the core concept from the transcript.
7. No need to put A., B., C., D. before options in MCQs output.
8. Also have a field called "needs_image" in each question object, set it to true if the question would benefit from an accompanying image, else false.
10. At the start of the transcript it will be mentioned from which part to which part of the transcript the quiz should be generated, example: "<Snippet 1> ... <Snippet 2>". So you should only generate the quiz for the part between <Snippet 1> and <Snippet 2>, but keep the context of the entire transcript.

### Output Format (Strict JSON)
{
  "multiple_choice": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": "B",
      "explanation": "...",
      "bloom_level": "Remembering",
      "concept": "...", 
      "needs_image": false,
      "grade": grade_level
    }
  ],
  "true_false": [
    {
      "question": "...",
      "answer": "True",
      "explanation": "...",
      "bloom_level": "Understanding",
      "concept": "...",
      "needs_image": true,
      "grade": grade_level
    }
  ]
}

### Important points to be noted
1.  Do not explicitly mention the word "transcript" in any question or answer or explanation. Think of it like a student sees the video and then directly sees the questions.
2.  In one or two words, mention the concept tested from the video/transcript under "concept" in json.
3.  Include 60% of the questions from "apply" and above from Bloom's Taxonomy. [i.e. apply, analyze, evaluate, create/synthesize]
### Transcript:
${transcript}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.slice(7, -3);
    
    // Parse the JSON response
    const quizData = JSON.parse(text);
    return quizData;
  } catch (error) {
    console.error('Error generating quiz with Gemini:', error);
    throw new Error('Failed to generate quiz');
  }
}

app.post('/register', async (req, res) => {
  const { username, email, password, grade } = req.body;
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
      "INSERT INTO users (username, password_hash, email, grade) VALUES ($1, $2, $3, $4)",
      [username, password_hash, email, grade]
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

    req.session.username = user.username;

    res.json({ 
      message: "Login successful!", 
      user: { 
      username, 
      email: user.email, 
      grade: user.grade 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/modules', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT quiz_id, module
      FROM transcript 
      ORDER BY module, quiz_id
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "No transcript data found in the database"
      });
    }

    console.log('Raw transcript data fetched successfully from database');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching transcript data from database:', err);
    res.status(500).json({ 
      error: "Internal server error while fetching transcript data" 
    });
  }
});

app.post('/api/generate_quiz', async (req, res) => {
  const { quiz_id, grade } = req.body;

  // Check if there is any quiz associated with the user
  try {
    const existingQuiz = await pool.query(
      "SELECT * FROM quiz WHERE username = $1",
      [req.session.username]
    );

    if (existingQuiz.rows.length > 0) {
      // Delete the existing quiz associated with the user
      await pool.query(
        "DELETE FROM quiz WHERE username = $1",
        [req.session.username]
      );
      console.log(`Deleted existing quiz for user: ${req.session.username}`);
    }
  } catch (err) {
    console.error('Error checking or deleting existing quiz:', err);
    return res.status(500).json({ 
      error: "Internal server error while checking or deleting existing quiz" 
    });
  }
  
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
    // Fetch transcript from database
    const transcriptResult = await pool.query(
      "SELECT transcript FROM transcript WHERE quiz_id = $1",
      [quiz_id]
    );

    if (transcriptResult.rows.length === 0) {
      return res.status(404).json({
        error: `No transcript found for quiz_id: ${quiz_id}`
      });
    }

    const transcript = transcriptResult.rows[0].transcript;
    
    // Map grade to NEP format
    const gradeMapping = {
      "1": "foundational", "2": "foundational",
      "3": "preparatory", "4": "preparatory", "5": "preparatory",
      "6": "middle", "7": "middle", "8": "middle",
      "9": "secondary", "10": "secondary", "11": "secondary", "12": "secondary",
      "null": "null"
    };
    
    // Retrieve the user's grade level from the login details
    const result = await pool.query(
      "SELECT grade FROM users WHERE username = $1",
      [req.session.username]
    );
    
    const nepGrade = result.rows[0]?.grade;
    
    // Generate quiz using Gemini AI
    console.log(`Generating quiz for Quiz ID: ${quiz_id}, Grade: ${grade} (${nepGrade})`);
    const quizData = await generateQuizWithGemini(transcript, nepGrade, 7, 3);

    try {
      await pool.query(
        "INSERT INTO quiz (username, quiz_data) VALUES ($1, $2)",
        [req.session.username, JSON.stringify(quizData)]
      )
    }
    catch (err) {
      console.error('Error saving quiz data to database:', err);
    }
    
    // Remove explanations from the response (will be shown after submission)
    const quizWithoutExplanations = {
      multiple_choice: quizData.multiple_choice.map(q => ({
        question: q.question,
        options: q.options,
        answer: q.answer,
        bloom_level: q.bloom_level,
        concept: q.concept,
        needs_image: q.needs_image,
        grade: q.grade
      })),
      true_false: quizData.true_false.map(q => ({
        question: q.question,
        answer: q.answer,
        bloom_level: q.bloom_level,
        concept: q.concept,
        needs_image: q.needs_image,
        grade: q.grade
      }))
    };

    // Log the successful generation
    console.log(`Quiz generated successfully - Quiz ID: ${quiz_id}, Grade: ${grade}`);
    
    res.json(quizWithoutExplanations);
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
    // Fetch transcript from database and regenerate quiz for evaluation
    const transcriptResult = await pool.query(
      "SELECT transcript FROM transcript WHERE quiz_id = $1",
      [quiz_id]
    );

    if (transcriptResult.rows.length === 0) {
      return res.status(404).json({
        error: `No transcript found for quiz_id: ${quiz_id}`
      });
    }

    const transcript = transcriptResult.rows[0].transcript;
    
    // Map grade to NEP format
    const gradeMapping = {
      "1": "foundational", "2": "foundational",
      "3": "preparatory", "4": "preparatory", "5": "preparatory",
      "6": "middle", "7": "middle", "8": "middle",
      "9": "secondary", "10": "secondary", "11": "secondary", "12": "secondary"
    };
    
    const nepGrade = gradeMapping[grade] || "middle";
    
    // Generate quiz with explanations for evaluation
    console.log(`Evaluating quiz for Quiz ID: ${quiz_id}, Grade: ${grade} (${nepGrade})`);
    // Fetch quiz data from the database for the logged-in user
    const quizResult = await pool.query(
      "SELECT quiz_data FROM quiz WHERE username = $1",
      [req.session.username]
    );

    if (quizResult.rows.length === 0) {
      return res.status(404).json({
        error: `No quiz data found for the user: ${req.session.username}`
      });
    }

    // Parse the quiz data
    const quizData = JSON.parse(quizResult.rows[0].quiz_data);

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

    // Delete the quiz entry from the database
    await pool.query(
      "DELETE FROM quiz WHERE username = $1",
      [req.session.username, quiz_id]
    );

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

app.post('/logout', (req, res) => {
  if (req.session) {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ error: 'Failed to log out. Please try again.' });
      }

      // Clear the session cookie
      res.clearCookie('connect.sid'); // Replace 'connect.sid' with your session cookie name if different
      return res.status(200).json({ message: 'Logged out successfully.' });
    });
  } else {
    return res.status(400).json({ error: 'No active session to log out from.' });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
