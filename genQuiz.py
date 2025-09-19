
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("api_key")
genai.configure(api_key=api_key)

# -------------------------------
# 4. Generate quiz with Gemini
# -------------------------------

def generate_quiz(transcript: str, no_of_mcq=7, no_of_tf=3):
    prompt = f"""
    You are an expert educational content creator. 
    Your task is to generate quizzes from provided learning material.

    ### Instructions
    1. Read the transcript carefully.
    2. Generate exactly:
       - {no_of_mcq} Multiple Choice Questions (with 4 options each, one correct answer).
       - {no_of_tf} True/False Questions.
    3. Questions must:
       - Use the same terminology as the transcript.
       - Be unambiguous and test comprehension, not memorization.
       - Increase in difficulty gradually.
    4. Provide answers and explanations.

    ### Output Format (JSON)
    {{
      "multiple_choice": [
        {{
          "question": "...",
          "options": ["A", "B", "C", "D"],
          "answer": "B",
          "explanation": "..."
        }}
      ],
      "true_false": [
        {{
          "question": "...",
          "answer": "True",
          "explanation": "..."
        }}
      ]
    }}

    ### Combined Transcript:
    {transcript}
    """

    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(prompt)

    return response.text


# Step 2: generate quiz
for i in range(1,4):
    with open(f"./module{i}/transcript_module{i}.txt", "r", encoding="utf-8") as f:
        combined_transcript = f.read()

    quiz_json = generate_quiz(combined_transcript, no_of_mcq=7, no_of_tf=3)

    # Step 3: save quiz
    with open("module_quiz.json", "w", encoding="utf-8") as f:
        f.write(quiz_json)

    print("\n===== QUIZ GENERATED & SAVED TO module_quiz.json =====\n")