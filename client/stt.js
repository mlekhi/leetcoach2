require('dotenv').config({ path: './.env.local' }); // Load .env.local file
console.log('Loaded environment variables:', process.env);

const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';
const streamingLimit = 10000; // ms - set to low number for demo purposes

const chalk = require('chalk');
const { Writable } = require('stream');
const recorder = require('node-record-lpcm16');
const axios = require('axios'); // To send HTTP requests to Flask

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech').v1p1beta1;

const client = new speech.SpeechClient();

const config = {
  encoding: encoding,
  sampleRateHertz: sampleRateHertz,
  languageCode: languageCode,
};

const request = {
  config,
  interimResults: true,
};

let recognizeStream = null;
let restartCounter = 0;
let audioInput = [];
let lastAudioInput = [];
let resultEndTime = 0;
let isFinalEndTime = 0;
let finalRequestEndTime = 0;
let newStream = true;
let bridgingOffset = 0;
let lastTranscriptWasFinal = false;

async function sendTranscriptionToFlask(transcript) {
  const flaskUrl = 'http://127.0.0.1:5000/get_completion'; // Flask server URL
  try {
    console.log('Sending transcription to Flask:', transcript);
    const response = await axios.post(flaskUrl, {
      userMessage: transcript,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Received response from Flask:', response.data);
  } catch (error) {
    console.error('Error sending transcription to Flask:', error);
  }
}

function startStream() {
  audioInput = []; // Clear current audioInput

  recognizeStream = client
    .streamingRecognize(request)
    .on('error', (err) => {
      if (err.code === 11) {
        // restartStream();
      } else {
        console.error('API request error ' + err);
      }
    })
    .on('data', speechCallback);

  setTimeout(restartStream, streamingLimit); // Restart stream when streamingLimit expires
}

const speechCallback = (stream) => {
  resultEndTime =
    stream.results[0].resultEndTime.seconds * 1000 +
    Math.round(stream.results[0].resultEndTime.nanos / 1000000);

  const correctedTime =
    resultEndTime - bridgingOffset + streamingLimit * restartCounter;

  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  let stdoutText = '';
  if (stream.results[0] && stream.results[0].alternatives[0]) {
    stdoutText =
      correctedTime + ': ' + stream.results[0].alternatives[0].transcript;
  }

  if (stream.results[0].isFinal) {
    process.stdout.write(chalk.green(`${stdoutText}\n`));

    // Send the final transcript to Flask
    sendTranscriptionToFlask(stream.results[0].alternatives[0].transcript);

    isFinalEndTime = resultEndTime;
    lastTranscriptWasFinal = true;
  } else {
    if (stdoutText.length > process.stdout.columns) {
      stdoutText =
        stdoutText.substring(0, process.stdout.columns - 4) + '...';
    }
    process.stdout.write(chalk.red(`${stdoutText}`));

    lastTranscriptWasFinal = false;
  }
};

const audioInputStreamTransform = new Writable({
  write(chunk, encoding, next) {
    if (newStream && lastAudioInput.length !== 0) {
      const chunkTime = streamingLimit / lastAudioInput.length;
      if (chunkTime !== 0) {
        if (bridgingOffset < 0) {
          bridgingOffset = 0;
        }
        if (bridgingOffset > finalRequestEndTime) {
          bridgingOffset = finalRequestEndTime;
        }
        const chunksFromMS = Math.floor(
          (finalRequestEndTime - bridgingOffset) / chunkTime
        );
        bridgingOffset = Math.floor(
          (lastAudioInput.length - chunksFromMS) * chunkTime
        );

        for (let i = chunksFromMS; i < lastAudioInput.length; i++) {
          recognizeStream.write(lastAudioInput[i]);
        }
      }
      newStream = false;
    }

    audioInput.push(chunk);

    if (recognizeStream) {
      recognizeStream.write(chunk);
    }

    next();
  },

  final() {
    if (recognizeStream) {
      recognizeStream.end();
    }
  },
});

function restartStream() {
  if (recognizeStream) {
    recognizeStream.end();
    recognizeStream.removeListener('data', speechCallback);
    recognizeStream = null;
  }
  if (resultEndTime > 0) {
    finalRequestEndTime = isFinalEndTime;
  }
  resultEndTime = 0;

  lastAudioInput = [];
  lastAudioInput = audioInput;

  restartCounter++;

  if (!lastTranscriptWasFinal) {
    process.stdout.write('\n');
  }
  process.stdout.write(
    chalk.yellow(`${streamingLimit * restartCounter}: RESTARTING REQUEST\n`)
  );

  newStream = true;

  startStream();
}

// Start recording and send the microphone input to the Speech API
recorder
  .record({
    sampleRateHertz: sampleRateHertz,
    threshold: 0, // Silence threshold
    silence: 1000,
    keepSilence: true,
    recordProgram: 'rec', // Try also "arecord" or "sox"
  })
  .stream()
  .on('error', (err) => {
    console.error('Audio recording error ' + err);
  })
  .pipe(audioInputStreamTransform);

console.log('');
console.log('Listening, press Ctrl+C to stop.');
console.log('');
console.log('End (ms)       Transcript Results/Status');
console.log('=========================================================');

startStream();
