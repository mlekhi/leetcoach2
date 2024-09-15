"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var axios_1 = require("axios");
var multer = require("multer");
var FormData = require("form-data");
var dotenv = require("dotenv");
var cors = require("cors");
var fs = require("fs");
dotenv.config();
var app = express();
var upload = multer();
// Enable CORS for all routes
app.use(cors());
// Use environment variable for the API key
var OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set in the environment variables.');
    process.exit(1);
}
// Helper function to handle retries when rate-limited
var retryRequest = function (fn_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([fn_1], args_1, true), void 0, function (fn, retries, delay) {
        var i, error_1;
        if (retries === void 0) { retries = 5; }
        if (delay === void 0) { delay = 5000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < retries)) return [3 /*break*/, 9];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 8]);
                    return [4 /*yield*/, fn()];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    error_1 = _a.sent();
                    if (!(error_1.response && error_1.response.status === 429)) return [3 /*break*/, 6];
                    console.log("Rate limit hit. Retrying in ".concat(delay / 1000, " seconds..."));
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay); })];
                case 5:
                    _a.sent();
                    delay *= 2; // Exponentially increase delay
                    return [3 /*break*/, 7];
                case 6: throw error_1; // Throw other errors
                case 7: return [3 /*break*/, 8];
                case 8:
                    i++;
                    return [3 /*break*/, 1];
                case 9: throw new Error('Max retries exceeded');
            }
        });
    });
};
// Endpoint to handle audio file upload and transcription
app.post('/transcribe', upload.single('file'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var audioFile, formData_1, response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.file) {
                    return [2 /*return*/, res.status(400).json({ error: 'No audio file uploaded' })];
                }
                audioFile = req.file;
                console.log('Received file:', audioFile.originalname, audioFile.mimetype, 'Size:', audioFile.size);
                // Save audio file for inspection (optional)
                fs.writeFileSync('received_audio.webm', req.file.buffer);
                console.log('Audio file saved for inspection');
                formData_1 = new FormData();
                formData_1.append('file', req.file.buffer, {
                    filename: 'audio.webm',
                    contentType: 'audio/webm',
                });
                formData_1.append('model', 'whisper-1');
                return [4 /*yield*/, retryRequest(function () {
                        return axios_1.default.post('https://api.openai.com/v1/audio/transcriptions', formData_1, {
                            headers: __assign({ 'Authorization': "Bearer ".concat(OPENAI_API_KEY) }, formData_1.getHeaders()),
                        });
                    })];
            case 1:
                response = _a.sent();
                console.log('OpenAI API response:', response.data);
                res.json({ text: response.data.text });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error transcribing audio:', error_2.response ? error_2.response.data : error_2.message);
                res.status(500).json({
                    error: 'Failed to transcribe audio',
                    details: error_2.response ? error_2.response.data : error_2.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
