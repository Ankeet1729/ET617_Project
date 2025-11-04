#!/usr/bin/env python3
"""
Generate 4 questions (one for each grade 5-8) for a specific video in a single API call.
Usage: python3 generate_questions_all_grades.py <video_number>
Example: python3 generate_questions_all_grades.py 17
"""

import os
import sys
import json
import csv
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image

load_dotenv()

# --- Configuration ---
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

genai.configure(api_key=GEMINI_API_KEY)

OUTPUT_DIR = Path("output")
TRANSCRIPT_DIR = Path("video_transcripts")
IMAGE_DIR = Path("submodule_images")
CSV_FILE = "quiz_generation_clean.csv"

# Video mapping
VIDEO_MAPPING = {
    1: "L1.C1.v1",
    6: "L1.C2.v6",
    9: "L1.C2.v9",
    11: "L2.C1.v11",
    14: "L2.C2.v14",
    17: "L3.C1.v17",
    19: "L3.C1.v19",
    22: "L3.C2.v22",
    23: "L3.C2.v23",
}

GRADES = [5, 6, 7, 8]

# --- Multi-Grade Question Generation Prompt ---
QUESTION_PROMPT = """
You are an expert quiz question writer for educational assessments. 
Generate FOUR multiple-choice questions - one for EACH grade level (5, 6, 7, 8).

### Context
- **Video Code:** {submodule_code}
- **Transcript:** Educational content for this lesson
- **Image:** Visual learning aid

### Concepts Available by Grade:

{concepts_by_grade}

### Instructions

1. **Generate EXACTLY FOUR questions - one for each grade (5, 6, 7, 8)**

2. **IMPORTANT - Concept Selection:**
   - Each question should test a DIFFERENT concept when possible
   - Pick randomly from available concepts for that grade
   - Questions should be INDEPENDENT of each other
   - If limited concepts, vary the angle/focus for each grade
   - DO NOT make all questions about the same topic with just difficulty variations

3. **Question Style:**
   - Write as if for a textbook or standardized test
   - DO NOT reference "the video", "the transcript", "the image", "the lesson"
   - Make it general and educational
   - Use "Which of the following...", "What happens when...", "How would you...", etc.

4. **Grade-Appropriate Difficulty:**
   - Grade 5: Simpler vocabulary, concrete examples
   - Grade 6: More abstract thinking
   - Grade 7: Analysis and application
   - Grade 8: Complex reasoning and synthesis

5. **Question Requirements:**
   - Clear and unambiguous wording
   - Real-world or practical context preferred
   - Test actual understanding, not memorization
   - **BE CREATIVE:** Don't quiz on exact examples from the video - use the concept but apply it differently
   - Questions can be about similar scenarios, not the exact one in the transcript

6. **Options (CRITICAL - Make distractors challenging but balanced):**
   - Provide exactly 4 options (A, B, C, D)
   - One clearly correct answer
   - Three STRONG distractors that:
     * Are plausible and tempting (could seem right at first glance)
     * Based on common misconceptions or partial understanding
     * NOT obviously wrong or silly
     * Require actual understanding to eliminate
   - **BALANCE:** Don't make answers too obvious, but don't make them confusing either
   - Similar length, complexity, and technical level for ALL options
   - Avoid patterns (e.g., all starting with same word, obvious outliers)

7. **Bloom's Taxonomy (FOCUS ON HIGHER LEVELS):**
   - Aim for "Applying" or "Analyzing" level primarily
   - Avoid simple recall/memorization questions
   - Use higher-order thinking: application, analysis, evaluation
   - Only 1-2 questions across all 4 grades can be "Remembering" or "Understanding" level

8. **Explanation:**
   - 2-3 sentences per question
   - First sentence: Why the correct answer is right
   - Second sentence: Why wrong answers are incorrect
   - Grade-appropriate language

### Output Format (Strict JSON - No markdown)

{{
  "questions": [
    {{
      "grade": 5,
      "question_text": "The complete question for grade 5?",
      "options": {{
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
      }},
      "correct_answer": "B",
      "bloom_level": "Applying",
      "explanation": "Brief explanation.",
      "concept_tested": "Concept name from grade 5 list"
    }},
    {{
      "grade": 6,
      "question_text": "The complete question for grade 6?",
      "options": {{
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
      }},
      "correct_answer": "C",
      "bloom_level": "Analyzing",
      "explanation": "Brief explanation.",
      "concept_tested": "Different concept from grade 6 list"
    }},
    {{
      "grade": 7,
      "question_text": "The complete question for grade 7?",
      "options": {{
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
      }},
      "correct_answer": "A",
      "bloom_level": "Applying",
      "explanation": "Brief explanation.",
      "concept_tested": "Another different concept from grade 7 list"
    }},
    {{
      "grade": 8,
      "question_text": "The complete question for grade 8?",
      "options": {{
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
      }},
      "correct_answer": "D",
      "bloom_level": "Analyzing",
      "explanation": "Brief explanation.",
      "concept_tested": "Yet another concept from grade 8 list"
    }}
  ]
}}

### Transcript:
{transcript}
"""


def parse_grade_level(grade_level_str):
    """Parse grade level string into list of grades."""
    if not grade_level_str:
        return []
    
    if '-' in grade_level_str:
        try:
            start, end = map(int, grade_level_str.split('-'))
            return list(range(start, end + 1))
        except ValueError:
            return []
    elif grade_level_str.isdigit():
        return [int(grade_level_str)]
    return []


