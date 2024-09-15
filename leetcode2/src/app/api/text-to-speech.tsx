import { NextApiRequest, NextApiResponse } from 'next';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { text } = req.body as { text: string };

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Initialize the client
    const client = new TextToSpeechClient();

    // Construct the request
    const request = {
      input: { text: text },
      voice: { languageCode: 'en-US', name: 'en-US-Neural2-C' },
      audioConfig: { audioEncoding: 'MP3' as const },
    };

    // Perform the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new Error('No audio content received');
    }

    // Convert the audio content to a readable stream
    const audioStream = new Readable();
    audioStream.push(response.audioContent);
    audioStream.push(null);

    // Set the appropriate headers
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename=speech.mp3');

    // Pipe the audio stream to the response
    audioStream.pipe(res);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
}