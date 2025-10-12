CREATE TABLE transcript (
    quiz_id SERIAL PRIMARY KEY,
    module INT,
    transcript TEXT
);

CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    password_hash TEXT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    grade INT NULL
);

CREATE TABLE quiz ( 
    username VARCHAR(255) PRIMARY KEY REFERENCES users(username) ON DELETE CASCADE, 
    quiz_data TEXT NOT NULL 
);

-- New Table: quiz_sets (stores complete quiz sets by grade/module/set_index)
CREATE TABLE IF NOT EXISTS quiz_sets (
    id SERIAL PRIMARY KEY,
    grade INTEGER NOT NULL,  -- 1-12
    module INTEGER NOT NULL, -- 1-7 (based on transcripts)
    set_index DECIMAL(3,1) NOT NULL, -- e.g., 1.0, 1.1, 1.2 (versioning)
    questions JSONB NOT NULL, -- Array of questions: [{"type": "mcq", "question": "...", "options": [...], "answer": "...", "explanation": "...", "bloom_level": "...", "concept": "...", "image_path": null, "grade": 12}]
    is_hidden BOOLEAN DEFAULT FALSE, -- Hide from students
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(grade, module, set_index)  -- One active set per combo
);

-- Index for fast queries
CREATE INDEX idx_quiz_sets_grade_module ON quiz_sets(grade, module);
CREATE INDEX idx_quiz_sets_hidden ON quiz_sets(is_hidden);

-- Trigger to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_quiz_sets_updated_at BEFORE UPDATE
    ON quiz_sets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Quiz Attempts Tracking (stores all student quiz submissions)
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    grade INTEGER NOT NULL,
    module INTEGER NOT NULL,
    set_index DECIMAL(3,1) NOT NULL,
    quiz_set_id INTEGER REFERENCES quiz_sets(id) ON DELETE SET NULL,
    score INTEGER NOT NULL, -- Correct answers count
    total_questions INTEGER NOT NULL,
    percentage INTEGER NOT NULL,
    grade_level VARCHAR(50), -- Excellent, Good, etc.
    answers JSONB NOT NULL, -- User's answers with correctness: [{"question": "...", "user_answer": "...", "correct_answer": "...", "is_correct": true, ...}]
    time_taken INTEGER, -- In seconds (optional for future)
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_quiz_set FOREIGN KEY (grade, module, set_index) 
        REFERENCES quiz_sets(grade, module, set_index) ON DELETE CASCADE
);

-- Indexes for fast queries
CREATE INDEX idx_attempts_username ON quiz_attempts(username);
CREATE INDEX idx_attempts_grade_module ON quiz_attempts(grade, module);
CREATE INDEX idx_attempts_submitted ON quiz_attempts(submitted_at DESC);
