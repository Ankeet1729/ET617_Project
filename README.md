
# ET617 Quiz Generation Platform

An AI-powered quiz generation and management system for Scratch programming education. Built with Node.js, React, PostgreSQL, and Google Gemini AI.

## Features

- AI-Powered Quiz Generation: Automatically generate quizzes using Google Gemini AI based on video transcripts
- Hierarchical Content Structure: Organize content by supermodules → videos → quiz sets
- Student Dashboard: Take quizzes, view results, and track concept-level performance
- Admin Panel: Create, manage, and publish quiz sets with visibility controls
- Concept Tracking: Monitor student performance at individual concept level
- Manual Quiz Creation: Build custom quiz sets with the question editor

## Tech Stack

### Backend
- Node.js + Express.js - REST API server
- PostgreSQL - Relational database
- Google Gemini AI - Question generation
- bcrypt - Password hashing
- express-session - Session management

### Frontend
- React 18 with TypeScript
- Vite - Build tool
- Modern CSS with custom styling

### Python Scripts
- Python 3 - Concept extraction and question generation
- google-generativeai - Gemini API integration
- psycopg2 - PostgreSQL adapter

## Prerequisites

Before setting up this project, ensure you have the following installed:

- Node.js (v16 or higher)
- npm (comes with Node.js)
- PostgreSQL (v13 or higher)
- Python 3.8+
- pip (Python package manager)
- Git

## Installation

### 1. Clone the Repository

git clone <your-repository-url>
cd ET617_Project

### 2. Install Backend Dependencies

cd ui/ET617_backend
npm install

### 3. Install Frontend Dependencies

cd ../ET617_frontend
npm install

### 4. Install Python Dependencies

cd ../..
pip3 install python-dotenv psycopg2-binary google-generativeai pillow

## Database Setup

### 1. Create PostgreSQL Database

psql -U postgres
CREATE DATABASE postgres;

### 2. Run Database Schema

cd ui/ET617_backend
psql -U postgres -d postgres -f DDL_new.sql

This creates all required tables: supermodules, submodules, concepts, questions, question_sets, students, quiz_attempts, and more.

### 3. Verify Tables

psql -U postgres -d postgres -c "\\dt"

You should see 15 tables listed.

## Environment Configuration

### Backend Environment (.env)

Create ui/ET617_backend/.env:

DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
SESSION_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000

Get Your Gemini API Key:
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Create an API key
4. Copy and paste it into .env

### Python Environment (.env)

Create .env in the project root:

GEMINI_API_KEY=your_gemini_api_key_here

## Data Seeding

### 1. Prepare Content Files

Create the following directory structure:

ET617_Project/
├── video_transcripts/
│   ├── L3.C1.v17_transcript.txt
│   ├── L3.C2.v18_transcript.txt
│   └── ... (one per video)
└── submodule_images/
    ├── L3.C1.v17_image.png
    ├── L3.C2.v18_image.png
    └── ... (one per video)

### 2. Generate Concept JSON Files

Edit generate_concept_subsets.py and update the SUBMODULES dictionary with your video codes, then run:

python3 generate_concept_subsets.py

This creates output/ folder with *_concepts.json files.

### 3. Seed Database

python3 seed_database.py

This populates: Supermodules (L3.C1, L3.C2, L3.C3), Submodules (individual videos), Concepts and grade mappings

### 4. Verify Data

psql -U postgres -d postgres
SELECT * FROM supermodules;
SELECT * FROM submodules;
SELECT COUNT(*) FROM concepts;

## Running the Application

### 1. Start Backend Server

cd ui/ET617_backend
node app.js

You should see: Server running on port 5000

### 2. Start Frontend Development Server

cd ui/ET617_frontend
npm run dev

You should see: Local: http://localhost:5173/

### 3. Access the Application

- Student Portal: http://localhost:5173/
- Admin Portal: http://localhost:5173/ (click "Admin Login")

## Default Credentials

### Admin Login
- Username: root
- Password: admin

### Student Registration
Students must register first (no default accounts).

## Generating Quiz Sets

### Method 1: AI Generation (Recommended)

1. Log in as admin
2. Go to "Quiz Set Management"
3. Select Grade → Module → Video
4. Click "🤖 Generate AI Quiz"
5. Enter optional set name
6. Click "Generate Quiz"
7. Wait for AI to generate questions (~30 seconds)
8. Click "👁️ Show" to make it visible to students

### Method 2: Manual Creation

1. Log in as admin
2. Go to "Quiz Set Management"
3. Select Grade → Module → Video
4. Click "✏️ Create Manual Set"
5. Add questions one by one
6. Save and publish

## Project Structure

ET617_Project/
├── ui/
│   ├── ET617_backend/          # Node.js backend
│   │   ├── app.js              # Main Express server
│   │   ├── db.js               # PostgreSQL connection
│   │   ├── DDL_new.sql         # Database schema
│   │   └── package.json
│   └── ET617_frontend/         # React frontend
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── App.tsx         # Main app component
│       │   └── main.tsx        # Entry point
│       └── package.json
├── generate_concept_subsets.py # AI concept extraction
├── generate_questions.py       # AI question generation
├── seed_database.py           # Database seeding script
├── output/                    # Generated JSON files
├── video_transcripts/         # Video transcript files
└── submodule_images/          # Video thumbnail images

## API Endpoints

### Student Endpoints
- POST /register - Student registration
- POST /login - Student login
- GET /api/supermodules - List all modules
- GET /api/supermodules/:code/children - Get videos under module
- GET /api/student/quiz-sets/:grade/:submodule_code - Get visible quiz sets
- POST /api/evaluate_quiz - Submit quiz answers

### Admin Endpoints
- POST /admin/login - Admin login
- GET /admin/quizzes/grades - List grades
- GET /admin/quizzes/sets/:grade/:submodule_code - Manage quiz sets
- POST /generatequiz - Generate AI quiz
- PATCH /api/admin/quiz_sets/:id/visibility - Toggle visibility

## Troubleshooting

### Database Connection Issues

sudo systemctl status postgresql
sudo systemctl start postgresql
psql -U postgres -d postgres

### Port Already in Use

lsof -i :5000
kill -9 <PID>

### Missing Python Dependencies

pip3 install --upgrade python-dotenv psycopg2-binary google-generativeai pillow

### Quiz Sets Not Showing for Students

1. Verify quiz set exists and grade/submodule match
2. Check visibility status: SELECT id, set_name, is_hidden FROM question_sets;
3. Make visible in admin panel by clicking "👁️ Show"

### Gemini API Errors

- Verify API key in .env is correct
- Check API quota at https://makersuite.google.com/
- Ensure no extra spaces in .env file

## Database Management

### Backup Database

pg_dump -U postgres postgres > backup_$(date +%Y%m%d).sql

### Restore Database

psql -U postgres -d postgres < backup_20251019.sql

### Reset Database

psql -U postgres -d postgres -f DDL_new.sql
python3 seed_database.py

## Development Tips

### Hot Reload
- Backend: Use nodemon for auto-restart
  npm install -g nodemon
  nodemon app.js
- Frontend: Vite provides hot module replacement automatically

### Debug Mode
Add console logs in app.js for debugging requests and data

### Database Queries
Monitor queries in real-time using PostgreSQL logging

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT License - Educational purposes only.

## Support

For issues or questions, please contact the project maintainer.

---

Happy Teaching! 🎓
