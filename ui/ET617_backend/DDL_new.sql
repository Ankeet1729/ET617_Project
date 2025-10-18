-- Drop all existing tables to ensure a clean slate
DROP TABLE IF EXISTS quiz_attempts, quiz_sets, transcript, users, students, question_set_mapping, questions, concept_subsets, submodules CASCADE;

-- Create the new, normalized tables

-- Submodules: Stores basic info about each submodule
CREATE TABLE submodules (
    id SERIAL PRIMARY KEY,
    submodule_code VARCHAR(10) UNIQUE NOT NULL,
    submodule_name VARCHAR(255) NOT NULL,
    image_path VARCHAR(255),
    transcript TEXT
);

-- Concepts: Stores the master list of all concepts identified by Prompt A
CREATE TABLE concepts (
    id SERIAL PRIMARY KEY,
    submodule_id INTEGER NOT NULL REFERENCES submodules(id) ON DELETE CASCADE,
    concept_name VARCHAR(255) NOT NULL,
    ct_concepts TEXT[], -- Array of computational thinking concepts
    description TEXT,
    UNIQUE(submodule_id, concept_name)
);

-- Concept_Grade_Mapping: Maps which concepts are suitable for which grades
CREATE TABLE concept_grade_mapping (
    concept_id INTEGER NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
    grade INTEGER NOT NULL,
    PRIMARY KEY (concept_id, grade)
);

-- Questions: A centralized bank for all generated questions
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    concept_id INTEGER NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
    grade INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(10) NOT NULL, -- 'MCQ' or 'BOOLEAN'
    options JSONB, -- For MCQ: {"A": "text", "B": "text", ...}
    correct_answer VARCHAR(255) NOT NULL,
    bloom_level VARCHAR(50),
    image_path VARCHAR(255)
);

-- Question_Sets: Defines a quiz set as a collection of questions
CREATE TABLE question_sets (
    id SERIAL PRIMARY KEY,
    submodule_id INTEGER NOT NULL REFERENCES submodules(id) ON DELETE CASCADE,
    grade INTEGER NOT NULL,
    set_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Question_Set_Items: Maps questions to question sets (many-to-many)
CREATE TABLE question_set_items (
    set_id INTEGER NOT NULL REFERENCES question_sets(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    PRIMARY KEY (set_id, question_id)
);

-- Users: For both students and admins
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student',
    grade INTEGER
);

-- Attempts: Records each time a student attempts a quiz set
CREATE TABLE attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    set_id INTEGER NOT NULL REFERENCES question_sets(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage INTEGER NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Attempt_Answers: Records the student's answer for each question in an attempt
CREATE TABLE attempt_answers (
    id SERIAL PRIMARY KEY,
    attempt_id INTEGER NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    chosen_answer VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_concepts_submodule ON concepts(submodule_id);
CREATE INDEX idx_questions_concept ON questions(concept_id);
CREATE INDEX idx_attempts_user ON attempts(user_id);

-- Students table (separate from users for your current implementation)
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  grade INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quiz Attempts (updated to match your student table)
CREATE TABLE quiz_attempts (
  id SERIAL PRIMARY KEY,
  student_username VARCHAR(50) NOT NULL REFERENCES students(username) ON DELETE CASCADE,
  question_set_id INTEGER NOT NULL REFERENCES question_sets(id) ON DELETE CASCADE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers_json JSONB
);

-- Student Activity for concept-level tracking
CREATE TABLE student_activity (
  id SERIAL PRIMARY KEY,
  student_username VARCHAR(50) NOT NULL REFERENCES students(username) ON DELETE CASCADE,
  submodule_id INTEGER NOT NULL REFERENCES submodules(id) ON DELETE CASCADE,
  grade INTEGER NOT NULL,
  attempt_ids INTEGER[] DEFAULT '{}',
  concept_performance JSONB DEFAULT '{}',
  last_attempt_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(student_username, submodule_id, grade)
);

-- Indexes for performance
CREATE INDEX idx_quiz_attempts_student ON quiz_attempts(student_username);
CREATE INDEX idx_quiz_attempts_set ON quiz_attempts(question_set_id);
CREATE INDEX idx_student_activity_student ON student_activity(student_username);
CREATE INDEX idx_student_activity_submodule ON student_activity(submodule_id);