def load_concepts_by_grade(submodule_code):
    """Load concepts grouped by grade."""
    json_path = OUTPUT_DIR / f"{submodule_code}_concepts.json"
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            all_concepts = data.get('concepts', [])
    except FileNotFoundError:
        print(f"❌ Concepts file not found: {json_path}")
        return {}
    
    # Group by grade
    concepts_by_grade = {5: [], 6: [], 7: [], 8: []}
    
    for concept in all_concepts:
        grade_levels = parse_grade_level(concept.get('grade_level', ''))
        for grade in grade_levels:
            if grade in concepts_by_grade:
                concepts_by_grade[grade].append(concept)
    
    return concepts_by_grade


def load_transcript(submodule_code):
    """Load transcript for video."""
    transcript_path = TRANSCRIPT_DIR / f"{submodule_code}.txt"
    try:
        with open(transcript_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"❌ Transcript not found: {transcript_path}")
        return None


def load_image(submodule_code):
    """Load image for video."""
    image_path = IMAGE_DIR / f"{submodule_code}.png"
    try:
        return Image.open(image_path)
    except FileNotFoundError:
        print(f"❌ Image not found: {image_path}")
        return None


def generate_all_questions(submodule_code, concepts_by_grade, transcript, image):
    """Call Gemini ONCE to generate questions for all grades."""
    
    # Format concepts by grade
    concepts_text = ""
    for grade in GRADES:
        concepts = concepts_by_grade.get(grade, [])
        concepts_text += f"\n**Grade {grade} Concepts ({len(concepts)} available):**\n"
        for c in concepts:
            concepts_text += f"  - {c['concept_name']}: {c.get('concept_description', '')}\n"
    
    # Build prompt
    prompt = QUESTION_PROMPT.format(
        submodule_code=submodule_code,
        concepts_by_grade=concepts_text,
        transcript=transcript
    )
    
    try:
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        content_parts = [prompt]
        
        if image:
            content_parts.append(image)
            print(f"   🖼️  Image included in API request")
        
        print(f"   🤖 Calling Gemini API (generating 4 questions at once)...")
        response = model.generate_content(content_parts)
        
        cleaned = response.text.strip()
        
        # Remove markdown fences
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:-3].strip()
        elif cleaned.startswith("```"):
            cleaned = cleaned[3:-3].strip()
        
        data = json.loads(cleaned)
        return data.get('questions', [])
        
    except Exception as e:
        print(f"❌ Gemini API error: {e}")
        return []


def format_question_for_csv(question_data):
    """Format question as text for CSV cell."""
    if not question_data:
        return ""
    
    q_text = question_data.get('question_text', '')
    options = question_data.get('options', {})
    correct = question_data.get('correct_answer', '')
    explanation = question_data.get('explanation', '')
    concept = question_data.get('concept_tested', '')
    
    formatted = f"Q: {q_text}\n\n"
    for key in ['A', 'B', 'C', 'D']:
        formatted += f"{key}. {options.get(key, '')}\n"
    formatted += f"\nCorrect: {correct}\n"
    formatted += f"Concept: {concept}\n"
    formatted += f"Explanation: {explanation}"
    
    return formatted


def update_csv(video_num, questions_by_grade):
    """Update the CSV with all generated questions."""
    
    # Read CSV
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        rows = list(reader)
    
    # Find the row and update all grade columns
    for row in rows:
        if int(row['Video Number']) == video_num:
            for grade, question_data in questions_by_grade.items():
                question_col = f'Questions_Grade_{grade}'
                question_text = format_question_for_csv(question_data)
                row[question_col] = question_text
            break
    
    # Write back
    with open(CSV_FILE, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)
    
    print(f"   ✅ Updated CSV: Video {video_num}, All grades")


def main():
    if len(sys.argv) != 2:
        print("Usage: python3 generate_questions_all_grades.py <video_number>")
        print("Example: python3 generate_questions_all_grades.py 17")
        sys.exit(1)
    
    try:
        video_num = int(sys.argv[1])
    except ValueError:
        print("❌ Video number must be an integer")
        sys.exit(1)
    
    # Validate input
    if video_num not in VIDEO_MAPPING:
        print(f"❌ Invalid video number. Choose from: {list(VIDEO_MAPPING.keys())}")
        sys.exit(1)
    
    submodule_code = VIDEO_MAPPING[video_num]
    
    print("=" * 60)
    print(f"📝 Generating Questions for Video {video_num}")
    print(f"   Submodule: {submodule_code}")
    print(f"   Grades: 5, 6, 7, 8 (4 questions total)")
    print("=" * 60)
    
    # Load concepts for all grades
    concepts_by_grade = load_concepts_by_grade(submodule_code)
    for grade in GRADES:
        count = len(concepts_by_grade.get(grade, []))
        print(f"   ✓ Grade {grade}: {count} concepts")
    
    # Load transcript
    transcript = load_transcript(submodule_code)
    if not transcript:
        sys.exit(1)
    print(f"   ✓ Loaded transcript")
    
    # Load image
    image = load_image(submodule_code)
    if not image:
        sys.exit(1)
    print(f"   ✓ Loaded image")
    
    # Generate all questions in ONE API call
    questions = generate_all_questions(submodule_code, concepts_by_grade, transcript, image)
    
    if len(questions) != 4:
        print(f"❌ Expected 4 questions, got {len(questions)}")
        sys.exit(1)
    
    # Organize by grade
    questions_by_grade = {}
    for q in questions:
        grade = q.get('grade')
        if grade in GRADES:
            questions_by_grade[grade] = q
            print(f"   ✓ Grade {grade}: {q.get('concept_tested', 'N/A')}")
    
    # Update CSV
    update_csv(video_num, questions_by_grade)
    
    print("\n" + "=" * 60)
    print("✅ Done! Check quiz_generation_clean.csv")
    print(f"💡 Saved API calls: 1 call instead of 4!")


if __name__ == "__main__":
    main()

