#!/usr/bin/env python3
"""
This script generates quiz questions for a specific submodule and grade
using the pre-populated concepts from the database.
It can either print the output to stdout or save it to a file.
"""

import os
import json
import psycopg2
from psycopg2.extras import DictCursor # Import DictCursor
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
-   **Submodule Code:** {submodule_code}
-   **Grade:** {grade}
-   **Submodule Transcript:** The full text content for the submodule.
-   **Submodule Image:** A visual aid providing context.

### Concept Subset (MANDATORY: Generate ONE question for EACH concept listed below)
{concept_subset}

### Instructions
1.  **CRITICAL:** Generate EXACTLY one unique question for **each and every concept** listed in the "Concept Subset" section above.
2.  The question type should be either 'MCQ' (Multiple Choice with 4 options) or 'BOOLEAN' (True/False). Aim for 1-2 BOOLEAN questions if possible.
3.  Each question must be directly related to its corresponding concept and the submodule's transcript and image.
4.  Assign an appropriate Bloom's Taxonomy level to each question (`Remembering`, `Understanding`, `Applying`, `Analyzing`, `Evaluating`).
5.  Follow the specified JSON output format precisely.

### Output Format (Strict JSON - No extra text or markdown)
{{
  "questions": [
    {{
      "concept": "Name of the concept from the subset",
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
      "bloom_level": "Applying"
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
        print(json.dumps({"error": f"Database connection failed: {e}"}))
        sys.exit(1)

def fetch_generation_context(submodule_code, grade):
    """Fetches all necessary data from the database to generate a quiz."""
    conn = get_db_connection()
    context = {}
    with conn.cursor(cursor_factory=DictCursor) as cursor:
        cursor.execute(
            "SELECT transcript, image_path FROM submodules WHERE submodule_code = %s;",
            (submodule_code,)
        )
        submodule_data = cursor.fetchone()
        if not submodule_data:
            return None
        context['transcript'] = submodule_data['transcript']
        context['image_path'] = submodule_data['image_path']

        cursor.execute(
            """
            SELECT c.concept_name, c.ct_concepts
            FROM concepts c
            JOIN concept_grade_mapping cgm ON c.id = cgm.concept_id
            JOIN submodules s ON c.submodule_id = s.id
            WHERE s.submodule_code = %s AND cgm.grade = %s;
            """,
            (submodule_code, grade)
        )
        context['concept_subset'] = cursor.fetchall()
    
    conn.close()
    return context

def send_to_gemini(prompt_text, image_object=None):
    """Sends a multimodal prompt to the Gemini API."""
    try:
        model = genai.GenerativeModel('gemini-2.5-pro')
        content_parts = [prompt_text]
        if image_object:
            content_parts.append(image_object)
        
        response = model.generate_content(content_parts)
        
        cleaned_response = response.text.strip()
        if cleaned_response.startswith("```json"):
            cleaned_response = cleaned_response[7:-3].strip()
            
        return cleaned_response
    except Exception as e:
        return json.dumps({"error": f"Gemini API call failed: {e}"})

def main(submodule_code, grade, output_file=None):
    """Main execution function for generating questions."""
    context = fetch_generation_context(submodule_code, grade)
    if not context or not context.get('concept_subset'):
        error_msg = {"error": f"Could not find concepts for submodule '{submodule_code}' and grade {grade}."}
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(error_msg, f, indent=2)
            print(f"❌ Error saved to {output_file}")
        else:
            print(json.dumps(error_msg))
        return

    concept_list_str = []
    for concept_row in context['concept_subset']:
        ct_list = concept_row['ct_concepts'] if isinstance(concept_row['ct_concepts'], list) else []
        concept_list_str.append(f"- {concept_row['concept_name']} (CT: {', '.join(ct_list)})")
    
    prompt = PROMPT_B.format(
        submodule_code=submodule_code,
        grade=grade,
        concept_subset="\n".join(concept_list_str)
    )
    full_prompt = f"{prompt}\n\n### Submodule Transcript:\n{context['transcript']}"

    try:
        img_object = Image.open(context['image_path'])
    except (FileNotFoundError, TypeError, AttributeError):
        img_object = None

    response_text = send_to_gemini(full_prompt, img_object)
    
    if output_file:
        try:
            json_data = json.loads(response_text)
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(json_data, f, indent=2)
            print(f"✅ JSON output successfully saved to {output_file}")
        except (json.JSONDecodeError, TypeError):
            print(f"❌ Gemini returned invalid JSON. Saving raw response to {output_file}.")
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(response_text or "")
    else:
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

