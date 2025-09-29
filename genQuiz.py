import os
import json
import re
import time
import requests
from dotenv import load_dotenv

# === Load environment variables ===
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = "llama-3.1-8b-instant"

headers = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json"
}

# === Ask user for difficulty level ===
valid_levels = ["easy", "medium", "hard"]
print("🎯 Select a difficulty level for quiz generation:")
print("Options:", ", ".join(valid_levels))

difficulty = input("Enter difficulty level: ").strip().lower()
while difficulty not in valid_levels:
    print("❌ Invalid input. Please enter one of:", ", ".join(valid_levels))
    difficulty = input("Enter difficulty level: ").strip().lower()

# === Chunking to avoid token limits ===
def chunk_text(text, max_chars=5000):
    chunks = []
    while len(text) > max_chars:
        split_point = text.rfind('.', 0, max_chars)
        if split_point == -1:
            split_point = max_chars
        chunks.append(text[:split_point + 1])
        text = text[split_point + 1:]
    chunks.append(text)
    return chunks

# === Extract all JSON blocks from model output ===
def extract_all_json_blocks(text):
    blocks = re.findall(r"\{[\s\S]*?\}", text)
    parsed_blocks = []
    for block in blocks:
        try:
            parsed = json.loads(block)
            parsed_blocks.append(parsed)
        except json.JSONDecodeError:
            continue
    return parsed_blocks

# === Groq API call with retry on rate limit ===
def call_groq_with_retry(payload, retries=3):
    for attempt in range(retries):
        response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
        data = response.json()

        if "error" in data and data["error"]["code"] == "rate_limit_exceeded":
            wait_match = re.search(r"try again in ([\d.]+)s", data["error"]["message"])
            wait_time = float(wait_match.group(1)) if wait_match else 5
            print(f"⏳ Rate limit hit. Waiting {wait_time:.2f}s before retrying...")
            time.sleep(wait_time + 1)
        else:
            return data
    print("❌ Failed after retries.")
    return {"choices": [{"message": {"content": "Rate limit error"}}]}

# === Quiz Generation Function ===
def generate_quiz(transcript: str, difficulty: str, no_of_mcq=7, no_of_tf=3):
    prompt = f"""
You are an expert in educational psychology and curriculum design.
Your task is to generate a pedagogically sound quiz from the provided learning material,
tailored to a {difficulty} difficulty level and aligned with Bloom's Taxonomy and the NEP 5+3+3+4 framework.

### Instructions
1. Generate a quiz with exactly:
   - {no_of_mcq} Multiple Choice Questions (4 options each, one correct).
   - {no_of_tf} True/False Questions.
2. Ensure appropriate cognitive challenge and clarity.
3. Include explanations and mark Bloom level.
4. Add a field "needs_image" (true/false) for each question.

### Output Format (Strict JSON)
{{
  "multiple_choice": [
    {{
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": "B",
      "explanation": "...",
      "bloom_level": "Remembering",
      "needs_image": false
    }}
  ],
  "true_false": [
    {{
      "question": "...",
      "answer": "True",
      "explanation": "...",
      "bloom_level": "Understanding",
      "needs_image": true
    }}
  ]
}}

### Transcript:
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

    data = call_groq_with_retry(payload)

    try:
        content = data["choices"][0]["message"]["content"]
        parsed_blocks = extract_all_json_blocks(content)
        if parsed_blocks:
            return "\n\n".join(json.dumps(block, indent=2) for block in parsed_blocks)
        else:
            raise ValueError("No valid JSON blocks found")
    except Exception as e:
        print("⚠️ Failed to parse JSON. Returning raw response.")
        return data.get("choices", [{}])[0].get("message", {}).get("content", str(data))

# === Batch Quiz Generation ===
for i in range(1, 4):
    with open(f"column_B_output-{i}.txt", "r", encoding="utf-8") as f:
        combined_transcript = f.read()
    chunks = chunk_text(combined_transcript)
    full_quiz = []

    for idx, chunk in enumerate(chunks):
        quiz_json = generate_quiz(chunk, difficulty, no_of_mcq=2, no_of_tf=2)
        full_quiz.append(quiz_json)
        time.sleep(2)  # Delay between chunk requests

    with open(f"module_quiz-{i}.json", "w", encoding="utf-8") as f:
        f.write("\n\n".join(full_quiz))

    print(f"\n===== QUIZ GENERATED & SAVED TO module_quiz-{i}.json =====\n")