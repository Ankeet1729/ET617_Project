#!/usr/bin/env python3
"""
Fill ONLY the Concepts columns in quiz_generation_clean.csv
by reading from output/ folder JSON files and filtering by grade level.
"""

import json
import csv
from pathlib import Path

OUTPUT_DIR = Path("output")
CSV_FILE = "quiz_generation_clean.csv"  # Read and write to same file

# Video mapping
VIDEO_MAPPING = {
    1: "L1.C1.v1",
    6: "L1.C2.v6",
    9: "L1.C2.v9",
    11: "L2.C1.v11",
    14: "L2.C2.v14",
    17: "L3.C1.v17",
    19: "L3.C1.v19",
    22: "L3.C2.v22",
    23: "L3.C2.v23",
}

GRADES = [5, 6, 7, 8]


def parse_grade_level(grade_level_str):
    """Parse grade level string (e.g., '5-8', '1-4') into list of grades."""
    if not grade_level_str:
        return []
    
    if '-' in grade_level_str:
        try:
            start, end = map(int, grade_level_str.split('-'))
            return list(range(start, end + 1))
        except ValueError:
            return []
    elif grade_level_str.isdigit():
        return [int(grade_level_str)]
    return []


def load_concepts(submodule_code):
    """Load concepts from JSON file."""
    json_path = OUTPUT_DIR / f"{submodule_code}_concepts.json"
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('concepts', [])
    except FileNotFoundError:
        print(f"   ⚠️  Concepts not found: {json_path}")
        return []


def filter_concepts_by_grade(concepts, grade):
    """Filter concepts applicable to the given grade."""
    filtered = []
    for concept in concepts:
        grade_levels = parse_grade_level(concept.get('grade_level', ''))
        if grade in grade_levels:
            filtered.append(concept['concept_name'])
    return filtered


def format_concepts_list(concepts):
    """Format concepts as numbered list."""
    if not concepts:
        return ""
    return "\n".join([f"{i+1}. {c}" for i, c in enumerate(concepts)])


def fill_csv():
    """Fill concepts columns in CSV."""
    print("🚀 Filling Concepts in CSV")
    print("=" * 60)
    
    # Read existing CSV
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        rows = list(reader)
    
    # Process each row
    for row in rows:
        video_num = int(row['Video Number'])
        submodule_code = VIDEO_MAPPING.get(video_num)
        
        if not submodule_code:
            print(f"⚠️  No mapping for video {video_num}")
            continue
        
        print(f"\n📹 Video {video_num}: {submodule_code}")
        
        # Load all concepts
        all_concepts = load_concepts(submodule_code)
        
        if not all_concepts:
            print(f"   ⚠️  No concepts found, skipping...")
            continue
        
        # Filter and fill for each grade
        for grade in GRADES:
            grade_concepts = filter_concepts_by_grade(all_concepts, grade)
            concepts_formatted = format_concepts_list(grade_concepts)
            
            # Update the row
            concepts_col = f'Concepts_Grade_{grade}'
            row[concepts_col] = concepts_formatted
            
            print(f"   Grade {grade}: {len(grade_concepts)} concepts")
    
    # Write updated CSV (overwrite original)
    with open(CSV_FILE, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)
    
    print("\n" + "=" * 60)
    print(f"✅ Concepts filled in: {CSV_FILE}")
    print("\nNext step: Generate questions for each grade")


if __name__ == "__main__":
    fill_csv()

