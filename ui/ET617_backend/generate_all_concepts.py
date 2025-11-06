#!/usr/bin/env python3
"""
Script to generate concept subsets for ALL 24 submodules using Gemini AI.
This script replaces generate_concept_subsets.py and generate_concepts_selected.py.

It reads from a single MASTER_VIDEO_DATA list.
The output is saved to 24 JSON files in the 'output/' directory.
"""

import os
import json
import time
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

# ---
# This list defines all 24 videos, their official names,
# and the `submodule_code` used to find their transcript and image files.
#
# All names have been filled in from your provided list.
# ---
MASTER_VIDEO_DATA = [
    # --- Level 1: Computer Science Principles (Videos 1-9) ---
    {'code': 'L1.C1.v1', 'name': 'Let\'s cook a computer story'},
    {'code': 'L1.C1.v2', 'name': 'What\'s inside the magic box?'},
    {'code': 'L1.C1.v3', 'name': 'The Input-Process-Output model'},
    {'code': 'L1.C1.v4', 'name': 'Do computers think, feel and learn like humans? A sneak peak into Machine Learning'},
    {'code': 'L1.C1.v5', 'name': 'Who learns Computer Science? Role models in CS & STEM'},
    {'code': 'L1.C2.v6', 'name': 'Internet, What\'s caught in the net?'},
    {'code': 'L1.C2.v7', 'name': 'Digital literacy - Keeping away from Plagiarism'},
    {'code': 'L1.C2.v8', 'name': 'Multi-factor Authentication'},
    {'code': 'L1.C2.v9', 'name': 'BigData Poor Privacy'},

    # --- Level 2: Problem Solving & Thinking Skills (Videos 10-16) ---
    {'code': 'L2.C1.v10', 'name': 'Little acts of kindness makes a huge difference'},
    {'code': 'L2.C1.v11', 'name': 'Let\'s solve problems Big or Small - Design thinking approach'},
    {'code': 'L2.C1.v12', 'name': 'A sneak peak into the wild edibles digital library'},
    {'code': 'L2.C2.v13', 'name': 'Include, Ignore, Divide and Conquer - The roti making'},
    {'code': 'L2.C2.v14', 'name': 'Sequencing & Algorithms - The wild edibles app demo'},
    {'code': 'L2.C3.v15', 'name': 'Introduction to the scratch coding platform - sprites, costumes and code'},
    {'code': 'L2.C3.v16', 'name': 'Nature\'s best algorithms - coding for the metamorphosis'},

    # --- Level 3: Let's Code (Videos 17-24) ---
    {'code': 'L3.C1.v17', 'name': 'Infinite loops of anger & kindness'},
    {'code': 'L3.C1.v18', 'name': 'Emotions are variables'},
    {'code': 'L3.C1.v19', 'name': 'Catch your thoughts with conditions'},
    {'code': 'L3.C1.v20', 'name': 'Binary thoughts and boolean logic'},
    {'code': 'L3.C2.v21', 'name': 'Let\'s karaoke'},
    {'code': 'L3.C2.v22', 'name': 'Funny face filters'},
    {'code': 'L3.C2.v23', 'name': 'Let\'s create some patterns with shapes'},
    {'code': 'L3.C3.v24', 'name': 'Code for the net-zero - Planting trees'},
]

# Submodule configuration (builds automatically from MASTER_VIDEO_DATA)
SUBMODULES = {}
for video in MASTER_VIDEO_DATA:
    key = video['code']
    SUBMODULES[key] = {
        "transcript": f"video_transcripts/{key}.txt",
        "image":      f"submodule_images/{key}.png",
        "name":       video['name']
    }

