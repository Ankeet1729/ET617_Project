import os
import pandas as pd

# File and sheet details
spreadsheet_path = "transcript.xlsx"
sheet_names = ["L3.C1", "L3.C2", "L3.C3"]

def save_transcript(video_name, lines, output_folder):
    """Helper to save transcript lines into a file"""
    if not video_name or not lines:
        return
    safe_name = str(video_name).replace(" ", "_")  # make file system safe
    file_path = os.path.join(output_folder, f"{safe_name}.txt")
    with open(file_path, "w", encoding="utf-8") as f:
        for line in lines:
            f.write(str(line).strip() + "\n")

# Loop through each sheet
for sheet_name in sheet_names:
    print(f"Processing sheet: {sheet_name}")

    # Create output folder for this sheet
    output_folder = sheet_name
    os.makedirs(output_folder, exist_ok=True)

    # Load sheet into a DataFrame
    df = pd.read_excel(spreadsheet_path, sheet_name=sheet_name)

    # Initialize variables for this sheet
    current_video = None
    current_lines = []

    # Iterate over rows
    for _, row in df.iterrows():
        video_col = row.iloc[0]  # Column A
        text_col = row.iloc[1]   # Column B

        if pd.notna(video_col) and str(video_col).strip().lower() != "sub-section":
            # Save previous transcript before starting a new one
            save_transcript(current_video, current_lines, output_folder)

            # Reset for new video
            current_video = str(video_col).strip()
            current_lines = []

        if pd.notna(text_col):
            current_lines.append(text_col)

    # Save last transcript in the sheet
    save_transcript(current_video, current_lines, output_folder)

    print(f"✔ Transcripts saved inside folder '{output_folder}'")
