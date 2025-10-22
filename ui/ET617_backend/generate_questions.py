#!/usr/bin/env python3

"""
This script generates quiz questions for a specific submodule and grade
using the pre-populated concepts from the database.
It can either print the output to stdout or save it to a file.
"""

import os
import json
import psycopg2
from psycopg2.extras import DictCursor
from dotenv import load_dotenv
from pathlib import Path
import google.generativeai as genai
from PIL import Image
import sys

load_dotenv()

# --- Configuration ---
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

genai.configure(api_key=GEMINI_API_KEY)

# --- Prompt B: On-Demand Question Generation ---
PROMPT_B = """
You are an expert AI quiz generator for a Scratch programming curriculum. Your task is to create a set of questions for a specific grade and submodule based on the provided learning materials.

### Input Context
- **Submodule Code:** {submodule_code}
- **Grade:** {grade}
- **Submodule Transcript:** The full text content for the submodule.
- **Submodule Image:** A visual aid providing context.

### Concepts to Cover (MANDATORY: Generate ONE question for EACH concept listed below)

{concept_details}

### Instructions

1. **CRITICAL:** Generate EXACTLY one unique question for **each and every concept** listed above.

2. The question type should be either 'MCQ' (Multiple Choice with 4 options) or 'BOOLEAN' (True/False). Aim for 1-2 BOOLEAN questions if possible.

3. For BOOLEAN questions:
   - Use "correct_answer": "True" or "correct_answer": "False" (NOT "A" or "B")
   - Set "options": {{}} (empty object)

4. For MCQ questions:
   - Provide exactly 4 options labeled A, B, C, D
   - Set "correct_answer" to the letter of the correct option

5. Each question MUST:
   - Relate directly to the concept's description provided above
   - Reference the submodule's transcript and image context
   - Have an appropriate Bloom's Taxonomy level

6. Use the exact concept name as provided in the list above.

7. Follow the specified JSON output format precisely - NO extra text, NO markdown formatting.


IMPORTANT RULES FOR EXPLANATIONS:
- Each explanation MUST be 2-4 sentences
- FIRST sentence: Explain WHY the correct answer is right
- SECOND sentence: Briefly mention why 1-2 wrong answers are incorrect
- Use simple, grade-appropriate language
- Be specific and educational

### Output Format (Strict JSON - No extra text or markdown)

{{
  "questions": [
    {{
      "concept": "Exact concept name from the list",
      "grade": {grade},
      "type": "MCQ",
      "question_text": "The full text of the question?",
      "options": {{
        "A": "Option A text",
        "B": "Option B text",
        "C": "Option C text",
        "D": "Option D text"
      }},
      "correct_answer": "A",
      "bloom_level": "Applying",
        "explanation": "A brief explanation of the correct answer."
    }},
    {{
      "concept": "Another exact concept name",
      "grade": {grade},
      "type": "BOOLEAN",
      "question_text": "True or False: Statement about the concept?",
      "options": {{}},
      "correct_answer": "True",
      "bloom_level": "Understanding",
      "explanation": "A brief explanation of the correct answer."
    }}
  ]
}}
"""

def get_db_connection():
    """Establishes a connection to the PostgreSQL database."""
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT
        )
        return conn
    except psycopg2.OperationalError as e:
        print(json.dumps({"error": f"Database connection failed: {e}"}), file=sys.stderr)
        sys.exit(1)

def fetch_generation_context(submodule_code, grade):
    """Fetches all necessary data including concept descriptions from the database."""
    conn = get_db_connection()
    context = {}
    
    with conn.cursor(cursor_factory=DictCursor) as cursor:
        # Fetch submodule data
        cursor.execute(
            "SELECT transcript, image_path FROM submodules WHERE submodule_code = %s;",
            (submodule_code,)
        )
        submodule_data = cursor.fetchone()
        if not submodule_data:
            return None
        
        context['transcript'] = submodule_data['transcript']
        context['image_path'] = submodule_data['image_path']
        
        # Fetch concepts with FULL DETAILS (name, description, CT concepts)
        cursor.execute(
            """
            SELECT c.concept_name, c.description, c.ct_concepts
            FROM concepts c
            JOIN concept_grade_mapping cgm ON c.id = cgm.concept_id
            JOIN submodules s ON c.submodule_id = s.id
            WHERE s.submodule_code = %s AND cgm.grade = %s
            ORDER BY c.concept_name;
            """,
            (submodule_code, grade)
        )
        context['concepts'] = cursor.fetchall()
    
    conn.close()
    return context

