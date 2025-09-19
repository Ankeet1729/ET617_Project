import pandas as pd

# File and sheet details
spreadsheet_path = "transcript.xlsx"
sheet_name = "L3.C3"
output_file = "column_B_output-3.txt"

# Load the sheet into a DataFrame
dataframe = pd.read_excel(spreadsheet_path, sheet_name=sheet_name)

# Extract column B (second column: 0 = A, 1 = B), drop empty values
column_b_values = dataframe.iloc[:, 1].dropna().tolist()

# Write each value into a new line of the output file
with open(output_file, "w", encoding="utf-8") as f:
    for value in column_b_values:
        f.write(str(value) + "\n")

print(f"Column B values have been written to {output_file}")
