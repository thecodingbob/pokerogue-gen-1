import re


def parse_species():
    with (open("./src/enums/species.ts") as f):
        species = f.readlines()
        species = list(filter(lambda s: "/**" not in s, species))
        species = [s.replace("\n","").replace(",","").strip() for s in species]
        species = species[1:-1]
        species[0] = 'BULBASAUR'
        return species

allowed_species = parse_species()

# Read the input file
with open("./src/data/biomes.ts", "r") as file:
    content = file.read()

# Regular expression to find all species entries
species_pattern = re.compile(r'Species\.(\w+)')

# Function to filter out species not in the allowed list
def filter_species(match):
    species_name = match.group(1)
    if species_name in allowed_species:
        return f'Species.{species_name}'
    return ""

# Replace the species names that are not in the allowed list
filtered_content = species_pattern.sub(filter_species, content)

# Remove any empty list items and trailing commas that might result from the filtering process
filtered_content = re.sub(r',\s*]', ']', filtered_content)
filtered_content = re.sub(r'\[\s*,\s*', '[', filtered_content)

# Write the filtered content back to a new file
with open("./src/data/biomes2.ts", "w") as file:
    file.write(filtered_content)

print("Species filtering complete. Check 'filtered_source_file.ts' for the output.")

# Read the input file
with open("./src/data/biomes2.ts", "r") as file:
    content = file.read()

# Regular expression to match and remove empty dictionary entries within lists
empty_entry_pattern = re.compile(r'\{\s*(\d+:\s*\[\s*\],?\s*)+\},?\s*')

# Function to clean up the lists by removing empty dictionary entries
def clean_empty_entries(match):
    content = match.group()
    # Remove empty dictionary entries
    cleaned_content = empty_entry_pattern.sub('', content)
    # Remove redundant commas left behind after removal
    cleaned_content = re.sub(r',\s*,', ',', cleaned_content)
    cleaned_content = re.sub(r',\s*\]', ']', cleaned_content)
    return cleaned_content

# Apply the cleaning function to all lists
list_pattern = re.compile(r'\[.*?\]', re.DOTALL)

no_matches = False

while (no_matches is False):
    new_content = list_pattern.sub(clean_empty_entries, content)
    no_matches = new_content == content
    content = new_content

# Write the cleaned content back to a new file
with open("./src/data/biomes3.ts", "w") as file:
    file.write(content)

print("Cleaning complete. Check 'filtered_source_file.ts' for the output.")


import re

# Read the input file
with open("./src/data/biomes3.ts", "r") as file:
    content = file.read()

# Regular expression to match and remove empty dictionary entries within lists
empty_entry_pattern = re.compile(r'\{\s*(\d+:\s*\[\s*\],?\s*)+\},?\s*')

# Regular expression to clean up extra commas after removal
extra_comma_pattern = re.compile(r',\s*,')
trailing_comma_pattern = re.compile(r',\s*\]')

# Function to clean up the lists by removing empty dictionary entries
def clean_empty_entries(match):
    content = match.group()
    # Remove empty dictionary entries
    cleaned_content = empty_entry_pattern.sub('', content)
    # Remove redundant commas left behind after removal
    cleaned_content = extra_comma_pattern.sub(',', cleaned_content)
    cleaned_content = trailing_comma_pattern.sub(']', cleaned_content)
    return cleaned_content

# Apply the cleaning function to all lists
list_pattern = re.compile(r'\[.*?\]', re.DOTALL)
filtered_content = list_pattern.sub(clean_empty_entries, content)

# Additional cleanup for trailing commas at the end of lists
filtered_content = re.sub(r',\s*\]', ']', filtered_content)
filtered_content = re.sub(r',\s*\}', '}', filtered_content)

# Write the cleaned content back to a new file
with open("./src/data/biomes4.ts", "w") as file:
    file.write(filtered_content)

print("Cleaning complete. Check 'filtered_source_file.ts' for the output.")

import re

# Read the input file
with open("./src/data/biomes4.ts", "r") as file:
    content = file.read()

# Regular expression to match and remove empty dictionary entries within lists
empty_entry_pattern = re.compile(r'\{\s*\d+:\s*\[\s*\](?:\s*,\s*\d+:\s*\[\s*\])*\s*\},?')

# Regular expression to remove any trailing commas left after removal
extra_comma_pattern = re.compile(r',\s*,')
trailing_comma_pattern = re.compile(r',\s*([\]\}])')
empty_list_pattern = re.compile(r'\[\s*,*\s*\]')

# Function to clean up the lists by removing empty dictionary entries
def clean_empty_entries(match):
    content = match.group()
    # Remove empty dictionary entries
    cleaned_content = empty_entry_pattern.sub('', content)
    # Remove redundant commas left behind after removal
    cleaned_content = extra_comma_pattern.sub(',', cleaned_content)
    cleaned_content = trailing_comma_pattern.sub(r'\1', cleaned_content)
    cleaned_content = empty_list_pattern.sub('[]', cleaned_content)
    return cleaned_content

# Apply the cleaning function to all lists and dictionary entries
filtered_content = empty_entry_pattern.sub(clean_empty_entries, content)

# Final cleanup for redundant commas at the end of lists and dictionaries
filtered_content = trailing_comma_pattern.sub(r'\1', filtered_content)
filtered_content = empty_list_pattern.sub('[]', filtered_content)

# Write the cleaned content back to a new file
with open("./src/data/biomes5.ts", "w") as file:
    file.write(filtered_content)

print("Cleaning complete. Check 'filtered_source_file.ts' for the output.")

