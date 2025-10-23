#!/usr/bin/env python3
"""
Reads the JSON output from generate_concept_subsets.py and seeds the database.
Handles both "grade_range" (array) and "grade_level" (string) formats.
Now also seeds the supermodules and supermodule_submodules junction table.
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
# Maps each supermodule code to its child video codes
SUPERMODULES = {
    "L3.C1": [f"L3.C1.v{i}" for i in range(17, 21)],  
    "L3.C2": [f"L3.C2.v{i}" for i in range(21, 24)],  
    "L3.C3": ["L3.C3.v24"]   
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
    """Parses both 'grade_range' (array) and 'grade_level' (string like '5-8') into a list of ints."""
    if "grade_range" in concept and isinstance(concept["grade_range"], list):
        return concept["grade_range"]

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
    """Clears the tables before seeding."""
    print("🧹 Clearing existing data from all content tables...")
    cursor.execute(
        """
        TRUNCATE TABLE 
          supermodule_submodules, 
          supermodules, 
          submodules, 
          concepts, 
          concept_grade_mapping 
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

        json_files = list(OUTPUT_DIR.glob("*_concepts.json"))
        if not json_files:
            print(
                "❌ No JSON files found in 'output/'. Please run generate_concept_subsets.py first."
            )
            return

        # Track submodule_code -> submodule_id for later supermodule insertion
        code_to_id = {}

        for file_path in json_files:
            print(f"\n🌱 Processing file: {file_path.name}")
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            submodule_code = data.get("submodule_code")
            submodule_name = data.get("submodule_name")

            # Insert submodule
            transcript_path = TRANSCRIPT_DIR / f"{submodule_code}.txt"
            image_path = IMAGE_DIR / f"{submodule_code}.png"
            try:
                with open(transcript_path, "r", encoding="utf-8") as tf:
                    transcript = tf.read()
            except FileNotFoundError:
                print(f"   ⚠️ Transcript not found: {transcript_path}")
                transcript = None

            cursor.execute(
                """
                INSERT INTO submodules (submodule_code, submodule_name, image_path, transcript)
                VALUES (%s, %s, %s, %s)
                RETURNING id;
                """,
                (submodule_code, submodule_name, str(image_path), transcript),
            )
            submodule_id = cursor.fetchone()[0]
            code_to_id[submodule_code] = submodule_id
            print(f"   - Inserted submodule '{submodule_name}' with ID: {submodule_id}")

            # Insert concepts and mappings
            for concept in data.get("concepts", []):
                concept_name = concept.get("concept_name")
                ct_concepts = concept.get(
                    "ct_concepts", [concept.get("concept_description", "")]
                )
                description = concept.get("concept_description") or concept.get(
                    "description"
                )

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
                    print(
                        f"   ⚠️ WARNING: Concept '{concept_name}' has no valid grade range. It will NOT be mapped."
                    )
                    continue

                for grade in grade_range:
                    cursor.execute(
                        """
                        INSERT INTO concept_grade_mapping (concept_id, grade)
                        VALUES (%s, %s)
                        ON CONFLICT DO NOTHING;
                        """,
                        (concept_id, grade),
                    )
            print(
                f"   - Processed {len(data.get('concepts', []))} concepts for submodule {submodule_code}"
            )

        # Now seed supermodules and link them to submodules
        print("\n🔗 Seeding supermodules...")
        for sm_code, children in SUPERMODULES.items():
            cursor.execute(
                """
                INSERT INTO supermodules (supermodule_code, supermodule_name)
                VALUES (%s, %s)
                RETURNING id;
                """,
                (sm_code, sm_code),  # You can use a better name if desired
            )
            sup_id = cursor.fetchone()[0]
            print(f"   - Inserted supermodule '{sm_code}' with ID: {sup_id}")

            for child_code in children:
                if child_code not in code_to_id:
                    print(
                        f"   ⚠️ Child submodule '{child_code}' not found in database. Skipping link."
                    )
                    continue
                child_id = code_to_id[child_code]
                cursor.execute(
                    """
                    INSERT INTO supermodule_submodules (supermodule_id, submodule_id)
                    VALUES (%s, %s);
                    """,
                    (sup_id, child_id),
                )
            print(f"   - Linked {len(children)} submodules to '{sm_code}'")

    conn.commit()
    conn.close()
    print("\n✅ Database seeding complete (including supermodules)!")


if __name__ == "__main__":
    seed_data()
