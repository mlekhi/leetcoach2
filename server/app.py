
from flask import Flask, request, jsonify
import os
from groq import Groq
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will allow requests from any origin

# Initialize Groq client
client = Groq(api_key='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')

@app.route('/get_completion', methods=['POST'])
def get_completion():
    data = request.json
    user_message = data.get('userMessage')

    try:
        # Create a chat completion request
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            model="llama3-8b-8192"  # Replace with the desired model
        )

        # Extract the response content
        response_content = chat_completion.choices[0].message.content
        return jsonify({'response': response_content}), 200

    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return jsonify({'error': 'Failed to get chat completion from Groq'}), 500

if __name__ == '__main__':
    app.run(debug=True)
