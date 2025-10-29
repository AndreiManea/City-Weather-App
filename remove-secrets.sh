#!/bin/bash
# Script to remove the exposed API key from git history

echo "🔒 Removing API key from git history..."
echo ""
echo "⚠️  WARNING: This will rewrite git history!"
echo "   If you've already pushed to GitHub, you'll need to force push."
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Method 1: Using git filter-branch (works on all systems)
echo "Rewriting history..."
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch apps/server/src/integrations/openWeather.client.ts' \
  --prune-empty --tag-name-filter cat -- --all

echo ""
echo "✅ History rewritten!"
echo ""
echo "Next steps:"
echo "1. Commit your current changes (with the fixed code)"
echo "2. Force push to GitHub: git push origin main --force-with-lease"
echo "3. IMPORTANT: Regenerate your API key at https://home.openweathermap.org/api_keys"
echo ""
