import express from "express";
import cors from "cors";
import session from "express-session";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pool from "./db.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';

dotenv.config();

const app = express();

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "your_secret_here",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
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

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} from ${req.get('Origin') || 'no-origin'}`);
  next();
});

app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Multer configuration for image uploads
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

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ==================== HELPER FUNCTIONS ====================

// Helper to get NEP grade category
function getNepGrade(grade) {
  const mapping = {
    '1': 'foundational', '2': 'foundational',
    '3': 'preparatory', '4': 'preparatory', '5': 'preparatory',
    '6': 'middle', '7': 'middle', '8': 'middle',
    '9': 'secondary', '10': 'secondary', '11': 'secondary', '12': 'secondary'
  };
  return mapping[String(grade)] || 'middle';
}

// Middleware to check admin session
const checkAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: 'Admin access required' });
  }
};

// ==================== AUTHENTICATION ROUTES ====================

// Student Registration
app.post('/register', async (req, res) => {
  const { username, email, password, grade } = req.body;
  
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const userExists = await pool.query(
      "SELECT * FROM students WHERE username = $1 OR email = $2",
      [username, email]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists." });
    }
    
    await pool.query(
      "INSERT INTO students (username, password_hash, email, grade) VALUES ($1, $2, $3, $4)",
      [username, password_hash, email, grade]
    );
    
    res.status(201).json({ message: "User registered!" });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Student Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const result = await pool.query(
      "SELECT * FROM students WHERE username = $1",
      [username]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "No user found." });
    }
    
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    
    if (!valid) {
      return res.status(401).json({ error: "Invalid password." });
    }
    
    req.session.username = user.username;
    req.session.grade = user.grade;
    
    res.json({
      message: "Login successful!",
      user: {
        username,
        email: user.email,
        grade: user.grade
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Student Logout
app.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ error: 'Failed to log out.' });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logged out successfully.' });
    });
  } else {
    return res.status(400).json({ error: 'No active session.' });
  }
});

// Admin Login
app.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username !== 'root' || password !== 'admin') {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    
    req.session.isAdmin = true;
    req.session.username = 'root';
    
    res.json({ success: true, message: 'Admin login successful' });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin Logout
app.post('/admin/logout', checkAdmin, (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Admin logged out' });
});

// ==================== STUDENT ROUTES ====================

// Get available submodules for student's grade
app.get('/api/student/modules/:grade', async (req, res) => {
  console.log('🔍 [/api/student/modules] Request for grade:', req.params.grade);
  const { grade } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT DISTINCT s.id, s.submodule_code, s.submodule_name, s.image_path,
             COUNT(DISTINCT qs.id) as set_count
      FROM submodules s
      INNER JOIN concepts c ON c.submodule_id = s.id
      INNER JOIN concept_grade_mapping cgm ON cgm.concept_id = c.id
      LEFT JOIN question_sets qs ON qs.submodule_id = s.id AND qs.grade = $1
      WHERE cgm.grade = $1
      GROUP BY s.id, s.submodule_code, s.submodule_name, s.image_path
      ORDER BY s.submodule_code
    `, [grade]);
    
    console.log('✅ Student modules found:', result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching student modules:', err);
    res.status(500).json({ error: 'Database error' });
  }
});
// Get quiz sets for specific grade and submodule
app.get('/api/student/quiz_sets/:grade/:submodule_code', async (req, res) => {
  console.log('🔍 [/api/student/quiz_sets] Request:', req.params);
  const { grade, submodule_code } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT qs.id, qs.set_name as name, qs.created_at,
             s.submodule_name,
             (SELECT COUNT(*) FROM question_set_items qsi WHERE qsi.set_id = qs.id) as question_count
      FROM question_sets qs
      INNER JOIN submodules s ON s.id = qs.submodule_id
      WHERE qs.grade = $1 AND s.submodule_code = $2
      ORDER BY qs.created_at DESC
    `, [grade, submodule_code]);
    
    console.log('✅ Quiz sets found:', result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching quiz sets:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Fetch specific quiz for student (without answers)
app.get('/api/fetch_quiz/:question_set_id', async (req, res) => {
  console.log('🔍 [/api/fetch_quiz] Request for set:', req.params.question_set_id);
  const { question_set_id } = req.params;
  
  try {
    const setResult = await pool.query(`
      SELECT qs.id, qs.set_name as name, s.submodule_name
      FROM question_sets qs
      INNER JOIN submodules s ON s.id = qs.submodule_id
      WHERE qs.id = $1
    `, [question_set_id]);
    
    if (setResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz set not found' });
    }
    
    const questionSet = setResult.rows[0];
    
    // Fetch all questions (without correct answers for students)
    const questionsResult = await pool.query(`
      SELECT q.id, q.question_text, q.question_type, q.options, 
             q.bloom_level, q.image_path, c.concept_name as concept
      FROM questions q
      INNER JOIN question_set_items qsi ON qsi.question_id = q.id
      INNER JOIN concepts c ON c.id = q.concept_id
      WHERE qsi.set_id = $1
      ORDER BY q.id
    `, [question_set_id]);
    
    console.log('✅ Questions fetched:', questionsResult.rows.length);
    
    res.json({
      set_id: questionSet.id,
      set_name: questionSet.name,
      submodule_name: questionSet.submodule_name,
      questions: questionsResult.rows
    });
  } catch (err) {
    console.error('❌ Error fetching quiz:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Evaluate quiz and save attempt
// Evaluate quiz and save attempt - UPDATED FOR NEW SCHEMA
app.post('/api/evaluate_quiz', async (req, res) => {
  const { question_set_id, answers, username, grade } = req.body;
  
  console.log('🔍 [/api/evaluate_quiz] Request received');
  console.log('🔍 Question Set ID:', question_set_id);
  console.log('🔍 Answers:', answers);
  console.log('🔍 Username:', username);
  console.log('🔍 Grade:', grade);
  
  if (!question_set_id || !answers || !username || !grade) {
    return res.status(400).json({ error: "Missing required parameters" });
  }
  
  try {
    // Fetch the question set info
    const setResult = await pool.query(`
      SELECT qs.id, qs.set_name, s.submodule_code, s.id as submodule_id
      FROM question_sets qs
      INNER JOIN submodules s ON s.id = qs.submodule_id
      WHERE qs.id = $1
    `, [question_set_id]);
    
    if (setResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz set not found' });
    }
    
    const questionSet = setResult.rows[0];
    const submodule_id = questionSet.submodule_id;
    const submodule_code = questionSet.submodule_code;
    
    console.log('🔍 Question set found:', questionSet.set_name);
    
    // Fetch all questions with correct answers
    const questionsResult = await pool.query(`
      SELECT q.id, q.question_text, q.question_type, q.options, q.correct_answer, 
             q.bloom_level, q.image_path, q.grade,
             c.concept_name as concept, c.id as concept_id
      FROM questions q
      INNER JOIN question_set_items qsi ON qsi.question_id = q.id
      INNER JOIN concepts c ON c.id = q.concept_id
      WHERE qsi.set_id = $1
      ORDER BY q.id
    `, [question_set_id]);
    
    const questions = questionsResult.rows;
    console.log('🔍 Questions fetched:', questions.length);
    
    // Evaluate answers
    let correctCount = 0;
    const detailedResults = [];
    const conceptPerformance = {}; // Track performance per concept
    
    questions.forEach((question, index) => {
      const userAnswer = answers[question.id.toString()] || answers[question.id];
      const isCorrect = userAnswer === question.correct_answer;
      
      if (isCorrect) correctCount++;
      
      // Track concept performance
      const concept = question.concept;
      const concept_id = question.concept_id;
      
      if (!conceptPerformance[concept_id]) {
        conceptPerformance[concept_id] = { 
          concept_name: concept,
          correct: 0, 
          incorrect: 0 
        };
      }
      
      if (isCorrect) {
        conceptPerformance[concept_id].correct++;
      } else {
        conceptPerformance[concept_id].incorrect++;
      }
      
      detailedResults.push({
        questionIndex: index + 1,
        question_id: question.id,
        question: question.question_text,
        userAnswer: userAnswer || "Not answered",
        correctAnswer: question.correct_answer,
        isCorrect: isCorrect,
        bloom_level: question.bloom_level,
        concept: question.concept,
        type: question.question_type,
        image_path: question.image_path,
        explanation: isCorrect 
          ? "Great job! You got this right." 
          : `The correct answer is: ${question.correct_answer}`
      });
    });
    
    const totalQuestions = questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    
    // Determine grade level
    let gradeLevel = "Needs Improvement";
    if (percentage >= 90) gradeLevel = "Excellent";
    else if (percentage >= 80) gradeLevel = "Good";
    else if (percentage >= 70) gradeLevel = "Satisfactory";
    else if (percentage >= 60) gradeLevel = "Below Average";
    
    console.log('🔍 Score:', correctCount, '/', totalQuestions, '=', percentage, '%');
    console.log('🔍 Grade Level:', gradeLevel);
    
    // Save quiz attempt
    const attemptResult = await pool.query(`
      INSERT INTO quiz_attempts (
        student_username, question_set_id, submitted_at, 
        score, total_questions, answers_json
      ) VALUES ($1, $2, NOW(), $3, $4, $5)
      RETURNING id
    `, [username, question_set_id, correctCount, totalQuestions, JSON.stringify(detailedResults)]);
    
    const attemptId = attemptResult.rows[0].id;
    console.log('✅ Quiz attempt saved with ID:', attemptId);
    
    // Update student_activity for concept-level tracking
    const activityCheck = await pool.query(`
      SELECT id, concept_performance
      FROM student_activity
      WHERE student_username = $1 AND submodule_id = $2 AND grade = $3
    `, [username, submodule_id, grade]);
    
    let existingPerformance = {};
    
    if (activityCheck.rows.length > 0) {
      // Update existing record
      const activityId = activityCheck.rows[0].id;
      existingPerformance = activityCheck.rows[0].concept_performance || {};
      
      // Merge concept performance
      Object.keys(conceptPerformance).forEach(concept_id => {
        const key = concept_id.toString();
        if (!existingPerformance[key]) {
          existingPerformance[key] = { 
            concept_name: conceptPerformance[concept_id].concept_name,
            correct: 0, 
            incorrect: 0 
          };
        }
        existingPerformance[key].correct += conceptPerformance[concept_id].correct;
        existingPerformance[key].incorrect += conceptPerformance[concept_id].incorrect;
      });
      
      await pool.query(`
        UPDATE student_activity
        SET attempt_ids = array_append(attempt_ids, $1),
            concept_performance = $2,
            last_attempt_at = NOW()
        WHERE id = $3
      `, [attemptId, JSON.stringify(existingPerformance), activityId]);
      
      console.log('✅ Updated existing student activity');
      
    } else {
      // Create new student_activity record
      const conceptPerfObj = {};
      Object.keys(conceptPerformance).forEach(concept_id => {
        conceptPerfObj[concept_id] = {
          concept_name: conceptPerformance[concept_id].concept_name,
          correct: conceptPerformance[concept_id].correct,
          incorrect: conceptPerformance[concept_id].incorrect
        };
      });
      
      await pool.query(`
        INSERT INTO student_activity (
          student_username, submodule_id, grade, 
          attempt_ids, concept_performance, last_attempt_at
        ) VALUES ($1, $2, $3, $4, $5, NOW())
      `, [username, submodule_id, grade, [attemptId], JSON.stringify(conceptPerfObj)]);
      
      console.log('✅ Created new student activity record');
    }
    
    const evaluationResult = {
      attempt_id: attemptId,
      quiz_id: question_set_id,
      totalQuestions: totalQuestions,
      correctAnswers: correctCount,
      percentage: percentage,
      gradeLevel: gradeLevel,
      results: detailedResults,
      submittedAt: new Date().toISOString()
    };
    
    console.log('✅ [/api/evaluate_quiz] Success');
    res.json(evaluationResult);
    
  } catch (err) {
    console.error('❌ Error evaluating quiz:', err);
    res.status(500).json({ 
      error: "Internal server error",
      message: err.message 
    });
  }
});


// ==================== ADMIN ROUTES ====================

// Get all grades with quiz counts
// Get all grades with quiz counts - CORRECTED
// Get all grades with quiz counts - FULLY QUALIFIED
app.get('/admin/quizzes/grades', checkAdmin, async (req, res) => {
  console.log('═══════════════════════════════════════════');
  console.log('🔍 [GET /admin/quizzes/grades] START');
  
  try {
    const result = await pool.query(`
      SELECT DISTINCT cgm.grade, 
             COUNT(DISTINCT qs.id)::integer as quiz_count
      FROM concept_grade_mapping cgm
      LEFT JOIN question_sets qs ON qs.grade = cgm.grade
      GROUP BY cgm.grade
      ORDER BY cgm.grade
    `);
    
    console.log('✅ Query successful. Rows returned:', result.rows.length);
    console.log('🔍 Data:', JSON.stringify(result.rows, null, 2));
    console.log('═══════════════════════════════════════════');
    
    res.json(result.rows);
  } catch (err) {
    console.error('═══════════════════════════════════════════');
    console.error('❌ [ERROR] /admin/quizzes/grades failed');
    console.error('❌ Message:', err.message);
    console.error('❌ Stack:', err.stack);
    console.error('═══════════════════════════════════════════');
    
    res.status(500).json({ 
      error: 'Database error', 
      message: err.message
    });
  }
});



// Get all submodules for a specific grade
app.get('/admin/quizzes/modules/:grade', checkAdmin, async (req, res) => {
  console.log('═══════════════════════════════════════════');
  console.log('🔍 [/admin/quizzes/modules] Request for grade:', req.params.grade);
  
  const { grade } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT DISTINCT s.id, s.submodule_code, s.submodule_name,
             COUNT(qs.id) as set_count
      FROM submodules s
      LEFT JOIN question_sets qs ON qs.submodule_id = s.id AND qs.grade = $1
      WHERE s.id IN (
        SELECT DISTINCT c.submodule_id 
        FROM concepts c
        INNER JOIN concept_grade_mapping cgm ON cgm.concept_id = c.id
        WHERE cgm.grade = $1
      )
      GROUP BY s.id, s.submodule_code, s.submodule_name
      ORDER BY s.submodule_code
    `, [grade]);
    
    console.log('✅ Modules query successful');
    console.log('🔍 Result:', result.rows);
    console.log('═══════════════════════════════════════════');
    
    res.json(result.rows);
  } catch (err) {
    console.error('❌ [ERROR] Error fetching modules:', err);
    res.status(500).json({ 
      error: 'Database error', 
      message: err.message 
    });
  }
});

