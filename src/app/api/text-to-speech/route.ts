import { NextRequest, NextResponse } from "next/server";
import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";

const client = new TextToSpeechClient();

type SynthesizeSpeechRequest =
  protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest;
type SynthesizeSpeechResponse =
  protos.google.cloud.texttospeech.v1.ISynthesizeSpeechResponse;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const request: SynthesizeSpeechRequest = {
      input: { text },
      voice: { languageCode: "en-US", name: "en-US-Neural2-C" },
      audioConfig: { audioEncoding: "MP3" as const },
    };

    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new Error("No audio content received from Google TTS API");
    }

    const headers = new Headers();
    headers.set("Content-Type", "audio/mpeg");
    headers.set("Content-Length", response.audioContent.length.toString());

    return new NextResponse(response.audioContent, { headers });
  } catch (error) {
    console.error("Error during text-to-speech synthesis:", error);
    return NextResponse.json(
      { error: "Error synthesizing speech" },
      { status: 500 }
    );
  }
}
