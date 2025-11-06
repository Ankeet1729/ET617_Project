#!/usr/bin/env python3
"""
Reads the JSON output from generate_all_concepts.py and seeds the database.
Handles both "grade_range" (array) and "grade_level" (string) formats.
This version seeds the NEW Level-1, Level-2, Level-3 supermodule structure.

** [V3 - Corrected insertion order logic] **
"""

import os
import json
import psycopg2
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

# --- Database Configuration ---
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

# --- File Configuration ---
OUTPUT_DIR = Path("output")
TRANSCRIPT_DIR = Path("video_transcripts")
IMAGE_DIR = Path("submodule_images")

# --- Supermodule Mapping ---
# Defines the new Level structure and maps video codes to each level.
# This part was correct.
SUPERMODULE_MAPPING = {
    "Level-1": {
        "name": "Computer Science Principles",
        "videos": [
            'L1.C1.v1', 'L1.C1.v2', 'L1.C1.v3', 'L1.C1.v4', 'L1.C1.v5',
            'L1.C2.v6', 'L1.C2.v7', 'L1.C2.v8', 'L1.C2.v9'
        ]
    },
    "Level-2": {
        "name": "Problem Solving & Thinking Skills",
        "videos": [
            'L2.C1.v10', 'L2.C1.v11', 'L2.C1.v12', 
            'L2.C2.v13', 'L2.C2.v14', 
            'L2.C3.v15', 'L2.C3.v16'
        ]
    },
    "Level-3": {
        "name": "Let's Code",
        "videos": [
            'L3.C1.v17', 'L3.C1.v18', 'L3.C1.v19', 'L3.C1.v20',
            'L3.C2.v21', 'L3.C2.v22', 'L3.C2.v23', 'L3.C3.v24'
        ]
    }
}


def get_db_connection():
    """Establishes a connection to the PostgreSQL database."""
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        return conn
    except psycopg2.OperationalError as e:
        print(f"❌ Could not connect to the database: {e}")
        return None


def parse_grade_range(concept):
    """Parses 'grade_level' (string like '5-8') into a list of ints."""
    if "grade_level" in concept and isinstance(concept["grade_level"], str):
        grade_str = concept["grade_level"]
        if "-" in grade_str:
            try:
                start, end = map(int, grade_str.split("-"))
                return list(range(start, end + 1))
            except ValueError:
                return []
        elif grade_str.isdigit():
            return [int(grade_str)]
    return []


def clear_tables(cursor):
    """
    Clears ALL tables (content and user data) for a complete reset.
    This matches the full table list from DDL_new.sql.
    """
    print("🧹 Clearing ALL data (content and users) from database...")
    cursor.execute(
        """
        TRUNCATE TABLE 
          student_concept_stats,
          student_activity,
          quiz_attempts,
          question_set_items,
          question_sets,
          questions,
          concept_grade_mapping,
          concepts,
          supermodule_submodules,
          supermodules,
          submodules,
          students
        RESTART IDENTITY CASCADE;
        """
    )

