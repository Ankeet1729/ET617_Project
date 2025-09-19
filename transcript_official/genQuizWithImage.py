import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image
import io

# --- 1. Setup and Configuration ---
# Load environment variables from a .env file
load_dotenv()
api_key = os.getenv("api_key")

# Ensure the API key is available
if not api_key:
    raise ValueError("API key not found. Please set the 'api_key' in your .env file.")

genai.configure(api_key=api_key)

# Create a directory to save generated images
if not os.path.exists("images"):
    os.makedirs("images")

# --- 2. Quiz Generation Function (Your Original Prompt) ---

def generate_quiz(transcript: str, grade: str, no_of_mcq=7, no_of_tf=3):
    """
    Generates a quiz from a transcript by calling the Gemini API.
    """
    prompt = f"""
    You are an expert in educational psychology and curriculum design. 
    Your task is to generate a pedagogically sound quiz from the provided learning material,
    keeping the learner's cognitive development in mind.

    ### Input Parameters
    1. Grade Level: {grade}
    2. Transcript: Provided at the end.

    ### Instructions
    1.  Read the entire transcript to understand the core concepts.
    2.  Generate a quiz with exactly:
        - {no_of_mcq} Multiple Choice Questions (4 options each, one correct).
        - {no_of_tf} True/False Questions.
    3.  **Grade-Level Adaptation (Based on NEP 5+3+3+4 System):**
        - **foundational (Grades 1-2):** Use very simple language. Focus on "Remembering."
        - **preparatory (Grades 3-5):** Use simple, clear language. Focus on "Understanding."
        - **middle (Grades 6-8):** Use standard terminology. Focus on "Application" and "Analysis."
        - **secondary (Grades 9-12):** Use precise, academic language. Focus on "Analysis" and "Evaluation."
    4.  **Cognitive Diversity (Based on Bloom's Taxonomy):**
        - Structure the quiz to have a gradual increase in cognitive demand from LOTS to HOTS.
        - Distribute questions across these levels: Remembering, Understanding, Applying, Analyzing, Evaluating.
    5.  **Question Quality:**
        - Ensure questions are unambiguous and directly based on the transcript's terminology.
    6.  Provide a concise explanation for each answer.

    ### Output Format (Strict JSON)
    {{
      "multiple_choice": [
        {{
          "question": "...",
          "options": ["A", "B", "C", "D"],
          "answer": "B",
          "explanation": "...",
          "bloom_level": "Remembering"
        }}
      ],
      "true_false": [
        {{
          "question": "...",
          "answer": "True",
          "explanation": "...",
          "bloom_level": "Understanding"
        }}
      ]
    }}

    ### Transcript:
    {transcript}
    """
    
    # Initialize the Gemini model for text generation
    model = genai.GenerativeModel("gemini-1.5-flash-latest")
    response = model.generate_content(prompt)
    
    # Clean up the response to ensure it's valid JSON
    cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
    return cleaned_response

# --- 3. Image Generation Function for Quiz Options ---

def generate_image_for_option(option_text: str, image_path: str):
    """
    Generates an image for a given text option using a dedicated image model.
    """
    try:
        # Use the dedicated model for image generation
        image_model = genai.GenerativeModel('gemini-2.5-flash-image-preview')
        
        # Create a specific prompt for the image
        image_prompt = f"A simple, clear, small icon-style image representing the concept: '{option_text}'"
        
        # Generate the image content
        response = image_model.generate_content(image_prompt)
        
        # Access the image data from the response
        image_data = response.images[0]._blob
        
        # Save the image
        image = Image.open(io.BytesIO(image_data))
        image.save(image_path)
        print(f"   -> Image saved to {image_path}")
        return image_path
    except Exception as e:
        print(f"   -> Failed to generate image for '{option_text}'. Error: {e}")
        return None

# --- 4. Main Execution Flow ---

if __name__ == "__main__":
    # Loop through your transcript files
    for i in range(1, 2):
        transcript_file = f"./column_B_output-{i}.txt"
        output_file = f"module_quiz_with_images-{i}.json"
        
        print(f"\n===== PROCESSING MODULE {i} =====\n")
        
        # Step 1: Read the transcript
        try:
            with open(transcript_file, "r", encoding="utf-8") as f:
                combined_transcript = f.read()
        except FileNotFoundError:
            print(f"Error: Transcript file not found: {transcript_file}. Skipping.")
            continue

        # Step 2: Generate the initial quiz JSON
        print(f"1. Generating quiz from {transcript_file}...")
        quiz_json_str = generate_quiz(combined_transcript, grade="middle", no_of_mcq=7, no_of_tf=3)
        
        try:
            quiz_data = json.loads(quiz_json_str)
        except json.JSONDecodeError:
            print(f"Error: Failed to parse the quiz JSON for module {i}. Skipping.")
            continue
        
        # Step 3: Chain to image generation for each MCQ option
        print("\n2. Generating images for MCQ options...")
        mcq_list = quiz_data.get("multiple_choice", [])
        
        for q_idx, question in enumerate(mcq_list):
            print(f" - Processing Question {q_idx + 1}: '{question['question'][:40]}...'")
            # We will store image paths in a new key
            question["option_images"] = {}
            options = question.get("options", [])
            
            for opt_idx, option_text in enumerate(options):
                # Create a unique, descriptive path for each image
                image_filename = f"module-{i}_q-{q_idx+1}_opt-{opt_idx+1}.png"
                image_filepath = os.path.join("images", image_filename)
                
                # Generate the image and get its path
                generated_path = generate_image_for_option(option_text, image_filepath)
                
                # Add the path to our data ('None' if failed)
                question["option_images"][option_text] = generated_path
        
        # Step 4: Save the final quiz with image paths
        print(f"\n3. Saving final quiz with image paths to {output_file}...")
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(quiz_data, f, indent=4)
            
        print(f"\n===== MODULE {i} COMPLETE =====\n")