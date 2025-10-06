import requests
import json
import time
import os

# API endpoint for generation
generate_url = "https://api.freepik.com/v1/ai/mystic"

# Endpoint for status check (replace {task_id} with actual ID)
status_url_template = "https://api.freepik.com/v1/ai/mystic/{task_id}"

# Headers (replace with your actual key)
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "x-freepik-api-key": "FPSX80ac31ed1d1e0c0539b1d17ce5f3b8b7"  # Replace this!
}

# Request body for cat image
question = """      "question": "What is the purpose of creating clones of sprites in the snow dance project?",
      "options": ["To create a single snowflake that moves across the screen", "To create multiple snowflakes that move across the screen", "To eliminate the need for using the 'glide' block", "To only allow for one snowflake to be visible at a time"],
      "answer": "To create multiple snowflakes that move across the screen",
      "explanation": "Creating clones of sprites in the snow dance project allows for multiple snowflakes to be created and move across the screen, making the animation more realistic and engaging.",
      "bloom_level": "Applying","""
data = {
    "prompt": f"The quizzes are based on coding for middle grade students. These are based on coding lessons on Scratch Programming. A simple, clear, educational illustration for a quiz, they should clearly represent the question and aid the understanding of question for the middle school students, visually representing the core concept: '{question}'. Style: clean, illustrative, no text, high contrast for clarity.",
    "aspect_ratio": "widescreen_16_9"
}

# Step 1: Submit the generation request
print("Submitting generation request...")
response = requests.post(generate_url, headers=headers, data=json.dumps(data))

if response.status_code != 200:
    print(f"Error submitting request: {response.status_code} - {response.text}")
    exit(1)

result = response.json()
task_id = result["data"]["task_id"]
print(f"Task submitted! Task ID: {task_id}")
print(f"Initial status: {result['data']['status']}")

# Step 2: Poll for status
status_url = status_url_template.format(task_id=task_id)
max_wait_time = 300  # 5 minutes max
poll_interval = 10   # Check every 10 seconds

start_time = time.time()
while time.time() - start_time < max_wait_time:
    print(f"Checking status... (waited {int(time.time() - start_time)}s)")
    status_response = requests.get(status_url, headers=headers)
    
    if status_response.status_code != 200:
        print(f"Error checking status: {status_response.status_code} - {status_response.text}")
        exit(1)
    
    status_result = status_response.json()
    status = status_result["data"]["status"]
    print(f"Current status: {status}")
    
    if status == "COMPLETED":
        generated_urls = status_result["data"]["generated"]
        if generated_urls:
            print("Image ready! URL(s):")
            for i, url in enumerate(generated_urls, 1):
                print(f"{i}. {url}")
                
                # Download the first image to local file
                if i == 1:
                    img_response = requests.get(url)
                    if img_response.status_code == 200:
                        with open("generated_cat.jpg", "wb") as f:
                            f.write(img_response.content)
                        print("Downloaded to 'generated_cat.jpg' – open it to view!")
                    else:
                        print("Failed to download image.")
        else:
            print("Completed but no images generated – check your prompt or quota.")
        break
    elif status == "FAILED":
        print("Task failed – check your API key, quota, or prompt.")
        print(status_result)
        break
    
    time.sleep(poll_interval)

if time.time() - start_time >= max_wait_time:
    print("Timed out waiting for completion. Check status manually later.")
