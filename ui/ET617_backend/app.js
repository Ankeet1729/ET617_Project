import express from "express";
import cors from "cors";
import session from "express-session";
// import connectPgSimple from "connect-pg-simple";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pool from "./db.js"; // note: add `.js` extension for ESM
import multer from 'multer';  // NEW: For image uploads
import path from 'path';      // NEW: For file handling
import fs from 'fs';          // NEW: For directory checks

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
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

// NEW: Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// NEW: Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Function to generate quiz using Gemini AI (YOUR EXISTING - UNCHANGED)
async function generateQuizWithGemini(transcript, grade, no_of_mcq = 7, no_of_tf = 3) {
  const prompt = `
You are an expert in educational psychology and curriculum design.
Your task is to generate a pedagogically sound quiz from the provided learning material,
keeping the learner's cognitive development in mind.

### Input Parameters
1. Grade Level: ${grade}
2. Transcript: Provided at the end.

### Instructions
1. Read the entire transcript to understand the core concepts.
2. Generate a quiz with exactly:
   - ${no_of_mcq} Multiple Choice Questions (4 options each, one correct).
   - ${no_of_tf} True/False Questions.

3. **Grade-Level Adaptation (Based on NEP 5+3+3+4 System):**
   - **foundational (Grades 1-2):** Use very simple language. Questions should be direct and concrete. Focus on "Remembering."
   - **preparatory (Grades 3-5):** Use simple, clear language. Introduce questions that require basic "Understanding" and connections.
   - **middle (Grades 6-8):** Use standard terminology. Questions should test "Application" of concepts and basic "Analysis."
   - **secondary (Grades 9-12):** Use precise, academic language. Questions should challenge learners with "Analysis," "Evaluation," and synthesis of information.

4. **Cognitive Diversity (Based on Bloom's Taxonomy):**
   - Structure the quiz to have a gradual increase in cognitive demand.
   - Start with Lower-Order Thinking Skills (LOTS) and move to Higher-Order Thinking Skills (HOTS).
   - Distribute questions across these levels as appropriate for the grade:
     - **Remembering:** Recalling facts and basic concepts.
     - **Understanding:** Explaining ideas or concepts.
     - **Applying:** Using information in new situations.
     - **Analyzing:** Drawing connections among ideas.
     - **Evaluating:** Justifying a stand or decision.

5. **Question Quality:**
   - Ensure questions are unambiguous and directly based on the transcript's terminology.
   - The goal is to test comprehension and critical thinking, not just rote memorization.

6. Provide a concise explanation for each answer, referencing the core concept from the transcript.

7. No need to put A., B., C., D. before options in MCQs output.

8. Also have a field called "needs_image" in each question object, set it to true if the question would benefit from an accompanying image, else false.

10. At the start of the transcript it will be mentioned from which part to which part of the transcript the quiz should be generated, example: "<start_time>X</start_time> <end_time>Y</end_time> ... ". So you should only generate the quiz for the part between <start_time> and <end_time>, but keep the context of the entire transcript.

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
1. Do not explicitly mention the word "transcript" in any question or answer or explanation. Think of it like a student sees the video and then directly sees the questions.
2. In one or two words, mention the concept tested from the video/transcript under "concept" in json.
3. Include 60% of the questions from "apply" and above from Bloom's Taxonomy. [i.e. apply, analyze, evaluate, create/synthesize]

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

// NEW: Helper to get next set_index
async function getNextSetIndex(grade, module) {
  const result = await pool.query(
    'SELECT COALESCE(MAX(set_index), 0) as max_index FROM quiz_sets WHERE grade = $1 AND module = $2',
    [grade, module]
  );
  return (parseFloat(result.rows[0].max_index) + 0.1).toFixed(1);
}

// NEW: Helper for NEP grade mapping
function getNepGrade(grade) {
  const mapping = {
    '1': 'foundational', '2': 'foundational',
    '3': 'preparatory', '4': 'preparatory', '5': 'preparatory',
    '6': 'middle', '7': 'middle', '8': 'middle',
    '9': 'secondary', '10': 'secondary', '11': 'secondary', '12': 'secondary'
  };
  return mapping[String(grade)] || 'middle';
}

// YOUR EXISTING ROUTES (UNCHANGED)
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
    console.log("Grade: " + user.grade);

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

// REMOVED: /api/generate_quiz route (replaced by new teacher-side creation + student fetch)
// NEW: Student endpoint to get available sets for a grade/module
app.get('/api/student/quiz_sets/:grade/:module', async (req, res) => {
  const { grade, module } = req.params;
  try {
    const result = await pool.query(
      'SELECT set_index, created_at, questions FROM quiz_sets WHERE grade = $1 AND module = $2 AND is_hidden = FALSE ORDER BY set_index DESC',
      [parseInt(grade), parseInt(module)]
    );
    
    // Return simplified data (without explanations, just metadata)
    const sets = result.rows.map(row => ({
      set_index: row.set_index,
      question_count: Array.isArray(row.questions) ? row.questions.length : 0,
      created_at: row.created_at
    }));
    
    res.json(sets);
  } catch (error) {
    console.error('Error fetching student sets:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// NEW: Student fetch quiz from pre-created sets
app.get('/api/fetch_quiz', async (req, res) => {
  const { grade, module, set_index } = req.query;
  
  if (!grade || !module) {
    return res.status(400).json({ error: 'Grade and module required' });
  }

  try {
    let query = 'SELECT id, set_index, questions FROM quiz_sets WHERE grade = $1 AND module = $2 AND is_hidden = FALSE';
    const params = [parseInt(grade), parseInt(module)];
    
    if (set_index) {
      query += ' AND set_index = $3';
      params.push(parseFloat(set_index));
    } else {
      query += ' ORDER BY set_index DESC LIMIT 1'; // Get latest if no specific set requested
    }

    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No active quiz set found for this grade and module' });
    }

    const set = result.rows[0];
    // Strip explanations for students
    const studentQuestions = set.questions.map(q => {
      const { explanation, ...safeQ } = q;
      return safeQ;
    });

    res.json({ questions: studentQuestions, set_index: set.set_index });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/evaluate_quiz', async (req, res) => {
  const { quiz_id, answers, grade, username, module, set_index } = req.body;

  // Validate required parameters
  if (!answers || !grade || !username) {
    return res.status(400).json({
      error: "Missing required parameters: answers, grade, and username are required"
    });
  }

  try {
    console.log(`Evaluating quiz for user: ${username}, grade: ${grade}, module: ${module || quiz_id}`);

    // Fetch the correct answers from quiz_sets table
    const actualModule = module || quiz_id;
    
    if (!actualModule) {
      return res.status(400).json({
        error: "Module information is required for evaluation"
      });
    }

    // Fetch the quiz set
    let query = 'SELECT id, questions, set_index FROM quiz_sets WHERE grade = $1 AND module = $2 AND is_hidden = FALSE';
    const params = [parseInt(grade), parseInt(actualModule)];
    
    if (set_index) {
      query += ' AND set_index = $3';
      params.push(parseFloat(set_index));
    } else {
      query += ' ORDER BY set_index DESC LIMIT 1';
    }

    const quizSetResult = await pool.query(query, params);

    if (quizSetResult.rows.length === 0) {
      return res.status(404).json({
        error: `No quiz set found for grade ${grade}, module ${actualModule}`
      });
    }

    const quizSetId = quizSetResult.rows[0].id;
    const questions = quizSetResult.rows[0].questions;
    const actualSetIndex = quizSetResult.rows[0].set_index;

    // Convert questions to evaluation format
    const allQuestions = questions.map((q, i) => ({
      ...q,
      id: q.type === 'mcq' ? `mc_${i}` : `tf_${i}`
    }));

    // Evaluate answers
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
        explanation: question.explanation || "No explanation provided",
        bloom_level: question.bloom_level,
        concept: question.concept,
        type: question.type,
        needs_image: question.needs_image || false
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

    // NEW: Save attempt to database
    await pool.query(
      `INSERT INTO quiz_attempts 
        (username, grade, module, set_index, quiz_set_id, score, total_questions, percentage, grade_level, answers) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        username,
        parseInt(grade),
        parseInt(actualModule),
        parseFloat(actualSetIndex),
        quizSetId,
        correctCount,
        totalQuestions,
        percentage,
        gradeLevel,
        JSON.stringify(detailedResults)
      ]
    );

    const evaluationResult = {
      quiz_id: actualModule,
      totalQuestions: totalQuestions,
      correctAnswers: correctCount,
      percentage: percentage,
      gradeLevel: gradeLevel,
      results: detailedResults,
      submittedAt: new Date().toISOString()
    };

    console.log(`Quiz evaluation completed and saved - Module: ${actualModule}, Score: ${percentage}%`);
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

