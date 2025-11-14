#!/bin/sh
set -e

# Find the main index.html file
INDEX_FILE=/usr/share/nginx/html/index.html

# Check if the environment variables are set. If not, use empty strings.
API_ENDPOINT=${LIGHTLLM_API_ENDPOINT:-""}
API_KEY=${LIGHTLLM_API_KEY:-""}

# Use sed to replace the placeholders in index.html with the actual values
# The '|' character is used as a delimiter to avoid conflicts with slashes in the URL
sed -i "s|__LIGHTLLM_API_ENDPOINT__|${API_ENDPOINT}|g" $INDEX_FILE
sed -i "s|__LIGHTLLM_API_KEY__|${API_KEY}|g" $INDEX_FILE

echo "Entrypoint script finished. Starting Nginx..."

# Execute the command passed to this script (which is "nginx -g 'daemon off;'")
exec "$@"