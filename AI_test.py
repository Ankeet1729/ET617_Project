import os
import requests
import json
from dotenv import load_dotenv

# Load API key from .env file
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Use Groq's production model ID
GROQ_MODEL = "llama-3.1-8b-instant"

headers = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json"
}

transcript = "Explain the concept of entropy in thermodynamics..."

prompt = f"""
Generate 5 multiple-choice questions from the following transcript.
Each question should include:
- A clear question stem
- Four answer options labeled A-D
- The correct answer marked
- A Bloom's taxonomy level
- A flag if the question needs an image

Transcript:
{transcript}
"""

payload = {
    "model": GROQ_MODEL,
    "messages": [
        {"role": "system", "content": "You are an expert quiz generator."},
        {"role": "user", "content": prompt}
    ],
    "temperature": 0.3,
    "max_tokens": 2048
}

response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
data = response.json()

try:
    content = data["choices"][0]["message"]["content"]
    print("\n🧠 Generated Quiz:\n")
    print(content)
except Exception as e:
    print("❌ Failed to extract quiz content:", e)
    print(json.dumps(data, indent=2))