-- Drop all existing tables to ensure a clean slate
DROP TABLE IF EXISTS
  student_concept_stats,
  student_activity,
  quiz_attempts,
  attempt_answers,
  attempts,
  question_set_items,
  question_sets,
  questions,
  concept_grade_mapping,
  concepts,
  supermodule_submodules,
  supermodules,
  submodules,
  students,
  users
CASCADE;  -- file:36

-- Submodules: Stores basic info about each video-level submodule
CREATE TABLE submodules (
  id SERIAL PRIMARY KEY,
  submodule_code VARCHAR(20) UNIQUE NOT NULL,
  submodule_name VARCHAR(255) NOT NULL,
  image_path VARCHAR(255),
  transcript TEXT
);

-- Supermodules: e.g. "L3.C1", "L3.C2", etc.
CREATE TABLE supermodules (
  id SERIAL PRIMARY KEY,
  supermodule_code VARCHAR(20) UNIQUE NOT NULL,
  supermodule_name VARCHAR(255) NOT NULL
);

-- Junction to associate videos (submodules) under each supermodule
CREATE TABLE supermodule_submodules (
  supermodule_id INTEGER NOT NULL REFERENCES supermodules(id) ON DELETE CASCADE,
  submodule_id   INTEGER NOT NULL REFERENCES submodules(id)    ON DELETE CASCADE,
  PRIMARY KEY (supermodule_id, submodule_id)
);

-- Concepts: Stores the master list of all concepts identified by Prompt A
CREATE TABLE concepts (
  id SERIAL PRIMARY KEY,
  submodule_id INTEGER NOT NULL REFERENCES submodules(id) ON DELETE CASCADE,
  concept_name VARCHAR(255) NOT NULL,
  ct_concepts TEXT[],    -- Array of computational thinking concepts
  description TEXT,
  UNIQUE(submodule_id, concept_name)
);

-- Concept_Grade_Mapping: Maps which concepts are suitable for which grades
CREATE TABLE concept_grade_mapping (
  concept_id INTEGER NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  grade      INTEGER NOT NULL,
  PRIMARY KEY (concept_id, grade)
);

-- Questions: Central bank for all generated questions
CREATE TABLE questions (
  id            SERIAL PRIMARY KEY,
  concept_id    INTEGER NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  grade         INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_type VARCHAR(10) NOT NULL,  -- 'MCQ' or 'BOOLEAN'
  options       JSONB,                  -- For MCQ: {"A": "text", "B": "text", ...}
  correct_answer VARCHAR(255) NOT NULL,
  bloom_level   VARCHAR(50),
  image_path    VARCHAR(255),
  explanation   TEXT                     -- added if missing
);

