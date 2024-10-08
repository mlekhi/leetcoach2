import { NextRequest, NextResponse } from 'next/server';
import { SpeechClient } from '@google-cloud/speech';
import { Readable } from 'stream';

const client = new SpeechClient();

export async function POST(req: NextRequest) {
  try {
    // Read the audio file from the request body
    const audioBuffer = await req.arrayBuffer();
    const audioBytes = Buffer.from(audioBuffer).toString('base64');

    const request = {
      config: {
        encoding: 'WEBM_OPUS' as const, // Ensure the encoding is correct for your audio file
        sampleRateHertz: 48000, // Adjust this to match the sample rate of your audio file
        languageCode: 'en-US',
      },
      audio: {
        content: audioBytes,
      },
    };

    const [response] = await client.recognize(request);

    if (response) {
      console.log(response);
    }

    // Check if response.results is defined and not empty
    if (response.results && response.results.length > 0) {
      const transcriptions = response.results.map(result => {
        // Access alternatives and get the transcript
        const alternative = result.alternatives[0]; // Take the first alternative
        console.log(alternative)
        return alternative;
      });

    return NextResponse.json({ message: 'Transcription completed', transcriptions }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No transcription results found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error during processing:', error);
    return NextResponse.json({ error: 'Error processing audio', details: error.message }, { status: 500 });
  }
}
