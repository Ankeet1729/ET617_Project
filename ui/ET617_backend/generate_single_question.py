#!/usr/bin/env python3
"""
Generate ONE question for a specific video and grade.
Usage: python3 generate_single_question.py <video_number> <grade>
Example: python3 generate_single_question.py 17 5
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

# --- Question Generation Prompt ---
QUESTION_PROMPT = """
You are an expert quiz question writer for educational assessments. 
Generate ONE high-quality multiple-choice question based on the provided concepts and learning materials.

### Context
- **Grade Level:** {grade}
- **Video Code:** {submodule_code}
- **Transcript:** Educational content for this lesson
- **Image:** Visual learning aid

### Concepts to Test (choose ONE or combine a few):
{concepts_list}

### Instructions

1. **Generate EXACTLY ONE multiple-choice question (MCQ)**

2. **Question Style:**
   - Write as if for a textbook or exam
   - DO NOT reference "the video", "the transcript", "the image", "the lesson"
   - Make it general and educational
   - Use "Which of the following...", "What happens when...", "How would you...", etc.

3. **Question Requirements:**
   - Test understanding of ONE main concept from the list
   - Appropriate difficulty for Grade {grade}
   - Clear and unambiguous wording
   - Real-world or practical context preferred

4. **Options (CRITICAL - Make distractors challenging):**
   - Provide exactly 4 options (A, B, C, D)
   - One clearly correct answer
   - Three STRONG distractors that:
     * Are plausible and tempting (could seem right at first glance)
     * Based on common misconceptions or partial understanding
     * NOT obviously wrong or silly
     * Require actual understanding to eliminate
   - Similar length, complexity, and technical level for ALL options
   - Avoid patterns (e.g., all starting with same word, obvious outliers)

5. **Bloom's Taxonomy:**
   - Aim for "Applying" or "Analyzing" level
   - Avoid simple recall questions

6. **Explanation:**
   - 2-3 sentences
   - First sentence: Why the correct answer is right
   - Second sentence: Why wrong answers are incorrect
   - Grade-appropriate language

### Output Format (Strict JSON - No markdown)

{{
  "question_text": "The complete question text?",
  "options": {{
    "A": "First option",
    "B": "Second option",
    "C": "Third option",
    "D": "Fourth option"
  }},
  "correct_answer": "B",
  "bloom_level": "Applying",
  "explanation": "Brief explanation of the answer.",
  "concept_tested": "Main concept name from the list"
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


def load_concepts_for_grade(submodule_code, grade):
    """Load and filter concepts for specific grade."""
    json_path = OUTPUT_DIR / f"{submodule_code}_concepts.json"
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            all_concepts = data.get('concepts', [])
    except FileNotFoundError:
        print(f"❌ Concepts file not found: {json_path}")
        return []
    
    # Filter by grade
    filtered = []
    for concept in all_concepts:
        grade_levels = parse_grade_level(concept.get('grade_level', ''))
        if grade in grade_levels:
            filtered.append(concept)
    
    return filtered


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


def generate_question(submodule_code, grade, concepts, transcript, image):
    """Call Gemini to generate one question."""
    
    # Format concepts list
    concepts_text = "\n".join([
        f"- {c['concept_name']}: {c.get('concept_description', '')}"
        for c in concepts
    ])
    
    # Build prompt
    prompt = QUESTION_PROMPT.format(
        grade=grade,
        submodule_code=submodule_code,
        concepts_list=concepts_text,
        transcript=transcript
    )
    
    try:
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        content_parts = [prompt]
        
        if image:
            content_parts.append(image)
        
        print(f"   🤖 Calling Gemini API...")
        response = model.generate_content(content_parts)
        
        cleaned = response.text.strip()
        
        # Remove markdown fences
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:-3].strip()
        elif cleaned.startswith("```"):
            cleaned = cleaned[3:-3].strip()
        
        return json.loads(cleaned)
        
    except Exception as e:
        print(f"❌ Gemini API error: {e}")
        return None


def format_question_for_csv(question_data):
    """Format question as text for CSV cell."""
    if not question_data:
        return ""
    
    q_text = question_data.get('question_text', '')
    options = question_data.get('options', {})
    correct = question_data.get('correct_answer', '')
    explanation = question_data.get('explanation', '')
    
    formatted = f"Q: {q_text}\n\n"
    for key in ['A', 'B', 'C', 'D']:
        formatted += f"{key}. {options.get(key, '')}\n"
    formatted += f"\nCorrect Answer: {correct}\n"
    formatted += f"Explanation: {explanation}"
    
    return formatted


def update_csv(video_num, grade, question_text):
    """Update the CSV with the generated question."""
    
    # Read CSV
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        rows = list(reader)
    
    # Find the row and update
    question_col = f'Questions_Grade_{grade}'
    
    for row in rows:
        if int(row['Video Number']) == video_num:
            row[question_col] = question_text
            break
    
    # Write back
    with open(CSV_FILE, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)
    
    print(f"   ✅ Updated CSV: Video {video_num}, Grade {grade}")


def main():
    if len(sys.argv) != 3:
        print("Usage: python3 generate_single_question.py <video_number> <grade>")
        print("Example: python3 generate_single_question.py 17 5")
        sys.exit(1)
    
    try:
        video_num = int(sys.argv[1])
        grade = int(sys.argv[2])
    except ValueError:
        print("❌ Video number and grade must be integers")
        sys.exit(1)
    
    # Validate inputs
    if video_num not in VIDEO_MAPPING:
        print(f"❌ Invalid video number. Choose from: {list(VIDEO_MAPPING.keys())}")
        sys.exit(1)
    
    if grade not in [5, 6, 7, 8]:
        print(f"❌ Invalid grade. Choose from: 5, 6, 7, 8")
        sys.exit(1)
    
    submodule_code = VIDEO_MAPPING[video_num]
    
    print("=" * 60)
    print(f"📝 Generating Question for Video {video_num}, Grade {grade}")
    print(f"   Submodule: {submodule_code}")
    print("=" * 60)
    
    # Load concepts
    concepts = load_concepts_for_grade(submodule_code, grade)
    if not concepts:
        print(f"❌ No concepts found for Grade {grade}")
        sys.exit(1)
    print(f"   ✓ Loaded {len(concepts)} concepts for Grade {grade}")
    
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
    
    # Generate question
    question_data = generate_question(submodule_code, grade, concepts, transcript, image)
    
    if not question_data:
        print("❌ Failed to generate question")
        sys.exit(1)
    
    print(f"   ✓ Question generated!")
    print(f"\n   Question: {question_data.get('question_text', '')[:80]}...")
    print(f"   Correct Answer: {question_data.get('correct_answer', '')}")
    print(f"   Concept: {question_data.get('concept_tested', '')}")
    
    # Format and update CSV
    question_text = format_question_for_csv(question_data)
    update_csv(video_num, grade, question_text)
    
    print("\n" + "=" * 60)
    print("✅ Done! Check quiz_generation_clean.csv")


if __name__ == "__main__":
    main()

