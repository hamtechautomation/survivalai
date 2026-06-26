#!/bin/sh
# verify.sh — check this copy of The Last Light Survival Guide is intact.
# Re-computes a SHA-256 for every catalogued file and compares to MANIFEST.sha256.
# Use after copying the folder to a USB drive or a new machine.
#
#   sh verify.sh
#
# Exit 0 = all files present and unchanged. Non-zero = something is missing or corrupt.

cd "$(dirname "$0")" || exit 2

if [ ! -f MANIFEST.sha256 ]; then
  echo "MANIFEST.sha256 not found — cannot verify."
  exit 2
fi

# Pick an available SHA-256 tool
if command -v shasum >/dev/null 2>&1; then
  CHECK="shasum -a 256 -c"
elif command -v sha256sum >/dev/null 2>&1; then
  CHECK="sha256sum -c"
else
  echo "No shasum/sha256sum found on this system."
  exit 2
fi

echo "Verifying against MANIFEST.sha256 …"
if $CHECK MANIFEST.sha256 >/tmp/ll-verify.$$ 2>&1; then
  total=$(grep -c ': OK' /tmp/ll-verify.$$)
  echo "✓ All $total files present and unchanged."
  rm -f /tmp/ll-verify.$$
  exit 0
else
  echo "⚠ Problems found:"
  grep -v ': OK' /tmp/ll-verify.$$ | sed 's/^/   /'
  rm -f /tmp/ll-verify.$$
  exit 1
fi
