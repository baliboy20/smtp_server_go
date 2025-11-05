#!/bin/bash
#
# Example: API client for SMTP server
#

API_URL="http://localhost:8080/api"
API_KEY=""  # Set if API_KEY is configured

# Helper function for API calls
api_call() {
    local method=$1
    local endpoint=$2
    local data=$3

    if [ -n "$API_KEY" ]; then
        headers="-H 'X-API-Key: $API_KEY'"
    fi

    if [ -n "$data" ]; then
        curl -s -X "$method" "$API_URL$endpoint" \
             $headers \
             -H "Content-Type: application/json" \
             -d "$data"
    else
        curl -s -X "$method" "$API_URL$endpoint" $headers
    fi
}

echo "=== SMTP Server API Client ==="
echo

# Health check
echo "1. Health Check:"
curl -s http://localhost:8080/health | jq .
echo

# Get stats
echo "2. Server Statistics:"
api_call GET /stats | jq .
echo

# List emails
echo "3. List All Emails:"
api_call GET /emails | jq '.count'
echo

# Get first email (if exists)
echo "4. Get First Email:"
EMAIL_ID=$(api_call GET /emails | jq -r '.emails[0].id // empty')
if [ -n "$EMAIL_ID" ]; then
    echo "Email ID: $EMAIL_ID"
    api_call GET "/emails/$EMAIL_ID" | jq .
else
    echo "No emails found"
fi
echo

# Add webhook
echo "5. Add Webhook:"
api_call POST /webhooks '{
  "url": "https://webhook.site/unique-id",
  "method": "POST"
}' | jq .
echo

echo "Done!"