def seed_data():
    """Reads JSON files and populates the database."""
    conn = get_db_connection()
    if not conn:
        return

    with conn.cursor() as cursor:
        clear_tables(cursor)

        # Track submodule_code -> submodule_id
        code_to_id = {}
        # Track supermodule_code -> supermodule_id
        supermodule_code_to_id = {}

        print("--- Phase 1: Seeding Submodules and Concepts ---")
        
        # New Logic: Loop through the mapping to guarantee insertion order
        all_videos = []
        for level in SUPERMODULE_MAPPING:
            all_videos.extend(SUPERMODULE_MAPPING[level]['videos'])

        if not all_videos:
            print("❌ SUPERMODULE_MAPPING is empty. Cannot proceed.")
            return

        for submodule_code in all_videos:
            file_path = OUTPUT_DIR / f"{submodule_code}_concepts.json"
            print(f"\n🌱 Processing file: {file_path.name}")
            
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
            except FileNotFoundError:
                print(f"   ⚠️ Skipping {submodule_code}: File not found at {file_path}")
                continue

            submodule_name = data.get("submodule_name")

            if not submodule_name:
                print(f"   ⚠️ Skipping {file_path.name}: missing submodule_name in JSON.")
                continue

            # Define file paths based on the code
            transcript_path = TRANSCRIPT_DIR / f"{submodule_code}.txt"
            image_db_path = f"/uploads/submodules/{submodule_code}.png" 
            
            try:
                with open(transcript_path, "r", encoding="utf-8") as tf:
                    transcript = tf.read()
            except FileNotFoundError:
                print(f"   ⚠️ Transcript not found: {transcript_path}")
                transcript = None

            # Insert the submodule
            cursor.execute(
                """
                INSERT INTO submodules (submodule_code, submodule_name, image_path, transcript)
                VALUES (%s, %s, %s, %s)
                RETURNING id;
                """,
                (submodule_code, submodule_name, image_db_path, transcript),
            )
            submodule_id = cursor.fetchone()[0]
            code_to_id[submodule_code] = submodule_id  # Store the new ID
            print(f"   - Inserted submodule '{submodule_name}' with ID: {submodule_id}")

            # Insert concepts for this submodule
            concepts_processed = 0
            for concept in data.get("concepts", []):
                concept_name = concept.get("concept_name")
                description = concept.get("concept_description") or concept.get("description")
                ct_concepts = concept.get("ct_concepts", [description])

                if not concept_name or not description:
                    print(f"   ⚠️ Skipping concept in {submodule_code}: missing name or description.")
                    continue

                cursor.execute(
                    """
                    INSERT INTO concepts (submodule_id, concept_name, ct_concepts, description)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id;
                    """,
                    (submodule_id, concept_name, ct_concepts, description),
                )
                concept_id = cursor.fetchone()[0]

                grade_range = parse_grade_range(concept)
                if not grade_range:
                    print(f"   ⚠️ WARNING: Concept '{concept_name}' has no valid grade range.")
                    continue

                # Insert grade mappings
                for grade in grade_range:
                    cursor.execute(
                        """
                        INSERT INTO concept_grade_mapping (concept_id, grade)
                        VALUES (%s, %s)
                        ON CONFLICT DO NOTHING;
                        """,
                        (concept_id, grade),
                    )
                concepts_processed += 1
            print(f"   - Processed {concepts_processed} concepts for submodule {submodule_code}")

        
        print("\n--- Phase 2: Seeding Supermodules and Linking ---")
        
        # Now, insert supermodules and link them
        for sm_code, info in SUPERMODULE_MAPPING.items():
            sm_name = info["name"]
            child_video_codes = info["videos"]

            cursor.execute(
                """
                INSERT INTO supermodules (supermodule_code, supermodule_name)
                VALUES (%s, %s)
                RETURNING id;
                """,
                (sm_code, sm_name),
            )
            sup_id = cursor.fetchone()[0]
            print(f"   - Inserted supermodule '{sm_code}' ({sm_name}) with ID: {sup_id}")

            linked_count = 0
            for child_code in child_video_codes:
                if child_code not in code_to_id:
                    print(f"   ⚠️ Child submodule '{child_code}' not found. Skipping link.")
                    continue
                
                child_id = code_to_id[child_code] # Get the ID we saved
                
                cursor.execute(
                    """
                    INSERT INTO supermodule_submodules (supermodule_id, submodule_id)
                    VALUES (%s, %s)
                    ON CONFLICT DO NOTHING;
                    """,
                    (sup_id, child_id),
                )
                linked_count += 1
            print(f"   - Linked {linked_count} submodules to '{sm_code}'")

    conn.commit()
    conn.close()
    print("\n✅ Database seeding complete (with corrected logic)!")


if __name__ == "__main__":
    seed_data()