// Admin Login Route (separate from student login for security)
app.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username !== 'root' || password !== 'admin') {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Create admin session
    req.session.isAdmin = true;
    req.session.username = 'root';

    res.json({ success: true, message: 'Admin login successful' });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware to check admin session
const checkAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: 'Admin access required' });
  }
};

// Get grades with student counts
app.get('/admin/students/grades', checkAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT grade, COUNT(*) as student_count 
      FROM users 
      WHERE grade IS NOT NULL 
      GROUP BY grade 
      ORDER BY grade
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get students by grade
app.get('/admin/students/:grade', checkAdmin, async (req, res) => {
  const { grade } = req.params;
  try {
    const result = await pool.query(`
      SELECT username, email, grade
      FROM users 
      WHERE grade = $1 
      ORDER BY username
    `, [grade]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get grades with quiz availability
app.get('/admin/quizzes/grades', checkAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.grade, COUNT(q.username) as quiz_count
      FROM users u
      LEFT JOIN quiz q ON u.username = q.username
      WHERE u.grade IS NOT NULL
      GROUP BY u.grade
      ORDER BY u.grade
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching quiz grades:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// NEW: Get quiz attempts for a specific student
app.get('/admin/student_attempts/:username', checkAdmin, async (req, res) => {
  const { username } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, grade, module, set_index, score, total_questions, percentage, 
              grade_level, submitted_at, answers 
       FROM quiz_attempts 
       WHERE username = $1 
       ORDER BY submitted_at DESC`,
      [username]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching student attempts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// NEW: Get attempt statistics for a student
app.get('/admin/student_stats/:username', checkAdmin, async (req, res) => {
  const { username } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_attempts,
        AVG(percentage)::INTEGER as avg_score,
        MAX(percentage) as best_score,
        MIN(percentage) as worst_score,
        COUNT(DISTINCT module) as modules_attempted
       FROM quiz_attempts 
       WHERE username = $1`,
      [username]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get quizzes by grade (aggregate quiz_data from users in that grade)
app.get('/admin/quizzes/:grade', checkAdmin, async (req, res) => {
  const { grade } = req.params;
  try {
    const result = await pool.query(`
      SELECT q.username, q.quiz_data, u.grade
      FROM quiz q
      JOIN users u ON q.username = u.username
      WHERE u.grade = $1
      ORDER BY q.username
    `, [grade]);
    
    // Parse quiz_data JSON for each user
    const quizzes = result.rows.map(row => ({
      username: row.username,
      grade: row.grade,
      quiz: JSON.parse(row.quiz_data || '{}') // Handle empty quiz_data
    }));
    
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// NEW: Admin routes for quiz set management
app.get('/admin/quizzes/grades/modules', checkAdmin, async (req, res) => {
  const { grade } = req.query;
  if (!grade) return res.status(400).json({ error: 'Grade required' });
  
  try {
    const modules = [];
    for (let m = 1; m <= 7; m++) {
      const startQuizId = (m - 1) * 7 + 1;
      const endQuizId = m * 7;
      const countResult = await pool.query(
        'SELECT COUNT(*) as count FROM transcript WHERE quiz_id BETWEEN $1 AND $2',
        [startQuizId, endQuizId]
      );
      modules.push({
        module: m,
        transcripts: parseInt(countResult.rows[0].count)
      });
    }
    res.json({ grade: parseInt(grade), modules });
  } catch (error) {
    console.error('Modules fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/admin/quizzes/:grade/:module/sets', checkAdmin, async (req, res) => {
  const { grade, module } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, set_index, is_hidden, created_at, questions FROM quiz_sets WHERE grade = $1 AND module = $2 ORDER BY set_index DESC',
      [parseInt(grade), parseInt(module)]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Sets fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/admin/create_quiz_set', checkAdmin, upload.array('images', 10), async (req, res) => {
  const { grade, module, type } = req.body;
  const manualQuestions = req.body.questions;
  const files = req.files || [];

  if (!grade || !module || !type || (type === 'manual' && !manualQuestions)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const nextIndex = await getNextSetIndex(parseInt(grade), parseInt(module));
    let finalQuestions = [];

    if (type === 'ai') {
      // Fetch transcript for module
      const startQuizId = (parseInt(module) - 1) * 7 + 1;
      const endQuizId = parseInt(module) * 7;
      const transcriptResult = await pool.query(
        'SELECT transcript FROM transcript WHERE quiz_id BETWEEN $1 AND $2 ORDER BY RANDOM() LIMIT 1',
        [startQuizId, endQuizId]
      );
      
      if (transcriptResult.rows.length === 0) {
        return res.status(404).json({ error: 'No transcript for this module' });
      }

      const nepGrade = getNepGrade(parseInt(grade));
      const generated = await generateQuizWithGemini(transcriptResult.rows[0].transcript, nepGrade, 7, 3);

      // Convert to new format
      let fileIndex = 0;
      finalQuestions = [
        ...generated.multiple_choice.map(q => {
          const imgPath = files[fileIndex] ? files[fileIndex].path : null;
          fileIndex++;
          return {
            type: 'mcq',
            question: q.question,
            options: q.options,
            answer: q.answer,
            explanation: q.explanation || '',
            bloom_level: q.bloom_level,
            concept: q.concept,
            image_path: imgPath,
            grade: parseInt(grade)
          };
        }),
        ...generated.true_false.map(q => {
          const imgPath = files[fileIndex] ? files[fileIndex].path : null;
          fileIndex++;
          return {
            type: 'tf',
            question: q.question,
            answer: q.answer === true || q.answer === 'True' ? 'true' : 'false',
            explanation: q.explanation || '',
            bloom_level: q.bloom_level,
            concept: q.concept,
            image_path: imgPath,
            grade: parseInt(grade)
          };
        })
      ];
    } else if (type === 'manual') {
      const parsedQuestions = JSON.parse(manualQuestions);
      let fileIndex = 0;
      finalQuestions = parsedQuestions.map(q => {
        const imgPath = files[fileIndex] ? files[fileIndex].path : (q.image_path || null);
        fileIndex++;
        return { ...q, image_path: imgPath, grade: parseInt(grade) };
      });
    }

    await pool.query(
      'INSERT INTO quiz_sets (grade, module, set_index, questions) VALUES ($1, $2, $3, $4)',
      [parseInt(grade), parseInt(module), parseFloat(nextIndex), JSON.stringify(finalQuestions)]
    );

    res.json({ success: true, set_index: nextIndex, questions_count: finalQuestions.length });
  } catch (error) {
    console.error('Create set error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/admin/hide_quiz_set/:id', checkAdmin, async (req, res) => {
  const { id } = req.params;
  const { is_hidden } = req.body;
  try {
    await pool.query(
      'UPDATE quiz_sets SET is_hidden = $1 WHERE id = $2',
      [is_hidden, id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Hide set error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/admin/delete_quiz_set/:id', checkAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM quiz_sets WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete set error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin Logout
app.post('/admin/logout', checkAdmin, (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Admin logged out' });
});

app.listen(5000, () => console.log("Server running on port 5000"));
