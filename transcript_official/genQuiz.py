
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("api_key")
genai.configure(api_key=api_key)

# -------------------------------
# 4. Generate quiz with Gemini
# -------------------------------

# import google.generativeai as genai

# Configure your API key
# genai.configure(api_key="YOUR_API_KEY")

def generate_quiz(transcript: str, grade: str, no_of_mcq=7, no_of_tf=3):
    """
    Generates a quiz from a transcript, tailored to a specific grade level
    and structured according to Bloom's Taxonomy.

    Args:
        transcript: The learning material text.
        grade: The target educational stage based on NEP. 
               Expected values: "foundational", "preparatory", "middle", "secondary".
        no_of_mcq: The number of multiple-choice questions to generate.
        no_of_tf: The number of true/false questions to generate.
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
        - **foundational (Grades 1-2):** Use very simple language. Questions should be direct and concrete. Focus on "Remembering."
        - **preparatory (Grades 3-5):** Use simple, clear language. Introduce questions that require basic "Understanding" and connections.
        - **middle (Grades 6-8):** Use standard terminology. Questions should test "Application" of concepts and basic "Analysis."
        - **secondary (Grades 9-12):** Use precise, academic language. Questions should challenge learners with "Analysis," "Evaluation," and synthesis of information.
    4.  **Cognitive Diversity (Based on Bloom's Taxonomy):**
        - Structure the quiz to have a gradual increase in cognitive demand.
        - Start with Lower-Order Thinking Skills (LOTS) and move to Higher-Order Thinking Skills (HOTS).
        - Distribute questions across these levels as appropriate for the grade:
            - **Remembering:** Recalling facts and basic concepts.
            - **Understanding:** Explaining ideas or concepts.
            - **Applying:** Using information in new situations.
            - **Analyzing:** Drawing connections among ideas.
            - **Evaluating:** Justifying a stand or decision.
    5.  **Question Quality:**
        - Ensure questions are unambiguous and directly based on the transcript's terminology.
        - The goal is to test comprehension and critical thinking, not just rote memorization.
    6.  Provide a concise explanation for each answer, referencing the core concept from the transcript.

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

    # Assuming 'genai' is configured elsewhere in your code
    model = genai.GenerativeModel("gemini-1.5-flash") # or another suitable model
    response = model.generate_content(prompt)
    
    return response.text
    
    # For demonstration, we'll just return the prompt itself.
    # return prompt

# # Example Usage:
# sample_transcript = """
# Photosynthesis is the process used by plants, algae, and certain bacteria to convert light energy into chemical energy. 
# During photosynthesis, these organisms take in carbon dioxide from the air and water from the soil. Using light energy
# from the sun, they convert these ingredients into glucose, which is a sugar that provides energy for the plant to grow. 
# A byproduct of this process is oxygen, which is released into the atmosphere. This process primarily occurs in the 
# chloroplasts of plant cells, which contain a pigment called chlorophyll. It is chlorophyll that absorbs the light energy
# and gives plants their green color. The overall chemical equation for photosynthesis is 6CO2 + 6H2O + Light Energy → 
# C6H12O6 + 6O2. This process is fundamental to life on Earth as it produces the oxygen we breathe and is the foundation
# of most food chains.
# """

# Generate a quiz for a middle schooler
# generated_prompt = generate_quiz(transcript=sample_transcript, grade="middle", no_of_mcq=2, no_of_tf=1)

# print(generated_prompt)

# Step 2: generate quiz
for i in range(1,4):
    with open(f"./column_B_output-{i}.txt", "r", encoding="utf-8") as f:
        combined_transcript = f.read()
      
    grade = '3'

    quiz_json = generate_quiz(combined_transcript, grade, no_of_mcq=7, no_of_tf=3)

    # Step 3: save quiz
    with open(f"module_quiz-{i}.json", "w", encoding="utf-8") as f:
        f.write(quiz_json)

    print(f"\n===== QUIZ GENERATED & SAVED TO module_quiz-{i}.json =====\n")