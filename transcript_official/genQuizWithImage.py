import os
import json
import requests
import time
from dotenv import load_dotenv
from PIL import Image
import io

# --- 1. Setup ---
load_dotenv()
huggingface_token = os.getenv("HF_TOKEN")

if not huggingface_token:
    raise ValueError("HF_TOKEN not found. Please set it in your .env file.")

if not os.path.exists("quiz_images"):
    os.makedirs("quiz_images")

# --- 2. Updated Image Generation Function for Hugging Face API ---
def generate_image_for_question(question_text: str, image_path: str, retries=3, delay=20):
    """
    Generates an image using the Hugging Face Inference API with a retry mechanism.
    Resizes the image to 400x400 pixels for consistency.
    """
    api_url = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
    headers = {"Authorization": f"Bearer {huggingface_token}"}
    prompt = (
        "A simple, clear, educational illustration for a quiz, 400x400 pixels, "
        f"visually representing the core concept: '{question_text}'. "
        "Style: clean, illustrative, no text, high contrast for clarity."
    )
    payload = {"inputs": prompt}

    response = None  # Define response here to access it in the general except block
    for i in range(retries):
        try:
            print(f"   -> Calling Hugging Face API... (Attempt {i+1}/{retries})")
            response = requests.post(api_url, headers=headers, json=payload, timeout=120)

            if response.status_code == 503:
                try:
                    estimated_time = response.json().get("estimated_time", delay)
                    print(f"   ⚠️ Model is loading, waiting for {estimated_time:.2f} seconds...")
                    time.sleep(estimated_time)
                except ValueError:  # Fallback for JSON parsing failure
                    print(f"   ⚠️ Failed to parse 503 response, waiting {delay} seconds...")
                    time.sleep(delay)
                continue

            response.raise_for_status()

            # Check if content is empty
            if not response.content or len(response.content) < 100:
                raise ValueError("Empty or invalid image data received")

            # Use Pillow to open, resize to 400x400, and save
            image = Image.open(io.BytesIO(response.content)).convert("RGB")
            # Use Image.LANCZOS for compatibility with older Pillow versions
            image = image.resize((400, 400), Image.LANCZOS)
            image.save(image_path, "PNG", optimize=True)
            
            # Verify file was saved
            if os.path.exists(image_path) and os.path.getsize(image_path) > 0:
                print(f"   ✅ Image saved to {image_path}")
                return image_path
            else:
                raise ValueError("Failed to save image file")

        except requests.exceptions.RequestException as req_err:
            print(f"   ❌ Request error occurred: {req_err}")
            if response is not None:
                print(f"   Response: {response.text[:200]}...")
            if i == retries - 1:
                break
        except Exception as e:
            print(f"   ❌ An unexpected error occurred: {e}")
            if response is not None:
                print(f"   Response: {response.text[:200]}...")

        # Small delay between retries (except for 503 which is handled separately)
        if i < retries - 1:
            time.sleep(delay)

    print("   ❌ Failed to generate image after all retries.")
    return None

# --- 3. Main Workflow ---
def add_images_to_quiz(input_json_path: str, output_json_path: str):
    try:
        with open(input_json_path, "r", encoding="utf-8") as f:
            quiz_data = json.load(f)
    except FileNotFoundError:
        print(f"Error: Input file not found: {input_json_path}")
        return

    print(f"\nProcessing {input_json_path} to add images...")
    for q_type in ["multiple_choice", "true_false"]:
        for i, question in enumerate(quiz_data.get(q_type, [])):
            if question.get("needs_image"):
                print(f" - Generating image for: '{question['question'][:60]}...'")
                image_filename = f"module_{input_json_path[-6]}_{q_type}_q{i+1}.png"
                image_filepath = os.path.join("quiz_images", image_filename)
                generated_path = generate_image_for_question(question['question'], image_filepath)
                question['image_path'] = generated_path
                
                # Pause to respect HF free tier rate limits (adjust as needed; ~30-60s recommended)
                if generated_path:
                    print("   ...Pausing for 60 seconds to respect rate limits...")
                    time.sleep(60)

    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(quiz_data, f, indent=4)
    print(f"\n✨ Success! Updated quiz saved to {output_json_path}")

if __name__ == "__main__":
    for i in range(1, 4):
        input_file = f"module_quiz-{i}.json"
        output_file = f"module_quiz_with_images-{i}.json"
        add_images_to_quiz(input_file, output_file)