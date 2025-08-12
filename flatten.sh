#!/bin/bash
for file in $(find . -name "*.*ts" -o -name "*.htm*" -o -name "*.*css" -o -name "package.json" -o -name "tsconfig.json" | grep -v archive | grep -v node_modules | sort); do
    echo "===> $file <=="
    cat $file
    echo "----------------------------------------"
    echo
done