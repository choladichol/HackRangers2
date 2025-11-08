from flask import Flask, request, jsonify
import vonage
print(vonage.__file__)
import google.generativeai as genai
import json
import os

# Import the new Vonage classes
from vonage import Auth, Vonage
from vonage_sms import SmsMessage

app = Flask(__name__)


# ===== CONFIGURATION =====
# Add your keys here
GEMINI_API_KEY = "AIzaSyAccxwGx1lifaY62GdYA9e-EUUm8hih9JI"

# IMPORTANT: Put your ngrok URL here with HTTPS!
NGROK_URL = "https://unrestorative-weakish-martin.ngrok-free.dev"

VONAGE_API_KEY = ""
VONAGE_API_SECRET = ""
VONAGE_NUMBER = "" # The number you bought


# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')  # Fixed model name!



vonage_client = Vonage(Auth(api_key=VONAGE_API_KEY, api_secret=VONAGE_API_SECRET))


BOT_PERSONALITY = """
You are MedKit, a patient and friendly AI health guide. Your goal is to help patients understand complex medical information, especially heart failure.

Core Task: Simplify medical terms from user inputs (text/PDFs). Explain 'What it is' and 'Why it matters' using very simple, non-medical language.

Style: Keep responses brief (3-5 sentences), encouraging, and easy to read (under 300 characters). Prioritize clarity for an older audience. 

Rules: You must not leave your sentences unfinished. 
Always provide complete thoughts.
"""

# Store conversations
conversations = {}

@app.route('/webhooks/answer', methods=['POST'])
def answer():
    """Handle incoming calls"""
    print("📞 Incoming call!")
    
    ncco = [
        {
            "action": "talk",
            "text": "Hello! You've reached MedKit's AI assistant. How can I help you today?",
            "voiceName": "Joanna",
            "bargeIn": True
        },
        {
            "action": "input",
            "type": ["speech"],
            "speech": {
                "endOnSilence": 3,
                "language": "en-US",
                "maxDuration": 60,
                "startTimeout": 15
            },
            "eventUrl": [f"{NGROK_URL}/webhooks/speech"]
        }
    ]
    
    print(f"📤 Sent NCCO with speech input to {NGROK_URL}/webhooks/speech")
    return jsonify(ncco)


@app.route('/webhooks/speech', methods=['POST'])
def handle_speech():
    """Process what the caller said"""
    data = request.get_json()
    
    print("=" * 50)
    print("🎤 SPEECH WEBHOOK CALLED!")
    
    conversation_uuid = data.get('conversation_uuid', '')
    
    # Count how many exchanges we've had
    exchange_count = len(conversations.get(conversation_uuid, [])) // 2 + 1
    print(f"📊 This is exchange #{exchange_count} in this conversation")
    
    print(f"Full data received:")
    print(json.dumps(data, indent=2))
    print("=" * 50)
    
    # Debug: Show all the keys in the data
    print(f"Keys in data: {data.keys()}")
    
    # Check for speech object
    if 'speech' in data:
        print(f"Speech object found: {json.dumps(data['speech'], indent=2)}")
    
    # Check for timeout
    if 'timeout_reason' in data:
        print(f"⏱️ TIMEOUT: {data['timeout_reason']}")
    
    # Try multiple ways to get speech
    speech_results = data.get('speech', {}).get('results', [])
    transcript = data.get('speech', {}).get('transcript', '')
    recording_url = data.get('recording_url', '')
    
    print(f"speech_results: {speech_results}")
    print(f"transcript: {transcript}")
    print(f"recording_url: {recording_url}")
    
    # Also check for transcript
    if not speech_results and transcript:
        speech_results = [transcript]
    
    if speech_results:
        # Get what they said - extract the text from the dictionary
        if isinstance(speech_results[0], dict):
            user_speech = speech_results[0].get('text', '')
        else:
            user_speech = speech_results[0]
        
        print(f"👤 User said: {user_speech}")
        
        # Get or create conversation history
        if conversation_uuid not in conversations:
            conversations[conversation_uuid] = []
        
        # Add user message
        conversations[conversation_uuid].append(f"User: {user_speech}")
        
        # Build context
        conversation_context = "\n".join(conversations[conversation_uuid][-6:])
        prompt = f"{BOT_PERSONALITY}\n\nConversation:\n{conversation_context}\n\nAssistant:"
        
        try:
            # Get AI response
            response = model.generate_content(prompt)
            bot_reply = response.text
            
            # Keep it short for phone calls
            if len(bot_reply) > 300:
                bot_reply = bot_reply[:300] + "..."
            
            print(f"🤖 Bot replied: {bot_reply}")
            
            # Add to conversation
            conversations[conversation_uuid].append(f"Assistant: {bot_reply}")
            
            # Add a conversational prompt to encourage continued interaction
            full_response = f"{bot_reply}"
            
            # Build response NCCO with more forgiving timeouts
            ncco = [
                {
                    "action": "talk",
                    "text": full_response,
                    "voiceName": "Joanna",
                    "bargeIn": True
                },
                {
                    "action": "input",
                    "type": ["speech"],
                    "speech": {
                        "endOnSilence": 3,
                        "language": "en-US",
                        "maxDuration": 60,
                        "startTimeout": 15
                    },
                    "eventUrl": [f"{NGROK_URL}/webhooks/speech"]
                }
            ]
            
            print(f"📤 Sending response NCCO:")
            print(json.dumps(ncco, indent=2))
            print(f"🔄 Bot is now waiting for user's next question...")
            print(f"⏱️  Will wait up to 15 seconds for user to start speaking")
            
            return jsonify(ncco)
            
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()
            
            ncco = [
                {
                    "action": "talk",
                    "text": "Sorry, I had trouble processing that. Could you try again?",
                    "voiceName": "Joanna"
                },
                {
                    "action": "input",
                    "type": ["speech"],
                    "speech": {
                        "endOnSilence": 3,
                        "language": "en-US",
                        "maxDuration": 60,
                        "startTimeout": 15
                    },
                    "eventUrl": [f"{NGROK_URL}/webhooks/speech"]
                }
            ]
            return jsonify(ncco)
    else:
        # No speech detected
        print("⚠️ NO SPEECH RESULTS FOUND IN DATA")
        print("This likely means:")
        print("1. Speech recognition (ASR) is not enabled on your Vonage account")
        print("2. Your account might need to be upgraded")
        print("3. You may need to enable ASR in Vonage dashboard settings")
        
        ncco = [
            {
                "action": "talk",
                "text": "I'm having trouble understanding you. Let me try again. Please speak clearly.",
                "voiceName": "Joanna"
            },
            {
                "action": "input",
                "type": ["speech"],
                "speech": {
                    "endOnSilence": 3,
                    "language": "en-US",
                    "maxDuration": 60,
                    "startTimeout": 15
                },
                "eventUrl": [f"{NGROK_URL}/webhooks/speech"]
            }
        ]
        return jsonify(ncco)


