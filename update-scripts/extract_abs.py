
import csv
import json
import os
import sys

def extract_abs_rankings(csv_file_path, output_file='abs_rankings.json'):
    """
    Extracts ABS rankings from a CSV file and creates a dictionary.
    
    Args:
        csv_file_path: Path to the CSV file
        output_file: Path to save the JSON output (optional)
    
    Returns:
        Dictionary with journal titles (lowercase) as keys and dict with ABS Ranking
    """
    abs_dict = {}
    
    with open(csv_file_path, 'r', encoding='utf-8') as file:
        # CSV here uses , as delimiter
        reader = csv.reader(file, delimiter=',')
        header=next(reader) # Skip the first line that contains the headers

        for row in reader:        
            title = row[1].strip().lower()
            rank = row[2].strip()

            abs_dict[title] = {'abs': rank}

    print(f"{len(abs_dict)} journal added\n")

    # Save to JSON file
    if output_file:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(abs_dict, f, indent=2, ensure_ascii=False)
        print(f"ABS rankings saved in {output_file}\n")

    return abs_dict

def generate_javascript_dict(abs_dict, output_file = 'abs_rankings.js'):
    """
    Generate a JavaScript file with the |ABS rankings dictionary.
    
    Args:
        abs_dict: Dictionary with journal titles and ABS data
        output_file: Path to save the JavaScript file
    """

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('var abs_rankings = {\n')
        
        for i, (title, data) in enumerate(sorted(abs_dict.items())):
            # Add comma for all lines except the last one
            comma = ',' if i < len(abs_dict) - 1 else ''
            f.write(f'    "{title}": {{abs: "{data["abs"]}"}}{comma}\n')
        
        f.write('};\n')
    
    print(f"ABS JavaScript dictionary saved to {output_file}")




if __name__ == "__main__":
    
    if len(sys.argv) < 2:
        print('!!! Filename not provided. Execute the script with the filename in the command line (e.g., python extract_abs.py ABS-2024.csv)')
        exit()

    csv_file = sys.argv[1]
    
    if os.path.exists(csv_file):
        print('Import file exists')
    else:
        print('!!! Import file does not exist')
        exit()

    print("Extracting ABS rankings from CSV...")
    abs_dict = extract_abs_rankings(csv_file)
    
    print(f"Found {len(abs_dict)} journals with rankings\n")
    
    # Generate JavaScript file
    generate_javascript_dict(abs_dict)
    
    # Print some sample entries
    print("\nSample entries:")
    for i, (title, data) in enumerate(list(abs_dict.items())[:5]):
        print(f"  {title}: ABS={data['abs']}")



