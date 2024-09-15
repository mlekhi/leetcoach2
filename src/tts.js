const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const path = require('path');

// Creates a client
//const client = new textToSpeech.TextToSpeechClient();
// const textToSpeech = require("@google-cloud/text-to-speech");

const client = new textToSpeech.TextToSpeechClient({
  keyFilename: "C:/Users/david/Desktop/leetcoach2/key.json",
});
// The text to be synthesized
const text = 'Hmm, In order to solve this you need a hash set; that\'s where you can store the elements of the list and that will make your solution O of N, I mean, Linear time';

// Construct the request
const request = {
  input: { text: text },
  voice: { languageCode: 'en-US', name: 'en-US-Neural2-C' },
  audioConfig: { audioEncoding: 'MP3' },
};



/*
async function listVoices() {
  try {
    const [result] = await client.listVoices({});
    const voices = result.voices;
    console.log('Available voices:');
    voices.forEach((voice) => {
      console.log(`Name: ${voice.name}`);
      console.log(`Language Codes: ${voice.languageCodes.join(', ')}`);
      console.log(`SSML Gender: ${voice.ssmlGender}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error listing voices:', error);
  }
}

listVoices();
*/


// Performs the text-to-speech request
async function quickStart() {
  try {
    const [response] = await client.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(path.join(__dirname, 'output.mp3'), response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');
  } catch (error) {
    console.error('Error during text-to-speech synthesis:', error);
  }
}

quickStart();
