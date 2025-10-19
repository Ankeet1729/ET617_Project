import os
from PIL import Image

def create_mega_images(parent_folder):
    """
    Goes through each subdirectory in a parent folder, combines all images
    found within it into a single horizontal "mega image", and saves it.

    Args:
        parent_folder (str): The path to the main directory containing image subfolders.
    """
    print(f"Starting to process folders inside '{parent_folder}'...")

    # Check if the parent directory exists
    if not os.path.isdir(parent_folder):
        print(f"Error: The directory '{parent_folder}' was not found.")
        print("Please make sure you have run the image extraction script first.")
        return

    # Get all the subdirectories (e.g., L3.C1, L3.C2)
    subfolders = [f.path for f in os.scandir(parent_folder) if f.is_dir()]

    if not subfolders:
        print("No subfolders found to process.")
        return

    # Process each subfolder
    for folder in subfolders:
        sheet_name = os.path.basename(folder)
        print(f"\nProcessing folder: '{sheet_name}'")

        # Find all image files in the current folder
        image_files = [
            f for f in os.listdir(folder)
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))
        ]

        if not image_files:
            print("  - No images found in this folder.")
            continue

        # Open all images and store them
        images = [Image.open(os.path.join(folder, fname)) for fname in image_files]

        # Calculate dimensions for the new mega image
        total_width = sum(img.width for img in images)
        max_height = max(img.height for img in images)

        # Create a new blank image (canvas) with the calculated dimensions
        mega_image = Image.new('RGB', (total_width, max_height), (255, 255, 255))

        # Paste each image onto the canvas, one after the other
        current_x = 0
        for img in images:
            mega_image.paste(img, (current_x, 0))
            current_x += img.width

        # Save the final combined image
        output_filename = f"mega_image_{sheet_name}.png"
        save_path = os.path.join(folder, output_filename)
        
        try:
            mega_image.save(save_path)
            print(f"  - Successfully created and saved '{save_path}'")
        except Exception as e:
            print(f"  - Could not save the mega image. Reason: {e}")

# --- How to use the script ---
if __name__ == "__main__":
    # This should be the folder created by the previous script
    # It contains the subfolders like L3.C1, L3.C2 etc.
    main_directory = "extracted_content"
    create_mega_images(main_directory)