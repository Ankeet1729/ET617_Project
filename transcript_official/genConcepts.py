
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

def generate_concepts(transcript: str):
    prompt = f"""
    I will give you a transcript of a video lesson. Your task is to extract and list 10 concepts covered in the lesson on which a quiz can be made. First 7 questions would be mcq and last 3 questions would be true-false.

    Return the output only as numbered points naming the concept in one or two words.

    1. xyz
    2. abc

    and so on. Do not write anythinig else.

    ### Transcript:
    {transcript}
    """

    # Assuming 'genai' is configured elsewhere in your code
    model = genai.GenerativeModel("gemini-2.5-flash") # or another suitable model
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
sheet_names = ["L3.C1", "L3.C2", "L3.C3"]
# grade = "3"

for sheet_name in sheet_names:
    folder_path = sheet_name
    print(f"\n=== Processing videos from {sheet_name} ===\n")

    # Process each transcript file inside the folder
    for file_name in sorted(os.listdir(folder_path)):
        file_path = os.path.join(folder_path, file_name)

        if os.path.isfile(file_path) and file_name.endswith(".txt"):
            # Read transcript for this video
            with open(file_path, "r", encoding="utf-8") as f:
                combined_transcript = f.read().strip()

            if not combined_transcript:
                continue  # skip empty transcripts

            # Generate quiz for this video
            quiz_json = generate_concepts(combined_transcript)

            # Save quiz with same video file base name
            video_name = os.path.splitext(file_name)[0]  # remove .txt
            quiz_file = os.path.join(folder_path, f"{video_name}_concepts.concepts")

            with open(quiz_file, "w", encoding="utf-8") as f:
                f.write(quiz_json)

            print(f"✔ Quiz saved for {sheet_name}/{video_name}")
