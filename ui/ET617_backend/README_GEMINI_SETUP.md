# Gemini AI Quiz Generation Setup

This backend now integrates with Google's Gemini AI to generate educational quizzes from transcripts stored in the database.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install @google/generative-ai dotenv
```

### 2. Configure Environment Variables
Create a `.env` file in the backend directory:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Set Up Database Table
Run the SQL script to create the transcript table:
```bash
psql -d your_database_name -f setup_transcript_table.sql
```

### 4. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

## How It Works

### Quiz Generation Flow
1. **Frontend Request**: User clicks "Start Quiz" with `quiz_id` and `grade`
2. **Database Lookup**: Backend fetches transcript for the given `quiz_id`
3. **AI Generation**: Gemini AI generates quiz based on transcript and grade level
4. **Response**: Returns quiz questions (without explanations) to frontend

### Quiz Evaluation Flow
1. **Answer Submission**: User submits answers after completing quiz
2. **AI Regeneration**: Backend regenerates the same quiz with explanations
3. **Evaluation**: Compares user answers with correct answers
4. **Results**: Returns detailed results with explanations

### Grade Level Mapping
- Grades 1-2: "foundational" (simple language, focusing on remembering)
- Grades 3-5: "preparatory" (basic understanding and connections)
- Grades 6-8: "middle" (application and analysis)
- Grades 9-12: "secondary" (analysis, evaluation, synthesis)

### Bloom's Taxonomy Integration
- 60% of questions target "Apply" level and above
- Questions progress from lower-order to higher-order thinking skills
- Each question includes bloom_level, concept, and needs_image fields

## API Endpoints

### POST /api/generate_quiz
**Request:**
```json
{
  "quiz_id": 1,
  "grade": "8"
}
```

**Response:**
```json
{
  "multiple_choice": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": "B",
      "bloom_level": "Remembering",
      "concept": "...",
      "needs_image": false,
      "grade": 8
    }
  ],
  "true_false": [
    {
      "question": "...",
      "answer": "True",
      "bloom_level": "Understanding",
      "concept": "...",
      "needs_image": true,
      "grade": 8
    }
  ]
}
```

### POST /api/evaluate_quiz
**Request:**
```json
{
  "quiz_id": 1,
  "answers": {
    "mc_0": "B",
    "tf_0": "True"
  },
  "grade": "8"
}
```

**Response:**
```json
{
  "quiz_id": 1,
  "totalQuestions": 4,
  "correctAnswers": 3,
  "percentage": 75,
  "gradeLevel": "Good",
  "results": [
    {
      "questionIndex": 1,
      "question": "...",
      "userAnswer": "B",
      "correctAnswer": "B",
      "isCorrect": true,
      "explanation": "...",
      "bloom_level": "Remembering",
      "concept": "...",
      "type": "multiple_choice",
      "needs_image": false
    }
  ],
  "submittedAt": "2024-01-01T12:00:00.000Z"
}
```

## Database Schema

### transcript table
```sql
CREATE TABLE transcript (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER UNIQUE NOT NULL,
    transcript TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

The system handles various error scenarios:
- Missing or invalid quiz_id
- Missing or invalid grade
- Transcript not found in database
- Gemini API failures
- JSON parsing errors

## Testing

Test the system by:
1. Starting the backend server
2. Using the sample transcripts provided in `setup_transcript_table.sql`
3. Making API calls with different quiz_ids (1-5) and grades (1-12)
4. Verifying quiz generation and evaluation responses
