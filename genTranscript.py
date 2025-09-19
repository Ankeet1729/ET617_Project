import os
import whisper
import google.generativeai as genai
from dotenv import load_dotenv
import glob

# -------------------------------
# 1. Load API key
# -------------------------------
load_dotenv()
api_key = os.getenv("api_key")
genai.configure(api_key=api_key)

# -------------------------------
# 2. Transcribe a single video
# -------------------------------
def transcribe_video(video_path: str) -> str:
    print(f"Transcribing {video_path} ...")
    model = whisper.load_model("base")  # can use "small", "medium", or "large" for higher accuracy
    result = model.transcribe(video_path)
    transcript = result["text"]
    print(f"✅ Done: {video_path}")
    return transcript

# -------------------------------
# 3. Combine transcripts from multiple videos
# -------------------------------
def transcribe_module(video_paths: list) -> str:
    all_transcripts = []
    for v in video_paths:
        text = transcribe_video(v)
        all_transcripts.append(f"[Transcript from {os.path.basename(v)}]\n{text}\n")
    combined = "\n".join(all_transcripts)
    return combined

# -------------------------------
# 4. Run pipeline
# -------------------------------
if __name__ == "__main__":
    module_nos = ["1", "2", "3"]

    for module_no in module_nos:
        print(f"\n===== PROCESSING MODULE {module_no} =====\n")
        module_videos = glob.glob(f"./module{module_no}/*.mp4")

        # Step 1: transcribe all videos
        
        combined_transcript = transcribe_module(module_videos) + "\n\n"
        with open(f"transcript_module{module_no}.txt", "w", encoding="utf-8") as f:
            f.write(combined_transcript)
    

    # Step 2: generate quiz
    # quiz_json = generate_quiz(combined_transcript, no_of_mcq=7, no_of_tf=3)
    
    # Step 3: save quiz
    # with open("module_quiz.json", "w", encoding="utf-8") as f:
        # f.write(quiz_json)

    # print("\n===== QUIZ GENERATED & SAVED TO module_quiz.json =====\n")
