import * as express from 'express';
import axios from 'axios';
import * as multer from 'multer';
import * as FormData from 'form-data';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import * as fs from 'fs';

dotenv.config();

const app = express();
const upload = multer();

// Enable CORS for all routes
app.use(cors());

// Use environment variable for the API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in the environment variables.');
  process.exit(1);
}

// Define types for better TypeScript support
interface OpenAIResponse {
  text: string;
}

// Helper function to handle retries when rate-limited
const retryRequest = async (
  fn: () => Promise<any>,
  retries: number = 5,
  delay: number = 5000
): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        console.log(`Rate limit hit. Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponentially increase delay
      } else {
        throw error; // Throw other errors
      }
    }
  }
  throw new Error('Max retries exceeded');
};

// Endpoint to handle audio file upload and transcription
app.post('/transcribe', upload.single('file'), async (req: express.Request, res: express.Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const audioFile = req.file;
    console.log(
      'Received file:',
      audioFile.originalname,
      audioFile.mimetype,
      'Size:',
      audioFile.size
    );

    // Save audio file for inspection (optional)
    fs.writeFileSync('received_audio.webm', req.file.buffer);
    console.log('Audio file saved for inspection');

    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: 'audio.webm',
      contentType: 'audio/webm',
    });
    formData.append('model', 'whisper-1');

    // Use retry logic for the request
    const response = await retryRequest(() =>
      axios.post<OpenAIResponse>('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          ...formData.getHeaders(),
        },
      })
    );

    console.log('OpenAI API response:', response.data);

    res.json({ text: response.data.text });
  } catch (error: any) {
    console.error('Error transcribing audio:', error.response ? error.response.data : error.message);
    res.status(500).json({
      error: 'Failed to transcribe audio',
      details: error.response ? error.response.data : error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
