import os
from PIL import Image
import re

def create_video_mega_images(parent_folder):
    """
    Walks through a directory structure of sheet/video_name/images,
    and for each video_name folder, it combines all images into a single
    horizontal "mega image".

    Args:
        parent_folder (str): The path to the main directory (e.g., 'extracted_content_by_video').
    """
    print(f"Starting to process folders inside '{parent_folder}'...")

    if not os.path.isdir(parent_folder):
        print(f"Error: The directory '{parent_folder}' was not found.")
        print("Please make sure you have run the image extraction script first.")
        return

    # os.walk will traverse the entire directory tree from the parent_folder
    for root, dirs, files in os.walk(parent_folder):
        # We are looking for folders that contain our 'pX.png' images
        image_files = [
            f for f in files
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')) and f.startswith('p')
        ]

        # If we found image files in the current folder, let's process them
        if image_files:
            video_name = os.path.basename(root)
            print(f"\nProcessing video folder: '{video_name}'")

            # --- Important: Sort the images numerically (p1, p2, p10) ---
            image_files.sort(key=lambda f: int(re.search(r'p(\d+)', f).group(1)))

            images = [Image.open(os.path.join(root, fname)) for fname in image_files]

            # Calculate dimensions for the new mega image
            total_width = sum(img.width for img in images)
            max_height = max(img.height for img in images)

            # Create a new blank canvas
            mega_image = Image.new('RGB', (total_width, max_height), (255, 255, 255))

            # Paste each image onto the canvas
            current_x = 0
            for img in images:
                mega_image.paste(img, (current_x, 0))
                current_x += img.width

            # Save the final combined image in the same video folder
            output_filename = f"mega_image_{video_name}.png"
            save_path = os.path.join(root, output_filename)
            
            try:
                mega_image.save(save_path)
                print(f"  - Successfully created and saved '{save_path}'")
            except Exception as e:
                print(f"  - Could not save the mega image for '{video_name}'. Reason: {e}")

# --- How to use the script ---
if __name__ == "__main__":
    # This should be the folder created by the new extraction script
    main_directory = "extracted_content_by_video"
    create_video_mega_images(main_directory)