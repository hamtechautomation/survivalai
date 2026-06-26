#!/usr/bin/env python3
"""
extract.py — Extract and index PDF text for ARIA's offline RAG.

Run once from the pdfs/ directory:
    python3 extract.py

Requires one of:
    pip3 install pypdf          (preferred)
    pip3 install PyPDF2         (older fallback)

Output: ../search/pdf-chunks.json
Each chunk: {"s": "source title", "p": page_number, "t": "text content"}
"""

import os, sys, json, re, textwrap

# ── Dependency check — auto-install if missing ────────────────────────────────
def _try_import():
    try:
        import pypdf as lib
        return lib, 'pypdf'
    except ImportError:
        pass
    try:
        import PyPDF2 as lib
        return lib, 'PyPDF2'
    except ImportError:
        pass
    return None, None

_pdf_lib, _lib_name = _try_import()

if _pdf_lib is None:
    print("pypdf not found — installing automatically...")
    import subprocess
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'pypdf', '-q'])
    _pdf_lib, _lib_name = _try_import()
    if _pdf_lib is None:
        print("ERROR: Could not install pypdf. Run:  pip3 install pypdf")
        sys.exit(1)

print(f"Using: {_lib_name}")

if _lib_name == 'pypdf':
    def extract_pages(path):
        reader = _pdf_lib.PdfReader(path, strict=False)
        return [p.extract_text() or '' for p in reader.pages]
else:
    def extract_pages(path):
        with open(path, 'rb') as f:
            reader = _pdf_lib.PdfReader(f, strict=False)
            return [p.extract_text() or '' for p in reader.pages]

# ── Config ────────────────────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_PATH   = os.path.join(SCRIPT_DIR, '..', 'search', 'pdf-chunks.json')
CHUNK_WORDS = 350   # target words per chunk
MIN_CHUNK   = 60    # discard chunks shorter than this many words

PDFS = {
    'fm-3-05-70-survival.pdf':       'US Army Survival FM 3-05.70',
    'fm-4-25-11-first-aid.pdf':      'First Aid FM 4-25.11',
    'fm-21-10-field-hygiene.pdf':    'Field Hygiene FM 21-10',
    'nuclear-war-survival.pdf':      'Nuclear War Survival Skills (Kearny)',
    'aerie-backcountry-medicine.pdf':'Aerie Wilderness Medicine (15th Ed.)',
    'uk-emergency-preparedness.pdf': 'UK Emergency Preparedness Guide',
    'where-there-is-no-doctor.pdf':  'Where There Is No Doctor (Hesperian)',
    'where-there-is-no-dentist.pdf': 'Where There Is No Dentist (Hesperian)',
    'emergency-war-surgery.pdf':     'Emergency War Surgery 5th Ed. (Borden)',
    'humanure-handbook.pdf':         'The Humanure Handbook (Jenkins)',
    'fm-21-76-survival-1957.pdf':    'US Army Survival Manual FM 21-76 (1957)',
    'ranger-handbook.pdf':           'US Army Ranger Handbook SH 21-76',
    'fm-6-02-signal-ops.pdf':        'US Army Signal Operations FM 6-02',
    'art-of-war-sun-tzu.pdf':        'The Art of War (Sun Tzu)',
    'usda-home-canning.pdf':         'USDA Complete Guide to Home Canning',
    'book-for-midwives.pdf':         'A Book for Midwives (Hesperian)',
    'fm-5-426-carpentry.pdf':        'Carpentry FM 5-426',
    'sturtevant-edible-plants.pdf':  "Sturtevant's Edible Plants of the World",
    'henleys-formulas.pdf':          "Henley's Formulas, Recipes & Processes",
    'bowditch-navigator.pdf':        'American Practical Navigator (Bowditch)',
    'sf-medical-handbook.pdf':       'Special Forces Medical Handbook ST 31-91B',
    'ships-medicine-chest.pdf':      "Ship's Medicine Chest & Medical Aid at Sea",
    'knots-splices-ropework.pdf':    'Knots, Splices & Rope Work (Verrill)',
    'farm-household-cyclopedia.pdf': 'The Farm & Household Cyclopaedia',
    'shakespeare-complete.pdf':      'Complete Works of Shakespeare',
    'kjv-bible.pdf':                 'King James Bible (KJV)',
    'meditations-marcus-aurelius.pdf':'Meditations (Marcus Aurelius)',
    'aesops-fables.pdf':             "Aesop's Fables (Townsend)",
}

# ── Text cleaning ─────────────────────────────────────────────────────────────
_GARBAGE = re.compile(
    r'(https?://\S+|www\.\S+|'          # URLs
    r'\d{1,3}-\d{1,3}|'                 # page refs like "3-14"
    r'(?:\w+\s*){0,3}FM \d[\d-]+|'     # repeated FM headers
    r'^\s*\d+\s*$)',                     # lone page numbers
    re.MULTILINE
)

def clean(text):
    text = _GARBAGE.sub(' ', text)
    text = re.sub(r'[ \t]{2,}', ' ', text)     # collapse spaces
    text = re.sub(r'\n{3,}', '\n\n', text)      # collapse blank lines
    return text.strip()

def chunk_text(text, source, page_start):
    words = text.split()
    chunks = []
    for i in range(0, len(words), CHUNK_WORDS):
        segment = ' '.join(words[i : i + CHUNK_WORDS])
        if len(segment.split()) >= MIN_CHUNK:
            chunks.append({
                's': source,
                'p': page_start + i // CHUNK_WORDS,
                't': segment
            })
    return chunks

# ── Main ──────────────────────────────────────────────────────────────────────
all_chunks = []

for filename, title in PDFS.items():
    path = os.path.join(SCRIPT_DIR, filename)
    if not os.path.exists(path):
        print(f"  SKIP (not found): {filename}")
        continue

    size_mb = os.path.getsize(path) / 1024 / 1024
    print(f"\n  [{title}]  ({size_mb:.1f} MB)")
    print("  Extracting pages... ", end='', flush=True)

    try:
        pages = extract_pages(path)
    except Exception as e:
        print(f"ERROR — {e}")
        continue

    print(f"{len(pages)} pages read.")

    full_text = clean('\n'.join(pages))
    chunks = chunk_text(full_text, title, 1)
    all_chunks.extend(chunks)
    print(f"  → {len(chunks)} chunks created.")

# ── Write output ─────────────────────────────────────────────────────────────
os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)

output = {
    'generated': __import__('datetime').date.today().isoformat(),
    'total':     len(all_chunks),
    'chunks':    all_chunks
}

with open(OUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(output, f, separators=(',', ':'), ensure_ascii=False)

size_kb = os.path.getsize(OUT_PATH) / 1024
print(f"\n{'='*50}")
print(f"Done!  {len(all_chunks)} chunks → search/pdf-chunks.json  ({size_kb:.0f} KB)")
print(f"\nRestart the app (or reload) and ARIA will use the index automatically.")
