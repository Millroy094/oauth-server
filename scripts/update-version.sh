#!/bin/bash

# Run semantic-release to get the release info
RELEASE_OUTPUT=$(npx semantic-release)

# Print the output (for debugging)
echo "Semantic Release output: $RELEASE_OUTPUT"

# Try to extract the version using grep
VERSION=$(echo "$RELEASE_OUTPUT" | grep -oP 'next release version is \K[0-9.]+')

# If no version was found, print an error and exit
if [ -z "$VERSION" ]; then
  echo "Error: Could not extract version from semantic-release output"
  exit 1
fi

# Output the version to GitHub Actions' output
echo "new_version=${VERSION}" >> $GITHUB_OUTPUT

# Optionally, print the new version for debugging
echo "New version: ${VERSION}"