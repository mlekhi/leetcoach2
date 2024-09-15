import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OpenAI API key is not set");
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }
  
  try {
    console.log("Received POST request");
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      console.error("No file or invalid file in request");
      return NextResponse.json({ error: 'No audio file uploaded' }, { status: 400 });
    }

    console.log("File received:", file.type, file.size);

    // Save the file to a temporary location (optional but useful)
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = `/tmp/audio.webm`;
    fs.writeFileSync(filePath, buffer); // Save to disk

    // Stream the saved file for the OpenAI request
    const openaiFormData = new FormData();
    openaiFormData.append('file', fs.createReadStream(filePath), {
      filename: 'audio.webm',
      contentType: 'audio/webm',
    });
    openaiFormData.append('model', 'whisper-1');

    console.log("Sending request to OpenAI");
    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', openaiFormData, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        ...openaiFormData.getHeaders(),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    console.log("Received response from OpenAI");
    return NextResponse.json({ text: response.data.text });
  } catch (error: any) {
    console.error('Error transcribing audio:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('OpenAI API error details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });
      return NextResponse.json({ 
        error: 'Failed to transcribe audio', 
        details: error.response.data,
        status: error.response.status,
        statusText: error.response.statusText
      }, { status: error.response.status });
    } else {
      return NextResponse.json({ error: 'Failed to transcribe audio', details: error.message }, { status: 500 });
    }
  }
}
