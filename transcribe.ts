import nextConnect from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import multiparty from 'multiparty';
import axios from 'axios';
import * as FormData from 'form-data';
import * as dotenv from 'dotenv';

dotenv.config();

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry, something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: "Method not allowed" });
  },
});

apiRoute.post(async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("POST request received");
  const form = new multiparty.Form();

  form.parse(req, async (error, fields, files) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    const file = files.file[0]; // Get the file from the form-data

    // Log file details
    console.log('File details:', {
      originalFilename: file.originalFilename,
      path: file.path,
      headers: file.headers,
      contentType: file.headers['content-type'],
    });

    if (!file) {
      res.status(400).json({ error: 'No audio file uploaded' });
      return;
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(file.path), {
      filename: 'audio.webm',
      contentType: 'audio/webm',
    });
    formData.append('model', 'whisper-1');

    try {
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          ...formData.getHeaders(),
        },
      });
      res.status(200).json({ text: response.data.text });
    } catch (error) {
      console.error('Error transcribing audio:', error.response.data);
      res.status(500).json({ error: 'Failed to transcribe audio', details: error.response.data });
    }
  });
});

export default apiRoute;
export const config = {
  api: {
    bodyParser: false, // Disabling body parsing, we'll handle it manually
  },
};
