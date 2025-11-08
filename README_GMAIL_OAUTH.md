# Gmail OAuth Integration

This module provides Gmail API authentication via OAuth2 for the Email_AI_Agent project.

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Get Google Cloud Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Desktop app" as the application type
   - **Important**: Add authorized redirect URIs:
     - `http://localhost:8080/` (for InstalledAppFlow)
     - `urn:ietf:wg:oauth:2.0:oob` (for out-of-band flow)
   - Download the credentials JSON file
   - Rename it to `credentials.json` and place it in the project root

### 3. First-Time Authentication

Run the script:

```bash
python gmail_oauth.py
```

The script will:
1. Open your browser for authentication
2. Ask you to enter the authorization code from the browser
3. Save the token to `token.pickle` for future use

### 4. Usage in Your Code

```python
from gmail_oauth import get_gmail_credentials
from googleapiclient.discovery import build

# Get credentials
creds = get_gmail_credentials()

# Build Gmail service
service = build('gmail', 'v1', credentials=creds)

# Use the service to access Gmail API
# Example: List messages
results = service.users().messages().list(userId='me', maxResults=10).execute()
messages = results.get('messages', [])
```

## Features

- ✅ No web server required - works entirely from console
- ✅ Automatic token refresh for expired tokens
- ✅ Token persistence in `token.pickle`
- ✅ Graceful error handling
- ✅ Read-only Gmail access (secure)

## File Structure

```
project_root/
├── gmail_oauth.py          # Main OAuth module
├── credentials.json        # Google Cloud OAuth credentials (you provide)
├── token.pickle           # Saved authentication token (auto-generated)
└── requirements.txt       # Python dependencies
```

## Notes

- The token will be automatically refreshed when expired
- If `token.pickle` is deleted, you'll need to re-authenticate
- The credentials are read-only (Gmail.readonly scope)

