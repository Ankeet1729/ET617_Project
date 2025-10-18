import openpyxl
import os
from openpyxl_image_loader import SheetImageLoader

def extract_images_from_excel_sorted(xlsx_path):
    """
    Iterates over an XLSX file, extracts all images from each sheet,
    and saves them into subdirectories named after each sheet.
    The images are named based on their sheet and cell location.

    Args:
        xlsx_path (str): The file path to the .xlsx file.
    """
    # --- Create a main directory to save all extracted content ---
    parent_folder = "extracted_content"
    if not os.path.exists(parent_folder):
        os.makedirs(parent_folder)
    print(f"Images will be saved in the '{parent_folder}' directory, sorted by sheet name.")

    # --- Load the workbook ---
    try:
        workbook = openpyxl.load_workbook(xlsx_path)
    except FileNotFoundError:
        print(f"Error: The file '{xlsx_path}' was not found.")
        return

    # --- Iterate through each sheet in the workbook ---
    for sheet_name in workbook.sheetnames:
        sheet = workbook[sheet_name]
        print(f"\nProcessing sheet: '{sheet.title}'...")

        # --- Create a subdirectory for the current sheet ---
        sheet_output_folder = os.path.join(parent_folder, sheet.title)
        if not os.path.exists(sheet_output_folder):
            os.makedirs(sheet_output_folder)

        # Using openpyxl_image_loader to find images
        image_loader = SheetImageLoader(sheet)
        
        if not image_loader._images:
            print("  - No images found in this sheet.")
            continue

        # The library finds images by their cell location
        for cell_number in image_loader._images:
            try:
                # Get the image from the cell
                image = image_loader.get(cell_number)

                # --- Construct the new filename with the cell number ---
                extension = image.format.lower() if image.format else 'png' # Default to png if format is not detected
                new_filename = f"{sheet.title}-{cell_number}.{extension}"
                save_path = os.path.join(sheet_output_folder, new_filename)

                # --- Save the image ---
                image.save(save_path)
                print(f"  - Saved '{save_path}'")

            except Exception as e:
                print(f"  - Could not save image from cell {cell_number}. Reason: {e}")

# --- How to use the script ---
if __name__ == "__main__":
    # Replace 'extended_context.xlsx' with the name of your Excel file
    excel_file = "extended_context.xlsx" 
    extract_images_from_excel_sorted(excel_file)