@app.route('/webhooks/event', methods=['POST'])
def event():
    """Handle call events"""
    data = request.get_json()
    status = data.get('status', 'unknown')
    print(f"📋 Event: {status}")
    return ('', 200)

@app.route('/webhooks/inbound_message', methods=['GET', 'POST'])  # ← Added GET here!
def inbound_message():
    """Handle incoming text messages"""
    print("=" * 50)
    print("💬 WEBHOOK HIT!")
    print(f"Method: {request.method}")
    print("=" * 50)
    
    # Handle both GET (URL params) and POST (JSON body)
    if request.method == 'GET':
        # Vonage sends data as URL parameters for GET
        from_number = request.args.get('msisdn', 'MISSING')
        to_number = request.args.get('to', 'MISSING')
        user_message = request.args.get('text', 'MISSING')
        print("📥 Received GET request with URL parameters")
    else:
        # POST with JSON body
        data = request.get_json()
        from_number = data.get('msisdn', 'MISSING')
        to_number = data.get('to', 'MISSING')
        user_message = data.get('text', 'MISSING')
        print("📥 Received POST request with JSON body")
    
    print(f"👤 From: {from_number}")
    print(f"📱 To: {to_number}")
    print(f"💬 Message: {user_message}")
    
    try:
        if user_message == 'MISSING':
            print("❌ NO MESSAGE TEXT FOUND!")
            return jsonify(success=False, error="No message text"), 200

        # Use the user's phone number as the conversation ID
        conversation_id = from_number
        
        # Get or create conversation history
        if conversation_id not in conversations:
            conversations[conversation_id] = []
            print(f"✨ Starting new conversation for {from_number}")
        
        # Add user message
        conversations[conversation_id].append(f"User: {user_message}")
        
        # Build context
        conversation_context = "\n".join(conversations[conversation_id][-6:])
        prompt = f"{BOT_PERSONALITY}\n\nConversation:\n{conversation_context}\n\nAssistant:"

        print("🤖 Generating AI response...")
        # Get AI response
        response = model.generate_content(prompt)
        bot_reply = response.text
        
        # Limit length for SMS
        if len(bot_reply) > 300:
            bot_reply = bot_reply[:297] + "..."
        
        print(f"🤖 Bot reply ({len(bot_reply)} chars): {bot_reply}")
        
        # Add to conversation
        conversations[conversation_id].append(f"Assistant: {bot_reply}")

        # Send SMS reply
        print("📤 Attempting to send SMS...")
        message = SmsMessage(
            to=from_number,
            from_=VONAGE_NUMBER,
            text=bot_reply
        )

        # Send the message
        sms_response = vonage_client.sms.send(message)

        # Check response
        if sms_response.messages[0].status == '0':
            print("✅ Message sent successfully!")
        else:
            print(f"❌ Message failed!")
            print(f"   Error: {sms_response.messages[0].error_text}")

    except Exception as e:
        print("=" * 50)
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        print("=" * 50)

    # Always send a 200 OK back to Vonage
    return jsonify(success=True), 200

# --- ADD THIS: NEW ROUTE FOR MESSAGE STATUS (DELIVERY RECEIPTS) ---
@app.route('/webhooks/message_status', methods=['POST'])
def message_status():
    """Handle message status updates (e.g., 'delivered')"""
    data = request.get_json()
    print("=" * 50)
    print("📬 MESSAGE STATUS WEBHOOK CALLED!")
    print(json.dumps(data, indent=2))
    print(f"Status: {data.get('status')} for message {data.get('message-uuid')}")
    print("=" * 50)
    return ('', 200)
# --- END ADD ---

@app.route('/')
def home():
    return "🤖 MedKit AI Voice Bot is running!"


if __name__ == "__main__":
    print("🚀 Starting MedKit AI Voice Bot...")
    print(f"🌐 Using ngrok URL: {NGROK_URL}")
    print("📞 Ready to receive calls!")
    print("\n⚠️  IMPORTANT: Make sure to update GEMINI_API_KEY and NGROK_URL in the code!")
    app.run(debug=True, port=5000)
