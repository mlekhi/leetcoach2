const { Writable } = require('stream');
const axios = require('axios');
const speech = require('@google-cloud/speech').v1p1beta1;
const chalk = require('chalk');
const recorder = require('node-record-lpcm16');

const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';
const streamingLimit = 10000; // ms
let restartCounter = 0;
const client = new speech.SpeechClient();
let user_speech_inputs = ``;
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
let audioInput = [];
let lastAudioInput = [];
let resultEndTime = 0;
let isFinalEndTime = 0;
let finalRequestEndTime = 0;
let newStream = true;
let bridgingOffset = 0;
let lastTranscriptWasFinal = false;
let lastFinalTranscript = ''; // To store the last final transcript
let transcriptTimeout = null;
const transcriptWaitTime = 5000; // 5 seconds

async function sendTranscriptionToFlask(transcript) {
  const flaskUrl = 'http://127.0.0.1:5000/get_completion';
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
  audioInput = [];
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

  setTimeout(restartStream, streamingLimit);
}

const speechCallback = (stream) => {
  resultEndTime =
    stream.results[0].resultEndTime.seconds * 1000 +
    Math.round(stream.results[0].resultEndTime.nanos / 1000000);

  const correctedTime =
    resultEndTime - bridgingOffset + streamingLimit * restartCounter;

  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  let stdoutText = "";
  if (stream.results[0] && stream.results[0].alternatives[0]) {
    stdoutText =
    stdoutText + correctedTime + ': ' + stream.results[0].alternatives[0].transcript;
  }

  if (stream.results[0].isFinal) {
    process.stdout.write(chalk.green(`${stdoutText}\n`));
    
    if (stream.results[0].alternatives[0].transcript !== lastFinalTranscript) {
      user_speech_inputs =  user_speech_inputs + "user: " + stream.results[0].alternatives[0].transcript + "\n";
      lastFinalTranscript = `Problem: Duplicate Integer

      Problem Description:
      "Given an integer array nums, return true if any value appears more than once in the array, otherwise return false."
      
      Solution to the problem that you should check the users solution with (this is only accessible to you and not to the user and you should not reveal details about this solution unless the user explicitly asks for hints): "class Solution:\n    def hasDuplicate(self, nums: List[int]) -> bool:\n        hashset = set()\n        for n in nums:\n            if n in hashset:\n                return True\n            hashset.add(n)\n        return False"
      
      Considering this context, you need to:
      1. Only respond with a proper response if necessary. If the user's explanation and code are progressing as expected, do not interrupt or provide redundant feedback and only return "tingus pingus". Do not include tingus pingus when you want to speak. 
      2. If the user says something off topic, don’t respond and instead bring them back on track.
      3. If the user gives a correct 
      4. Always respond to the user in second person POV or their name
      5. Silence is represented by the # symbol followed by a number of seconds. If the user is quiet for more than 5 seconds, ask them to explain their thought process.
      6. When the user has a valid solution for their code and they have sufficiently explained their thought process, congratulate the user and tell them that they are free to end the interview. 
      Respond with a proper response if:
      1. The user’s explanation or code shows incorrect logic or inefficiency.
      2. The user is still making mistakes you previously pointed out but hasn’t corrected.
      3. The user's explanation doesn't match their code, or they have introduced new issues.
      4. The user asks for help or a hint (without giving the full answer).
      5. If the user has addressed your earlier feedback, acknowledge their progress and guide them to the next step.
      6. Always respond as briefly as possible and only when you have something new to add. Avoid repeating feedback unless the user has ignored or misunderstood previous advice.
      
      UserName = David 
      
      The conversation is going as follows: \n` + user_speech_inputs;
      
      // Clear previous timeout if still pending
      if (transcriptTimeout) {
        clearTimeout(transcriptTimeout);
      }

      // Set new timeout for 5 seconds before sending transcription
      transcriptTimeout = setTimeout(() => {
        //console.log(lastFinalTranscript);
        sendTranscriptionToFlask(lastFinalTranscript);
      }, transcriptWaitTime);
    }

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

recorder
  .record({
    sampleRateHertz: sampleRateHertz,
    threshold: 0,
    silence: 1000,
    keepSilence: true,
    recordProgram: 'rec',
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