# --- Prompt A: Concept Extraction ---
# (Using the more general prompt from generate_concepts_selected.py)
PROMPT_A = """
You are an expert educational content analyst specializing in computer science and programming education. 
Your task is to analyze the given transcript and image to create a structured list of testable concepts.

### Input Context
- **Submodule Name:** {submodule_name}
- **Submodule Code:** {submodule_code}
- **Transcript:** The full text for this video lesson
- **Image:** Visual aids, diagrams, or screenshots

### Instructions

1. **Analyze deeply:** Read the transcript and examine the image carefully to identify all key educational concepts being taught.

2. **Identify Concepts:** Extract concepts that are:
   - Clear and testable (can be assessed with questions)
   - Specific enough to be meaningful
   - Suitable for the content (computer hardware, algorithms, programming, or Scratch)

3. **Concept Types may include:**
   - Computer Hardware (CPU, RAM, GPU, Storage, etc.)
   - Computer Science Fundamentals (Algorithms, data, computational thinking)
   - Programming Basics (Sequences, events, loops, conditions, variables)
   - Scratch-Specific (Blocks, sprites, motion, looks, sound)

4. **Grade Level Assignment (FLEXIBLE - Use ANY range that fits):**
   - Assign grade ranges based on ACTUAL concept complexity
   - Can be ANY range: "1-4", "3-7", "5-10", "2-6", "6-12", etc.
   - Examples:
     * Very basic concepts → "1-4" or "1-5"
     * Intermediate concepts → "3-8" or "4-9"  
     * Advanced concepts → "7-12" or "8-12"
     * Concepts that span widely → "1-8", "3-10", "5-12"
   - **Be flexible!** Don't force concepts into fixed buckets
   - Consider: Can a 3rd grader understand this? Can a 10th grader learn from this?
   - **IMPORTANT**: Please just use a simple string range like "5-8" or "1-4".

5. **Quality Requirements:**
   - Generate 10-15 concepts per video
   - Be specific and concrete
   - Ensure concepts are testable
   - Use clear, concise names
   - Write descriptive explanations (2-3 sentences)

### Output Format (Strict JSON - No markdown, no extra text)

{{
  "submodule_code": "{submodule_code}",
  "submodule_name": "{submodule_name}",
  "concepts": [
    {{
      "concept_name": "Short, clear concept name",
      "concept_description": "Brief 2-3 sentence description explaining the concept and its context",
      "grade_level": "5-8"
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
        # Using the gemini-2.5-pro model for best results
        model = genai.GenerativeModel('gemini-2.5-flash')
        content_parts = [prompt_text]
        if image_object:
            content_parts.append(image_object)
        
        # Add a delay to avoid hitting rate limits too quickly
        print("   ...waiting 5 seconds to avoid rate limits...")
        time.sleep(5) 
        
        response = model.generate_content(content_parts)
        
        cleaned_response = response.text.strip()
        if cleaned_response.startswith("```json"):
            cleaned_response = cleaned_response[7:-3].strip()
        elif cleaned_response.startswith("```"):
            cleaned_response = cleaned_response[3:-3].strip()
            
        return cleaned_response
    except Exception as e:
        print(f"❌ Error calling Gemini API: {e}")
        # Add a longer delay if there's an error
        print("   ...Error occurred, waiting 20 seconds before next attempt...")
        time.sleep(20)
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
    print("🚀 Starting Concept Subset Generation for ALL 24 Videos")
    print("=" * 50)
    
    if not SUBMODULES:
        print("❌ No submodules to process. Please fill in the 'TODO' names")
        print("in the MASTER_VIDEO_DATA list in the script.")
        return

    print(f"Found {len(SUBMODULES.keys())} videos to process.")

    for submodule_code, info in SUBMODULES.items():
        print(f"\n📚 Processing Submodule: {submodule_code} ({info['name']})")
        
        # Check if the JSON file already exists
        output_file = Path("output") / f"{submodule_code}_concepts.json"
        if output_file.exists():
            print(f"   ↪️  Skipping {submodule_code}: JSON file already exists.")
            continue

        transcript = read_file_content(info['transcript'])
        img_object = open_image(info['image'])
        
        if not transcript or not img_object:
            print(f"Skipping {submodule_code} due to missing files.")
            print(f"   (Checked: {info['transcript']} and {info['image']})")
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