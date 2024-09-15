import { NextApiRequest, NextApiResponse } from "next";
import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";

const client = new TextToSpeechClient();

type SynthesizeSpeechRequest =
  protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest;
type SynthesizeSpeechResponse =
  protos.google.cloud.texttospeech.v1.ISynthesizeSpeechResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { text } = req.body as { text?: string };

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
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

    // Set appropriate headers for audio streaming
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Transfer-Encoding", "chunked");

    // Send the audio content directly to the client
    res.send(response.audioContent);
  } catch (error) {
    console.error("Error during text-to-speech synthesis:", error);
    res.status(500).json({ error: "Error synthesizing speech" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
    responseLimit: false,
  },
};