// Get all question sets for a specific grade and submodule
app.get('/admin/quizzes/sets/:grade/:submodule_code', checkAdmin, async (req, res) => {
  console.log('═══════════════════════════════════════════');
  console.log('🔍 [/admin/quizzes/sets] Request for:', req.params);
  
  const { grade, submodule_code } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT qs.id, qs.set_name as name, qs.created_at,
             s.submodule_name, s.submodule_code,
             (SELECT array_agg(qsi.question_id) FROM question_set_items qsi WHERE qsi.set_id = qs.id) as question_ids,
             (SELECT COUNT(*) FROM question_set_items qsi WHERE qsi.set_id = qs.id) as question_count
      FROM question_sets qs
      INNER JOIN submodules s ON s.id = qs.submodule_id
      WHERE qs.grade = $1 AND s.submodule_code = $2
      ORDER BY qs.created_at DESC
    `, [grade, submodule_code]);
    
    console.log('✅ Sets query successful');
    console.log('🔍 Result:', result.rows);
    console.log('═══════════════════════════════════════════');
    
    res.json(result.rows);
  } catch (err) {
    console.error('❌ [ERROR] Error fetching sets:', err);
    res.status(500).json({ 
      error: 'Database error', 
      message: err.message 
    });
  }
});
// Get full question set details (for viewing/editing)
app.get('/admin/question_set/:id', checkAdmin, async (req, res) => {
  console.log('🔍 [/admin/question_set/:id] Request for set:', req.params.id);
  
  const { id } = req.params;
  
  try {
    const setResult = await pool.query(`
      SELECT qs.id, qs.set_name as name, qs.created_at, qs.grade,
             s.submodule_code, s.submodule_name
      FROM question_sets qs
      INNER JOIN submodules s ON s.id = qs.submodule_id
      WHERE qs.id = $1
    `, [id]);
    
    if (setResult.rows.length === 0) {
      return res.status(404).json({ error: 'Question set not found' });
    }
    
    const questionSet = setResult.rows[0];
    
    // Fetch all questions in this set
    const questionsResult = await pool.query(`
      SELECT q.id, q.question_text, q.question_type, q.options, q.correct_answer,
             q.bloom_level, q.image_path, q.grade,
             c.concept_name as concept
      FROM questions q
      INNER JOIN question_set_items qsi ON qsi.question_id = q.id
      INNER JOIN concepts c ON c.id = q.concept_id
      WHERE qsi.set_id = $1
      ORDER BY q.id
    `, [id]);
    
    console.log('✅ Question set fetched:', questionSet.name);
    console.log('🔍 Questions count:', questionsResult.rows.length);
    
    res.json({
      ...questionSet,
      questions: questionsResult.rows
    });
  } catch (err) {
    console.error('❌ [ERROR] Error fetching question set:', err);
    res.status(500).json({ 
      error: 'Database error', 
      message: err.message 
    });
  }
});

app.post('/admin/question_set/:setId/add_question', checkAdmin, upload.single('image'), async (req, res) => {
  const { setId } = req.params;
  const {
    question_text,
    question_type,
    options,
    correct_answer,
    bloom_level,
    concept_id,
    grade
  } = req.body;
  
  console.log('🔍 [POST /admin/question_set/add_question] Adding to set:', setId);
  
  try {
    // Insert the new question
    const questionResult = await pool.query(`
      INSERT INTO questions (
        concept_id, grade, question_text, question_type, options,
        correct_answer, bloom_level, image_path
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [
      concept_id,
      grade,
      question_text,
      question_type,
      typeof options === 'string' ? options : JSON.stringify(options),
      correct_answer,
      bloom_level,
      req.file ? req.file.path : null
    ]);
    
    const questionId = questionResult.rows[0].id;
    
    // Add to question_set_items
    await pool.query(`
      INSERT INTO question_set_items (set_id, question_id)
      VALUES ($1, $2)
    `, [setId, questionId]);
    
    console.log('✅ Question added to set:', questionId);
    res.json({ success: true, question_id: questionId });
  } catch (err) {
    console.error('❌ Error adding question:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});


// Generate quiz using Python script
// Generate quiz using Python script - UPDATED FOR YOUR SCHEMA
app.post('/generatequiz', checkAdmin, async (req, res) => {
  const { submodule_code, grade, set_name } = req.body;
  
  console.log('═══════════════════════════════════════════');
  console.log('🔍 [/generatequiz] Request received');
  console.log('🔍 Submodule:', submodule_code, 'Grade:', grade);
  
  if (!submodule_code || !grade) {
    return res.status(400).json({ error: 'Missing submodule_code or grade' });
  }
  
  try {
    // Get submodule_id from code
    const submoduleResult = await pool.query(
      'SELECT id FROM submodules WHERE submodule_code = $1',
      [submodule_code]
    );
    
    if (submoduleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Submodule not found' });
    }
    
    const submodule_id = submoduleResult.rows[0].id;
    console.log('🔍 Submodule ID:', submodule_id);
    console.log('🔍 Starting Python script...');
    
    // Call Python script
    const pythonProcess = spawn('python3', [
      'generate_questions.py',
      submodule_code,
      grade.toString()
    ]);
    
    let dataString = '';
    let errorString = '';
    
    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorString += data.toString();
      console.error('🔴 Python stderr:', data.toString());
    });
    
    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        console.error('❌ Python script failed with code:', code);
        console.error('❌ Error:', errorString);
        return res.status(500).json({ 
          error: 'Question generation failed', 
          details: errorString 
        });
      }
      
      try {
        console.log('🔍 Parsing Python output...');
        const generatedData = JSON.parse(dataString);
        
        if (generatedData.error) {
          return res.status(500).json({ error: generatedData.error });
        }
        
        console.log('🔍 Generated', generatedData.questions.length, 'questions');
        
        // Create question set first
        const finalSetName = set_name || `${submodule_code} - Grade ${grade} Quiz`;
        const setResult = await pool.query(`
          INSERT INTO question_sets (submodule_id, grade, set_name, created_at)
          VALUES ($1, $2, $3, NOW())
          RETURNING id
        `, [submodule_id, grade, finalSetName]);
        
        const questionSetId = setResult.rows[0].id;
        console.log('✅ Question set created with ID:', questionSetId);
        
        // Insert questions and map to set
        let insertedCount = 0;
        for (const q of generatedData.questions) {
          // Get concept_id from concept name
          const conceptResult = await pool.query(`
            SELECT id FROM concepts 
            WHERE submodule_id = $1 AND concept_name = $2
          `, [submodule_id, q.concept]);
          
          if (conceptResult.rows.length === 0) {
            console.warn('⚠️ Concept not found:', q.concept);
            continue;
          }
          
          const concept_id = conceptResult.rows[0].id;
          
          // Insert question
          const questionResult = await pool.query(`
            INSERT INTO questions (
              concept_id, grade, question_text, question_type, options, 
              correct_answer, bloom_level, image_path
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
          `, [
            concept_id,
            grade,
            q.question_text || q.question,
            q.type || 'MCQ',
            JSON.stringify(q.options || {}),
            q.correct_answer || q.answer,
            q.bloom_level,
            q.image_path || null
          ]);
          
          const questionId = questionResult.rows[0].id;
          
          // Map question to set
          await pool.query(`
            INSERT INTO question_set_items (set_id, question_id)
            VALUES ($1, $2)
          `, [questionSetId, questionId]);
          
          insertedCount++;
        }
        
        console.log('✅ Quiz generated successfully!');
        console.log('🔍 Question Set ID:', questionSetId);
        console.log('🔍 Questions inserted:', insertedCount);
        console.log('═══════════════════════════════════════════');
        
        res.json({
          success: true,
          message: 'Quiz generated successfully',
          question_set_id: questionSetId,
          question_count: insertedCount
        });
        
      } catch (parseError) {
        console.error('❌ Failed to parse or insert questions:', parseError);
        console.error('❌ Raw Python output:', dataString);
        res.status(500).json({ 
          error: 'Failed to process generated questions',
          details: parseError.message
        });
      }
    });
    
  } catch (err) {
    console.error('❌ Error in quiz generation:', err);
    res.status(500).json({ 
      error: 'Server error during quiz generation',
      message: err.message
    });
  }
});


