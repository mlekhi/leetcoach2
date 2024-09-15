from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from groq import Groq
from flask_cors import CORS
import threading
import time
import logging
from google.cloud import texttospeech
import pygame

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})  # Allows all origins; adjust as needed

# Initialize Groq client
client = Groq(api_key='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')

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")

# Google Text-to-Speech Client
from google.oauth2 import service_account
credentials = service_account.Credentials.from_service_account_file('./key.json')
tts_client = texttospeech.TextToSpeechClient(credentials=credentials)

# Global variables
transcript_buffer = []
buffer_lock = threading.Lock()
last_request_time = time.time()

@app.route('/get_completion', methods=['POST'])
def get_completion():
    global transcript_buffer
    global last_request_time

    data = request.json
    user_message = data.get('userMessage')

    with buffer_lock:
        transcript_buffer.append(user_message)
        last_request_time = time.time()

    return jsonify({'message': 'Message received'}), 200

def process_transcripts():
    global transcript_buffer
    global last_request_time

    while True:
        time.sleep(1)  # Check every second
        with buffer_lock:
            if time.time() - last_request_time > 5:
                if transcript_buffer:
                    # Send transcripts to Groq
                    try:
                        chat_completion = client.chat.completions.create(
                            messages=[
                                {
                                    "role": "user",
                                    "content": ' '.join(transcript_buffer)  # Combine all transcripts
                                }
                            ],
                            model="llama3-8b-8192"  # Replace with the desired model
                        )
                        response_content = chat_completion.choices[0].message.content
                        logging.debug(f"Received Groq response: {response_content}")

                        # Convert response content to speech
                        tts_response = synthesize_speech(response_content)

                        if tts_response:
                            # Emit the audio to all connected WebSocket clients
                            socketio.emit('groq_audio', {'audio': tts_response})
                            logging.debug("Emitting audio response to clients")

                        # Clear buffer after sending
                        transcript_buffer = []
                    except Exception as e:
                        logging.error(f"Error calling Groq API or Text-to-Speech API: {e}")

def synthesize_speech(text):
    """Synthesize speech using Google Text-to-Speech and play the MP3 audio."""
    try:
        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US", name="en-US-Neural2-C"
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        response = tts_client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )

        if response.audio_content:
            logging.debug("Text-to-Speech synthesis successful")

            # Save the audio content to a file
            file_name = 'output.mp3'
            with open(file_name, 'wb') as out:
                out.write(response.audio_content)
            logging.debug("Audio content written to 'output.mp3'")

            # Initialize pygame mixer to play the audio
            pygame.mixer.init()
            pygame.mixer.music.load(file_name)
            pygame.mixer.music.play()

            # Keep the program running until the audio finishes playing
            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)
            logging.debug("Playing the audio content finished")
        else:
            logging.error("No audio content received from Text-to-Speech API")
            return None
    except Exception as e:
        logging.error(f"Error during Text-to-Speech synthesis: {e}")
        return None


if __name__ == '__main__':
    # Start the background thread
    threading.Thread(target=process_transcripts, daemon=True).start()
    # Run the Flask application with SocketIO
    socketio.run(app, debug=True)
