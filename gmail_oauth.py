"""
Gmail OAuth Integration for Email_AI_Agent
Supports Gmail API authentication via OAuth2 without requiring a web server.
"""

import os
import pickle
import json
from typing import Optional
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Gmail API scopes (read-only email access)
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

# File paths
CREDENTIALS_FILE = 'credentials.json'
TOKEN_FILE = 'token.pickle'


def get_gmail_credentials() -> Optional[Credentials]:
    """
    Get Gmail API credentials, handling authentication flow if needed.
    
    Returns:
        Credentials object for Gmail API access, or None if authentication fails.
    
    This function:
    - Loads credentials from credentials.json
    - Opens browser for user authentication
    - Accepts verification code from console input
    - Saves token in token.pickle for reuse
    - Automatically refreshes expired tokens
    """
    creds = None
    
    # Check if token.pickle exists and load it
    if os.path.exists(TOKEN_FILE):
        try:
            with open(TOKEN_FILE, 'rb') as token:
                creds = pickle.load(token)
        except Exception as e:
            print(f"Error loading token file: {e}")
            creds = None
    
    # If there are no (valid) credentials available, let the user log in
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            # Refresh expired token
            try:
                print("Token expired. Refreshing...")
                creds.refresh(Request())
                print("Token refreshed successfully!")
            except Exception as e:
                print(f"Error refreshing token: {e}")
                creds = None
        
        if not creds or not creds.valid:
            # Need to get new credentials
            if not os.path.exists(CREDENTIALS_FILE):
                raise FileNotFoundError(
                    f"Credentials file '{CREDENTIALS_FILE}' not found. "
                    "Please download it from Google Cloud Console and place it in the project root."
                )
            
            try:
                # Load client configuration
                with open(CREDENTIALS_FILE, 'r') as f:
                    client_config = json.load(f)
                
                # Create OAuth flow
                flow = InstalledAppFlow.from_client_config(
                    client_config,
                    SCOPES
                )
                
                # Run the OAuth flow using console (no local server required)
                print("\n" + "="*60)
                print("Gmail OAuth Authentication")
                print("="*60)
                print("\nA browser window will open for authentication.")
                print("After authorizing, copy the authorization code from the browser.")
                print("="*60 + "\n")
                
                # Use run_console() which handles the entire flow without a local server
                # This method opens the browser, gets the code from user input, and fetches the token
                creds = flow.run_console()
                
                print("\n✓ Authentication successful!")
                
            except Exception as e:
                print(f"\n✗ Authentication failed: {e}")
                return None
        
        # Save the credentials for the next run
        try:
            with open(TOKEN_FILE, 'wb') as token:
                pickle.dump(creds, token)
            print(f"✓ Token saved to {TOKEN_FILE}")
        except Exception as e:
            print(f"Warning: Could not save token: {e}")
    
    return creds


def test_gmail_connection():
    """
    Test function to verify Gmail API connection.
    """
    try:
        creds = get_gmail_credentials()
        if not creds:
            print("Failed to get credentials")
            return False
        
        service = build('gmail', 'v1', credentials=creds)
        
        # Get user profile to test connection
        profile = service.users().getProfile(userId='me').execute()
        print(f"\n✓ Successfully connected to Gmail!")
        print(f"  Email: {profile.get('emailAddress')}")
        print(f"  Messages Total: {profile.get('messagesTotal')}")
        
        return True
    except Exception as e:
        print(f"✗ Connection test failed: {e}")
        return False


if __name__ == '__main__':
    print("Gmail OAuth Integration Test")
    print("="*60)
    test_gmail_connection()

