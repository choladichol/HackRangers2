"""
Example usage of Gmail OAuth integration for Email_AI_Agent
"""

from gmail_oauth import get_gmail_credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


def list_recent_emails(max_results=10):
    """
    Example: List recent emails from Gmail inbox.
    
    Args:
        max_results: Maximum number of emails to retrieve
    """
    try:
        # Get credentials
        creds = get_gmail_credentials()
        if not creds:
            print("Failed to authenticate")
            return
        
        # Build Gmail service
        service = build('gmail', 'v1', credentials=creds)
        
        # List messages
        results = service.users().messages().list(
            userId='me',
            maxResults=max_results
        ).execute()
        
        messages = results.get('messages', [])
        
        if not messages:
            print("No messages found.")
            return
        
        print(f"\nFound {len(messages)} messages:\n")
        
        # Get details for each message
        for i, message in enumerate(messages, 1):
            msg = service.users().messages().get(
                userId='me',
                id=message['id']
            ).execute()
            
            # Extract headers
            headers = msg['payload'].get('headers', [])
            subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
            sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown')
            date = next((h['value'] for h in headers if h['name'] == 'Date'), 'Unknown')
            
            print(f"{i}. {subject}")
            print(f"   From: {sender}")
            print(f"   Date: {date}")
            print()
            
    except HttpError as error:
        print(f"An error occurred: {error}")


def get_email_content(message_id):
    """
    Example: Get full content of a specific email.
    
    Args:
        message_id: The ID of the message to retrieve
    """
    try:
        creds = get_gmail_credentials()
        if not creds:
            print("Failed to authenticate")
            return
        
        service = build('gmail', 'v1', credentials=creds)
        
        # Get message
        message = service.users().messages().get(
            userId='me',
            id=message_id,
            format='full'
        ).execute()
        
        # Extract headers
        headers = message['payload'].get('headers', [])
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
        sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown')
        
        print(f"Subject: {subject}")
        print(f"From: {sender}")
        print("\nBody:")
        
        # Extract body (simplified - handles text/plain)
        payload = message['payload']
        body = payload.get('body', {})
        
        if 'data' in body:
            import base64
            body_text = base64.urlsafe_b64decode(body['data']).decode('utf-8')
            print(body_text)
        else:
            # Handle multipart messages
            parts = payload.get('parts', [])
            for part in parts:
                if part['mimeType'] == 'text/plain':
                    if 'data' in part['body']:
                        import base64
                        body_text = base64.urlsafe_b64decode(part['body']['data']).decode('utf-8')
                        print(body_text)
                        break
        
    except HttpError as error:
        print(f"An error occurred: {error}")


if __name__ == '__main__':
    print("Gmail API Example Usage")
    print("="*60)
    
    # Example 1: List recent emails
    print("\nExample 1: Listing recent emails...")
    list_recent_emails(max_results=5)
    
    # Example 2: Get specific email (uncomment and provide message_id)
    # print("\nExample 2: Getting specific email...")
    # get_email_content('YOUR_MESSAGE_ID_HERE')

