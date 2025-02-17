#!/bin/bash

# update-vendor.sh
#
# Description:
#   This script manages the google-play-scraper vendored dependency.
#   It can update to either the latest version or revert to the default
#   supported version (10.0.1).
#
# Features:
#   - Updates vendored dependency to latest version
#   - Option to revert to default supported version
#   - Updates package.json and npm-shrinkwrap.json
#   - Verifies installation after update
#
# Usage:
#   ./update-vendor.sh [--default]
#   ./update-vendor.sh --help
#
# Options:
#   --default  load the default supported version (10.0.1) in the repo
#   --help     Show a help message
#
# Examples:
#   ./update-vendor.sh            # Updates to latest version
#   ./update-vendor.sh --default  # Updates to default supported version (10.0.1)
#   ./update-vendor.sh --help     # Shows help message
#

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'

PACKAGE_NAME="google-play-scraper"
VENDOR_DIR="vendor"
DEFAULT_VERSION="10.0.1"
SCRIPT_DATA_FILE="$VENDOR_DIR/$PACKAGE_NAME/lib/utils/scriptData.js"

show_help() {
    cat << EOF
Update Vendor Script

Description:
    Updates the google-play-scraper vendored dependency to either
    the latest version or the default supported version.

Usage:
    $(basename $0) [--default]
    $(basename $0) --help

Options:
    --default  Use default supported version ($DEFAULT_VERSION)
    --help     Show this help message

Examples:
    $(basename $0)              # Updates to latest version
    $(basename $0) --default    # Updates to version $DEFAULT_VERSION
    $(basename $0) --help       # Shows this help message
EOF
}

if [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

PACKAGE_VERSION="latest"
if [ "$1" = "--default" ]; then
    PACKAGE_VERSION=$DEFAULT_VERSION
fi

echo "${YELLOW}Starting vendor update process for ${PACKAGE_NAME}..."

echo "${YELLOW}Cleaning up any existing installations..."
npm uninstall $PACKAGE_NAME 2>/dev/null || true
rm -rf node_modules 2>/dev/null || true

if [ -d "$VENDOR_DIR/$PACKAGE_NAME" ]; then
    echo "${YELLOW}Removing existing vendor package..."
    rm -rf "$VENDOR_DIR/$PACKAGE_NAME"
fi

mkdir -p "$VENDOR_DIR/$PACKAGE_NAME"

echo "${YELLOW}Installing ${PACKAGE_NAME}@${PACKAGE_VERSION}..."
if [ "$PACKAGE_VERSION" = "latest" ]; then
    npm install $PACKAGE_NAME
else
    npm install $PACKAGE_NAME@$PACKAGE_VERSION
fi

echo "${YELLOW}Copying to vendor directory..."
cp -r node_modules/$PACKAGE_NAME/* "$VENDOR_DIR/$PACKAGE_NAME/"

echo "${YELLOW}Cleaning up temporary installation..."
npm uninstall $PACKAGE_NAME
rm -rf node_modules

# NOTE: Fix eval in vendor/google-play-scraper/lib/utils/scriptData.js - 
# this is because `esbuild` the tool that's building the project, 
# throws a warning if `eval` is present in the source code and hence this
# part of the script is covering up for that fact.
echo "${YELLOW}Fixing eval in scriptData.js..."
if [ -f "$SCRIPT_DATA_FILE" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' 's/eval(/\(0, eval\)(/g' "$SCRIPT_DATA_FILE"
    else
        sed -i 's/eval(/\(0, eval\)(/g' "$SCRIPT_DATA_FILE"
    fi
    echo "${GREEN}Successfully updated eval in scriptData.js"
else
    echo "${RED}Warning: scriptData.js not found at expected location - skipping eval fix"
fi

echo "${YELLOW}Updating package.json..."
node -e "
const fs = require('fs');
const pkg = require('./package.json');
pkg.dependencies['$PACKAGE_NAME'] = 'file:vendor/$PACKAGE_NAME';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

echo "${YELLOW}Updating npm-shrinkwrap.json..."
npm install
npm shrinkwrap

echo "${YELLOW}Verifying installation..."
if npm ls $PACKAGE_NAME 2>/dev/null | grep -q "vendor/$PACKAGE_NAME"; then
    echo "${GREEN}Vendor update completed successfully!"
    echo "Package is now using vendored version: $(npm ls $PACKAGE_NAME)"
else
    echo "${RED}Verification failed. Package might not be properly vendored."
    exit 1
fi
