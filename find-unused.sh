#!/bin/bash

# Directory to search
SRC_DIR="d:/Sefareshat/jahad/mehrebaran/mehre-baran-app/packages/dashboard/src"
SEARCH_DIR="d:/Sefareshat/jahad/mehrebaran/mehre-baran-app/packages/dashboard"

# Output file
OUTPUT_FILE="d:/Sefareshat/jahad/mehrebaran/mehre-baran-app/unused-files.txt"

# Clear output file
> "$OUTPUT_FILE"

echo "Searching for unused files in: $SRC_DIR"
echo "Results will be saved to: $OUTPUT_FILE"
echo ""

# Counter
checked=0
unused=0

# Get all source files
find "$SRC_DIR" -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
    # Get basename without extension
    basename=$(basename "$file")
    filename="${basename%.*}"

    # Skip certain files
    if [[ "$file" =~ (main\.jsx|App\.jsx|store\.js|Slice\.js) ]]; then
        continue
    fi

    ((checked++))

    # Search for imports of this file in the entire dashboard directory
    # Look for various import patterns
    import_count=$(grep -r -l \
        -e "from.*['\"].*${filename}" \
        -e "import.*${filename}" \
        --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" \
        "$SEARCH_DIR" 2>/dev/null | grep -v "$file" | wc -l)

    if [ "$import_count" -eq 0 ]; then
        ((unused++))
        # Get file info
        size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null || echo "0")
        lines=$(wc -l < "$file" 2>/dev/null || echo "0")

        echo "UNUSED: $file" >> "$OUTPUT_FILE"
        echo "  Size: $size bytes" >> "$OUTPUT_FILE"
        echo "  Lines: $lines" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"

        echo "Found unused: $file"
    fi

    # Progress indicator
    if [ $((checked % 20)) -eq 0 ]; then
        echo "Progress: Checked $checked files, Found $unused unused"
    fi
done

echo ""
echo "Scan complete!"
echo "Total unused files: $unused"
echo "Results saved to: $OUTPUT_FILE"
