#!/usr/bin/env python3
"""
Script to generate concept subsets for each submodule using Gemini AI.
This runs ONCE to populate the concept_subset and related tables.
The output is saved to JSON files in the 'output/' directory.
"""

import os
import json
from dotenv import load_dotenv
from pathlib import Path
import google.generativeai as genai
from PIL import Image

load_dotenv()

# --- Configuration ---
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

genai.configure(api_key=GEMINI_API_KEY)

# Submodule configuration
SUBMODULES = {
    'L3.C1': {
        'transcript': 'L3.C1_combined_transcript.txt',
        'image': 'submodule_images/L3.C1_image.png',
        'name': 'Just be, Just code - Code your emotions'
    },
    'L3.C2': {
        'transcript': 'L3.C2_combined_transcript.txt',
        'image': 'submodule_images/L3.C2_image.png',
        'name': 'Code, for the love of...'
    },
    'L3.C3': {
        'transcript': 'L3.C3_combined_transcript.txt',
        'image': 'submodule_images/L3.C3_image.png',
        'name': 'Code with purpose'
    }
}

# --- Prompt A: Concept Subset Generation (Final Version) ---
PROMPT_A = """
You are an expert educational content analyst specializing in Scratch programming. 
Your task is to analyze the given transcript and image to create a structured list of testable concepts.
Please remember that the concepts must be directly related to Scratch programming and computational thinking.

### Input Context
-   Submodule Name: {submodule_name}
-   Combined Transcript: The full text for this submodule (combined transcript of all the videos of this submodule).
-   Module Image: Contains the combined image for this submodule. Please look into this very carefully in order to get an extended better context to generate better concept list.

### Instructions
1.  Analyze the transcript and image deeply (lay more emphasis to the image) to identify computational thinking concepts.
2.  Identify the specific **Scratch Computational Thinking (CT) Concepts** being taught. These concepts should be concrete and directly related to Scratch blocks or programming logic (e.g., "using variables," "if-then-else logic," "event handling").
3.  **Use the examples below as a guide for the style and specificity of the CT concepts.** Do NOT limit yourself to this list; identify all relevant concepts from the transcript and the images.
4.  Determine the appropriate grade range for each concept based on cognitive complexity (1-12).
5.  Structure your output in the exact JSON format specified below.
6. Try to generate at least 12-15 concepts for each submodule. Don't get vague or generic. Be specific to Scratch programming. If the transcripts are vauge, please refer to the image for better context.
7. Remember that these concepts will be used for creating assessment questions, so they must be clear and testable.
8. be concise short/medium length in your concept names (just like in the examples)
9. The concept description should be a brief explanation of the concept. This should be descriptive enough to be used by the question generation model to understand what the concept entails. You can give additional context related to the image or transcript if it helps to better generated the question later.
10. There should also be a field called grade level. There are three levels:
Low Grade: (1-4)
Medium Grade: (5-8)
High Grade: (9-12)
They could be a mix as well, like "1-8", "5-12" etc.
Based on the complexity of the concept, assign a grade level range to each concept. Remember to mention the grade level as "1-4", "5-8", "9-12", "1-8", "5-12", "1-12" any of the given.

### Guiding Examples for CT Concepts (handwritten for submodule L3.C3):
> If conditionals
> variables
> broadcast&receive
> functions
> glide to block
> Conditionals
> pen
> stamp
> x and y co-ordinates
> mouse down event
> Tree count variable - checking number of trees planted
> if touching trees block
> create clone of

### Output Format (Strict JSON - Do not add any extra text or markdown)
{{
  "submodule_code": "{submodule_code}",
  "submodule_name": "{submodule_name}",
  "concepts": [
    {{
      concept_name: "Concept Name 1",
      concept_description: "Brief description of Concept Name 1",
      grade_level: "1-4"
    }}
  ]
}}

### Transcript Content:
{transcript}
"""

def read_file_content(file_path):
    """Reads text file content."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"❌ Error: Transcript file not found at {file_path}")
        return None

def open_image(file_path):
    """Opens an image file using Pillow."""
    try:
        return Image.open(file_path)
    except FileNotFoundError:
        print(f"❌ Error: Image file not found at {file_path}")
        return None

def send_to_gemini(prompt_text, image_object=None):
    """Sends prompt to Gemini API and returns cleaned JSON text."""
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
        print(f"❌ Error calling Gemini API: {e}")
        return None

def save_output_to_json(submodule_code, concepts_data):
    """Saves the generated concepts data to a JSON file."""
    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)
    
    file_path = output_dir / f"{submodule_code}_concepts.json"
    
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(concepts_data, f, indent=2)
        print(f"✅ Successfully saved concepts to {file_path}")
    except Exception as e:
        print(f"❌ Error saving JSON file for {submodule_code}: {e}")

def main():
    """Main execution function."""
    print("🚀 Starting Concept Subset Generation")
    print("=" * 50)
    
    for submodule_code, info in SUBMODULES.items():
        print(f"\n📚 Processing Submodule: {submodule_code} ({info['name']})")
        
        transcript = read_file_content(info['transcript'])
        img_object = open_image(info['image'])
        
        if not transcript or not img_object:
            print(f"Skipping {submodule_code} due to missing files.")
            continue
            
        prompt = PROMPT_A.format(
            submodule_name=info['name'],
            submodule_code=submodule_code,
            transcript=transcript
        )
        
        print("🤖 Calling Gemini API...")
        response_text = send_to_gemini(prompt, img_object)
        
        if response_text:
            try:
                concepts_data = json.loads(response_text)
                print("✔️ JSON response parsed successfully.")
                save_output_to_json(submodule_code, concepts_data)
            except json.JSONDecodeError as e:
                print(f"❌ JSON parsing error: {e}")
                print(f"Raw response from API:\n---\n{response_text}\n---")
        else:
            print("❌ Failed to get a valid response from Gemini API.")
    
    print("\n" + "=" * 50)
    print("✅ Concept subset generation script finished.")
    print("Please check the 'output/' directory for the generated JSON files.")

if __name__ == "__main__":
    main()

