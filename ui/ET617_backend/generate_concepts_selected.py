#!/usr/bin/env python3
"""
Generate concepts for selected videos: 1, 6, 9, 11, 14
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

# Only these 5 videos
VIDEO_DATA = [
    (1, 1, 1, "Introduction to Computer Components"),
    (1, 2, 6, "Introduction to Programming"),
    (1, 2, 9, "Problem Solving with Computers"),
    (2, 1, 11, "Scratch Interface and Blocks"),
    (2, 2, 14, "Sound and Events in Scratch"),
]

# Build SUBMODULES dictionary
SUBMODULES = {}
for lesson, chapter, video_num, name in VIDEO_DATA:
    key = f"L{lesson}.C{chapter}.v{video_num}"
    SUBMODULES[key] = {
        "transcript": f"video_transcripts/{key}.txt",
        "image": f"submodule_images/{key}.png",
        "name": name
    }

# --- Prompt A: Concept Extraction ---
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


def read_transcript(file_path):
    """Read transcript file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"❌ Transcript not found: {file_path}")
        return None


def open_image(file_path):
    """Open image file."""
    try:
        return Image.open(file_path)
    except FileNotFoundError:
        print(f"❌ Image not found: {file_path}")
        return None


def call_gemini(prompt_text, image_object=None):
    """Call Gemini API and return cleaned JSON text."""
    try:
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        content_parts = [prompt_text]
        if image_object:
            content_parts.append(image_object)
        
        response = model.generate_content(content_parts)
        cleaned = response.text.strip()
        
        # Remove markdown fences
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:-3].strip()
        elif cleaned.startswith("```"):
            cleaned = cleaned[3:-3].strip()
            
        return cleaned
    except Exception as e:
        print(f"❌ Gemini API error: {e}")
        return None


def save_to_json(submodule_code, data):
    """Save concepts to JSON file in output/ directory."""
    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)
    
    file_path = output_dir / f"{submodule_code}_concepts.json"
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print(f"   ✅ Saved: {file_path}")


def main():
    print("🚀 Generating Concepts for Videos 1, 6, 9, 11, 14")
    print("=" * 60)
    
    for lesson, chapter, video_num, name in VIDEO_DATA:
        submodule_code = f"L{lesson}.C{chapter}.v{video_num}"
        info = SUBMODULES[submodule_code]
        
        print(f"\n📹 Video {video_num}: {name}")
        print(f"   Code: {submodule_code}")
        
        # Read transcript
        transcript = read_transcript(info['transcript'])
        if not transcript:
            continue
        print(f"   ✓ Transcript loaded")
        
        # Open image
        image = open_image(info['image'])
        if not image:
            continue
        print(f"   ✓ Image loaded")
        
        # Create prompt
        prompt = PROMPT_A.format(
            submodule_name=name,
            submodule_code=submodule_code,
            transcript=transcript
        )
        
        # Call Gemini
        print(f"   🤖 Calling Gemini API...")
        response = call_gemini(prompt, image)
        
        if response:
            try:
                data = json.loads(response)
                concept_count = len(data.get('concepts', []))
                print(f"   ✓ Generated {concept_count} concepts")
                save_to_json(submodule_code, data)
                
                # Wait 10 seconds before next API call
                print(f"   ⏳ Waiting 10 seconds before next call...")
                time.sleep(10)
            except json.JSONDecodeError as e:
                print(f"   ❌ JSON parse error: {e}")
        else:
            print(f"   ❌ Failed to get response")
    
    print("\n" + "=" * 60)
    print("✅ Done! Check output/ directory for JSON files")


if __name__ == "__main__":
    main()

