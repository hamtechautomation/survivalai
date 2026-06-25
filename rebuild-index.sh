#!/bin/sh
# Rebuild the PDF search index. Run this after adding or replacing PDFs.
cd "$(dirname "$0")/pdfs" && python3 extract.py
