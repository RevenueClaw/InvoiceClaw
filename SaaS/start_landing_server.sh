#!/usr/bin/env bash
# Start HTTP server to serve the ClawFlow landing page
cd "$(dirname "$0")/landing"
echo "Serving ClawFlow landing page on http://localhost:8080"
echo "Press Ctrl+C to stop the server"
python3 -m http.server 8080