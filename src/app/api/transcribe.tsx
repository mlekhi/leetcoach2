// pages/api/transcribe.ts
//@ts-nocheck
import { NextApiRequest, NextApiResponse } from 'next';
import { SpeechClient } from '@google-cloud/speech';
import { PassThrough } from 'stream';

const speechClient = new SpeechClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' });
  }

  const passThroughStream = new PassThrough();

  const request = {
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    },
    interimResults: true, // If you want interim results
  };

  const recognizeStream = speechClient
    .streamingRecognize(request)
    .on('data', (data) => {
      const transcription = data.results[0]?.alternatives[0]?.transcript || '';
      res.write(JSON.stringify({ transcription }));
    })
    .on('error', (error) => {
      res.status(500).json({ error: error.message });
    })
    .on('end', () => {
      res.end();
    });

  req.pipe(passThroughStream);
  passThroughStream.pipe(recognizeStream);
}
