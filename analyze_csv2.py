import csv

# Expected columns based on ingest.ts
expected_columns = [
    'breed', 'description', 'temperament', 'popularity', 'min_height', 'max_height',
    'min_weight', 'max_weight', 'min_expectancy', 'max_expectancy', 'group',
    'grooming_frequency_value', 'grooming_frequency_category', 'shedding_value',
    'shedding_category', 'energy_level_value', 'energy_level_category',
    'trainability_value', 'trainability_category', 'demeanor_value', 'demeanor_category'
]

csv_file = 'ai/rag/data/dog-data.csv'

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f, fieldnames=expected_columns)
    rows = list(reader)

print(f"Total rows: {len(rows)}")

# Check problematic rows
problem_rows = [7, 80, 111, 118, 131, 274, 275, 276]
for row_num in problem_rows:
    if row_num <= len(rows):
        row = rows[row_num - 1]
        empty_fields = {k: v for k, v in row.items() if not v or not v.strip()}
        if empty_fields:
            print(f"\nRow {row_num}: {row['breed']}")
            for field, value in empty_fields.items():
                print(f"  {field}: '{value}'")
    
# Check row 34 (Cane Corso with 0.0 weight)
row = rows[33]
print(f"\nRow 34 (Cane Corso):")
print(f"  min_weight: {row['min_weight']}, max_weight: {row['max_weight']}")

