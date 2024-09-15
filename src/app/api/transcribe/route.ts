import { NextRequest, NextResponse } from 'next/server';
import { SpeechClient } from '@google-cloud/speech';
import { Readable } from 'stream';

const client = new SpeechClient();

export async function POST(req: NextRequest) {
  try {
    const audioBuffer = await req.arrayBuffer();
    const audioStream = Readable.from(Buffer.from(audioBuffer));

    const request = {
      config: {
        encoding: 'LINEAR16', // Adjust encoding if necessary
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      },
      interimResults: true, // If you want interim results
    };

    const recognizeStream = client
      .streamingRecognize(request)
      .on('data', (data) => {
        console.log("dummy")
        const transcription = data.results[0]?.alternatives[0]?.transcript || '';
        console.log('Transcription:', transcription);
      })
      .on('error', (error) => {
        console.error('Error during speech recognition:', error);
        return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
      })
      .on('end', () => {
        console.log('Transcription ended');
      });

    audioStream.pipe(recognizeStream);

    return NextResponse.json({ message: 'Processing audio' }, { status: 200 });
  } catch (error) {
    console.error('Error during processing:', error);
    return NextResponse.json({ error: 'Error processing audio', details: error.message }, { status: 500 });
  }
}