def fix_boolean_questions(questions_data):
    """Convert BOOLEAN questions from A/B format to True/False format"""
    if not isinstance(questions_data, dict) or 'questions' not in questions_data:
        return questions_data
    
    for q in questions_data['questions']:
        # Check if it's a boolean question
        if q.get('type') == 'BOOLEAN' or q.get('type') == 'Boolean':
            # Normalize type
            q['type'] = 'BOOLEAN'
            
            # Fix correct_answer if it's A or B
            if q.get('correct_answer') == 'A':
                q['correct_answer'] = 'True'
            elif q.get('correct_answer') == 'B':
                q['correct_answer'] = 'False'
            
            # Ensure options is empty for boolean
            q['options'] = {}
    
    return questions_data

def send_to_gemini(prompt_text, image_object=None):
    """Sends a multimodal prompt to the Gemini API."""
    try:
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        content_parts = [prompt_text]
        
        if image_object:
            content_parts.append(image_object)
        
        response = model.generate_content(content_parts)
        cleaned_response = response.text.strip()
        
        # Remove markdown code blocks if present
        if cleaned_response.startswith("```json"):
            cleaned_response = cleaned_response[7:-3].strip()
        elif cleaned_response.startswith("```"):
            cleaned_response = cleaned_response[3:-3].strip()
        
        return cleaned_response
    except Exception as e:
        return json.dumps({"error": f"Gemini API call failed: {e}"})

def main(submodule_code, grade, output_file=None):
    """Main execution function for generating questions."""
    print(f"🔍 Generating questions for {submodule_code}, Grade {grade}...", file=sys.stderr)
    
    context = fetch_generation_context(submodule_code, grade)
    
    if not context or not context.get('concepts'):
        error_msg = {"error": f"Could not find concepts for submodule '{submodule_code}' and grade {grade}."}
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(error_msg, f, indent=2)
            print(f"❌ Error saved to {output_file}", file=sys.stderr)
        else:
            print(json.dumps(error_msg))
        return
    
    # Build detailed concept list with names, descriptions, and CT concepts
    concept_details = []
    for concept_row in context['concepts']:
        ct_list = concept_row['ct_concepts'] if isinstance(concept_row['ct_concepts'], list) else []
        ct_string = ', '.join(ct_list) if ct_list else 'N/A'
        
        description = concept_row['description'] if concept_row['description'] else 'No detailed description available.'
        
        concept_details.append(
            f"**{concept_row['concept_name']}**\n"
            f"  Description: {description}\n"
            f"  Computational Thinking Concepts: {ct_string}"
        )
    
    print(f"🔍 Found {len(concept_details)} concepts for this submodule/grade", file=sys.stderr)
    
    # Format the prompt with detailed concept information
    prompt = PROMPT_B.format(
        submodule_code=submodule_code,
        grade=grade,
        concept_details="\n\n".join(concept_details)
    )
    
    # Add transcript to the full prompt
    full_prompt = f"{prompt}\n\n### Submodule Transcript:\n{context['transcript']}"
    
    # Try to load the image
    try:
        img_object = Image.open(context['image_path'])
        print(f"✅ Loaded image from {context['image_path']}", file=sys.stderr)
    except (FileNotFoundError, TypeError, AttributeError) as e:
        img_object = None
        print(f"⚠️ Could not load image: {e}", file=sys.stderr)
    
    # Send to Gemini
    print("🤖 Calling Gemini API...", file=sys.stderr)
    response_text = send_to_gemini(full_prompt, img_object)
    
    # Process the response
    if output_file:
        try:
            json_data = json.loads(response_text)
            # Fix boolean questions
            json_data = fix_boolean_questions(json_data)
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(json_data, f, indent=2, ensure_ascii=False)
            print(f"✅ JSON output successfully saved to {output_file}", file=sys.stderr)
        except (json.JSONDecodeError, TypeError) as e:
            print(f"❌ Gemini returned invalid JSON: {e}", file=sys.stderr)
            print(f"Saving raw response to {output_file}", file=sys.stderr)
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(response_text or "")
    else:
        # Print to stdout (for Node.js to capture)
        try:
            json_data = json.loads(response_text)
            # Fix boolean questions
            json_data = fix_boolean_questions(json_data)
            print(json.dumps(json_data, ensure_ascii=False))
        except (json.JSONDecodeError, TypeError):
            print(response_text)

if __name__ == "__main__":
    if len(sys.argv) < 3 or len(sys.argv) > 4:
        print(json.dumps({"error": "Usage: python3 generate_questions.py <submodule_code> <grade> [output_file.json]"}))
        sys.exit(1)
    
    # Correctly parsing command-line arguments by index
    submodule_code_arg = sys.argv[1]
    grade_arg = int(sys.argv[2])
    output_file_arg = sys.argv[3] if len(sys.argv) == 4 else None
    
    main(submodule_code=submodule_code_arg, grade=grade_arg, output_file=output_file_arg)
