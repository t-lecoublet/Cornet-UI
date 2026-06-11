#!/bin/bash

BASE_DIR="../components"
OUTPUT_FILE="./index.ts"

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Génération du fichier index.ts avec les types exportés...${NC}"
echo

cat > "$OUTPUT_FILE" << 'EOF'
/**
 * Types and Interfaces exports for cornet-ui
 * Auto-generated file - do not edit manually
 */

EOF

extract_and_write_types() {
    local file=$1
    local relative_path=${file#$BASE_DIR/}
    local import_path="../components/${relative_path%.ts}"
    
    types=$(grep -oP 'export type \K[A-Za-z_][A-Za-z0-9_]*(?=\s*=)' "$file" 2>/dev/null)

    interfaces=$(grep -oP 'export interface \K[A-Za-z_][A-Za-z0-9_]*' "$file" 2>/dev/null)
    
    all_exports=""
    
    if [ -n "$types" ]; then
        all_exports="$types"
    fi
    
    if [ -n "$interfaces" ]; then
        if [ -n "$all_exports" ]; then
            all_exports="$all_exports
$interfaces"
        else
            all_exports="$interfaces"
        fi
    fi
    
    if [ -n "$all_exports" ]; then
        echo -e "${GREEN}📁 $relative_path${NC}"
        
        exports_list=$(echo "$all_exports" | tr '\n' ',' | sed 's/,$//' | sed 's/,,/,/g')
        
        echo "export type { $exports_list } from '$import_path'" >> "$OUTPUT_FILE"
        
        if [ -n "$types" ]; then
            echo -e "  ${YELLOW}Types:${NC}"
            while IFS= read -r type; do
                echo -e "    → $type"
            done <<< "$types"
        fi
        
        if [ -n "$interfaces" ]; then
            echo -e "  ${PURPLE}Interfaces:${NC}"
            while IFS= read -r interface; do
                echo -e "    → $interface"
            done <<< "$interfaces"
        fi
        
        echo
    fi
}

find "$BASE_DIR" -name "*.types.ts" -type f | sort | while read -r file; do
    extract_and_write_types "$file"
done

echo -e "${GREEN}✅ Fichier généré: $OUTPUT_FILE${NC}"
echo