-- Question_Sets: Defines a quiz set as a collection of questions
CREATE TABLE question_sets (
  id         SERIAL PRIMARY KEY,
  submodule_id INTEGER NOT NULL REFERENCES submodules(id) ON DELETE CASCADE,
  grade      INTEGER NOT NULL,
  set_name   VARCHAR(100),
  is_hidden  BOOLEAN DEFAULT TRUE,
  reattempts_allowed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Question_Set_Items: Maps questions to question sets (many-to-many)
CREATE TABLE question_set_items (
  set_id      INTEGER NOT NULL REFERENCES question_sets(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id)     ON DELETE CASCADE,
  PRIMARY KEY (set_id, question_id)
);

-- Users: For both students and admins
-- CREATE TABLE users (
--   id            SERIAL PRIMARY KEY,
--   username      VARCHAR(50) UNIQUE NOT NULL,
--   email         VARCHAR(100) UNIQUE NOT NULL,
--   password_hash VARCHAR(255) NOT NULL,
--   role          VARCHAR(20) NOT NULL DEFAULT 'student',
--   grade         INTEGER
-- );

-- Attempts: Records each time a user attempts a quiz set
-- CREATE TABLE attempts (
--   id              SERIAL PRIMARY KEY,
--   user_id         INTEGER NOT NULL REFERENCES users(id)         ON DELETE CASCADE,
--   set_id          INTEGER NOT NULL REFERENCES question_sets(id) ON DELETE CASCADE,
--   score           INTEGER NOT NULL,
--   total_questions INTEGER NOT NULL,
--   percentage      INTEGER NOT NULL,
--   submitted_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
-- );

-- Attempt_Answers: Records each answer in an attempt
CREATE TABLE attempt_answers (
  id           SERIAL PRIMARY KEY,
  attempt_id   INTEGER NOT NULL REFERENCES attempts(id)  ON DELETE CASCADE,
  question_id  INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  chosen_answer VARCHAR(255) NOT NULL,
  is_correct    BOOLEAN NOT NULL
);

-- Students table (separate from users for your current implementation)
CREATE TABLE students (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  grade         INTEGER,
  created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Quiz Attempts (for student table)
CREATE TABLE quiz_attempts (
  id               SERIAL PRIMARY KEY,
  student_username VARCHAR(50) NOT NULL REFERENCES students(username) ON DELETE CASCADE,
  question_set_id  INTEGER NOT NULL REFERENCES question_sets(id)    ON DELETE CASCADE,
  submitted_at     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  score            INTEGER NOT NULL,
  total_questions  INTEGER NOT NULL,
  answers_json     JSONB
);

-- Student Activity for concept-level tracking
CREATE TABLE student_activity (
  id                  SERIAL PRIMARY KEY,
  student_username    VARCHAR(50) NOT NULL REFERENCES students(username) ON DELETE CASCADE,
  submodule_id        INTEGER NOT NULL REFERENCES submodules(id)     ON DELETE CASCADE,
  grade               INTEGER NOT NULL,
  attempt_ids         INTEGER[] DEFAULT '{}',
  concept_performance JSONB    DEFAULT '{}',
  last_attempt_at     TIMESTAMPTZ,
  UNIQUE(student_username, submodule_id, grade)
);

-- Stats per student-concept
CREATE TABLE student_concept_stats (
  id               SERIAL PRIMARY KEY,
  student_username VARCHAR(50) NOT NULL REFERENCES students(username) ON DELETE CASCADE,
  concept_id       INTEGER NOT NULL REFERENCES concepts(id)          ON DELETE CASCADE,
  grade            INTEGER NOT NULL,
  submodule_id     INTEGER NOT NULL REFERENCES submodules(id)        ON DELETE CASCADE,
  correct_count    INTEGER DEFAULT 0,
  incorrect_count  INTEGER DEFAULT 0,
  last_updated     TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_username, concept_id, grade, submodule_id)
);

UPDATE supermodules SET supermodule_name = 'Just be, Just code - Code your emotions' WHERE supermodule_code = 'L3.C1';
UPDATE supermodules SET supermodule_name = 'Code, for the love of..' WHERE supermodule_code = 'L3.C2';
UPDATE supermodules SET supermodule_name = 'Code with purpose' WHERE supermodule_code = 'L3.C3';

-- Indexes for performance
CREATE INDEX idx_concepts_submodule         ON concepts(submodule_id);
CREATE INDEX idx_questions_concept          ON questions(concept_id);
CREATE INDEX idx_question_sets_submodule    ON question_sets(submodule_id);
CREATE INDEX idx_question_set_items_set     ON question_set_items(set_id);
CREATE INDEX idx_attempts_user              ON attempts(user_id);
CREATE INDEX idx_attempt_answers_attempt    ON attempt_answers(attempt_id);
CREATE INDEX idx_quiz_attempts_student      ON quiz_attempts(student_username);
CREATE INDEX idx_quiz_attempts_set          ON quiz_attempts(question_set_id);
CREATE INDEX idx_student_activity_student   ON student_activity(student_username);
CREATE INDEX idx_student_activity_submodule ON student_activity(submodule_id);
CREATE INDEX idx_student_concept_stats      ON student_concept_stats(student_username, grade, submodule_id);