// Get concepts for a submodule and grade (for manual question creation)
app.get('/admin/concepts/:submodule_code/:grade', checkAdmin, async (req, res) => {
  const { submodule_code, grade } = req.params;
  
  console.log('🔍 [/admin/concepts] Fetching concepts for:', submodule_code, 'grade:', grade);
  
  try {
    const result = await pool.query(`
      SELECT DISTINCT c.id, c.concept_name, c.description, c.ct_concepts
      FROM concepts c
      INNER JOIN submodules s ON s.id = c.submodule_id
      INNER JOIN concept_grade_mapping cgm ON cgm.concept_id = c.id
      WHERE s.submodule_code = $1 AND cgm.grade = $2
      ORDER BY c.concept_name
    `, [submodule_code, grade]);
    
    console.log('✅ Concepts found:', result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching concepts:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


// Create manual question set (empty initially)
app.post('/admin/create_manual_set', checkAdmin, async (req, res) => {
  const { submodule_code, grade, set_name } = req.body;
  
  console.log('🔍 [POST /admin/create_manual_set] Creating manual set:', set_name);
  
  try {
    // Get submodule_id
    const submoduleResult = await pool.query(
      'SELECT id FROM submodules WHERE submodule_code = $1',
      [submodule_code]
    );
    
    if (submoduleResult.rows.length === 0) {
      return res.status(404).json({ error: 'Submodule not found' });
    }
    
    const submodule_id = submoduleResult.rows[0].id;
    
    // Create the question set
    const result = await pool.query(`
      INSERT INTO question_sets (submodule_id, grade, set_name, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id
    `, [submodule_id, grade, set_name]);
    
    const questionSetId = result.rows[0].id;
    console.log('✅ Manual set created with ID:', questionSetId);
    
    res.json({ success: true, question_set_id: questionSetId });
  } catch (err) {
    console.error('❌ Error creating manual set:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});


// Edit a question
app.put('/admin/question/:id', checkAdmin, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { 
    question_text, 
    question_type, 
    options, 
    correct_answer, 
    bloom_level, 
    concept_id,
    grade 
  } = req.body;
  
  console.log('🔍 [PUT /admin/question] Updating question:', id);
  console.log('🔍 Data:', { question_text, question_type, concept_id });
  
  try {
    const updateFields = [];
    const values = [];
    let paramCount = 1;
    
    if (question_text) {
      updateFields.push(`question_text = $${paramCount++}`);
      values.push(question_text);
    }
    if (question_type) {
      updateFields.push(`question_type = $${paramCount++}`);
      values.push(question_type);
    }
    if (options !== undefined) {
      updateFields.push(`options = $${paramCount++}`);
      values.push(typeof options === 'string' ? options : JSON.stringify(options));
    }
    if (correct_answer) {
      updateFields.push(`correct_answer = $${paramCount++}`);
      values.push(correct_answer);
    }
    if (bloom_level) {
      updateFields.push(`bloom_level = $${paramCount++}`);
      values.push(bloom_level);
    }
    if (concept_id) {
      updateFields.push(`concept_id = $${paramCount++}`);
      values.push(concept_id);
    }
    if (grade) {
      updateFields.push(`grade = $${paramCount++}`);
      values.push(grade);
    }
    if (req.file) {
      updateFields.push(`image_path = $${paramCount++}`);
      values.push(req.file.path);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    const query = `UPDATE questions SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    console.log('✅ Question updated successfully');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error updating question:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// Delete a question set
app.delete('/admin/question_set/:id', checkAdmin, async (req, res) => {
  console.log('🔍 [DELETE /admin/question_set/:id] Request for set:', req.params.id);
  
  const { id } = req.params;
  
  try {
    // question_set_items will be deleted automatically due to CASCADE
    await pool.query('DELETE FROM question_sets WHERE id = $1', [id]);
    
    console.log('✅ Question set deleted:', id);
    res.json({ success: true, message: 'Question set deleted' });
    
  } catch (err) {
    console.error('❌ [ERROR] Error deleting question set:', err);
    res.status(500).json({ 
      error: 'Server error', 
      message: err.message 
    });
  }
});

// ==================== STUDENT MANAGEMENT ROUTES ====================

// Get grades with student counts
app.get('/admin/students/grades', checkAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT grade, COUNT(*) as student_count
      FROM students
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
      SELECT username, email, grade, created_at
      FROM students
      WHERE grade = $1
      ORDER BY username
    `, [grade]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get student activity data
app.get('/admin/student_activity/:username', checkAdmin, async (req, res) => {
  const { username } = req.params;
  
  try {
    // Get all attempts
    const attemptsResult = await pool.query(`
      SELECT qa.id, qa.submitted_at, qa.score, qa.total_questions,
             qs.name as quiz_name, qsm.submodule_code, qsm.grade,
             s.submodule_name
      FROM quiz_attempts qa
      INNER JOIN question_sets qs ON qs.id = qa.question_set_id
      INNER JOIN question_set_mapping qsm ON qsm.question_set_id = qs.id
      INNER JOIN submodules s ON s.submodule_code = qsm.submodule_code
      WHERE qa.student_username = $1
      ORDER BY qa.submitted_at DESC
    `, [username]);
    
    // Get concept-level performance
    const activityResult = await pool.query(`
      SELECT sa.submodule_code, sa.grade, sa.concept_performance,
             s.submodule_name, sa.last_attempt_at
      FROM student_activity sa
      INNER JOIN submodules s ON s.submodule_code = sa.submodule_code
      WHERE sa.student_username = $1
      ORDER BY sa.last_attempt_at DESC
    `, [username]);
    
    // Calculate statistics
    const attempts = attemptsResult.rows;
    const stats = {
      total_attempts: attempts.length,
      avg_score: attempts.length > 0 
        ? Math.round(attempts.reduce((sum, a) => sum + (a.score / a.total_questions * 100), 0) / attempts.length)
        : 0,
      best_score: attempts.length > 0
        ? Math.max(...attempts.map(a => Math.round(a.score / a.total_questions * 100)))
        : 0,
      worst_score: attempts.length > 0
        ? Math.min(...attempts.map(a => Math.round(a.score / a.total_questions * 100)))
        : 0,
      submodules_attempted: new Set(attempts.map(a => a.submodule_code)).size
    };
    
    res.json({
      attempts: attemptsResult.rows,
      activity: activityResult.rows,
      stats
    });
    
  } catch (error) {
    console.error('Error fetching student activity:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/admin/question/:id', checkAdmin, async (req, res) => {
  const { id } = req.params;
  
  console.log('🔍 [DELETE /admin/question] Deleting question:', id);
  
  try {
    // Delete from question_set_items first (CASCADE should handle this, but being explicit)
    await pool.query('DELETE FROM question_set_items WHERE question_id = $1', [id]);
    
    // Delete the question
    await pool.query('DELETE FROM questions WHERE id = $1', [id]);
    
    console.log('✅ Question deleted');
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error deleting question:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Quiz Generation Platform - New Schema Version`);
});
