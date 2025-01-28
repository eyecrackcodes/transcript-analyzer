import React, { useState, useRef } from 'react';
import { Mic, Square, Loader } from 'lucide-react';

const VoiceRecorder = ({ onTranscriptionComplete, openai }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerInterval = useRef(null);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      startTimer();
    } catch (err) {
      setError('Error accessing microphone. Please ensure you have granted permission.');
      console.error('Recording error:', err);
    }
  };

  const startTimer = () => {
    setRecordingTime(0);
    timerInterval.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(timerInterval.current);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      setIsProcessing(true);
      
      // Convert blob to File object
      const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });

      // Transcribe using OpenAI Whisper API
      const response = await openai.audio.transcriptions.create({
        file: file,
        model: 'whisper-1',
      });

      if (response.text) {
        onTranscriptionComplete(response.text);
      } else {
        throw new Error('No transcription received');
      }
    } catch (err) {
      setError('Error transcribing audio. Please try again.');
      console.error('Transcription error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex flex-col items-center space-y-4">
        {/* Recording Status */}
        <div className="text-center">
          {isRecording ? (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Recording: {formatTime(recordingTime)}</span>
            </div>
          ) : (
            <span className="font-medium">Ready to Record</span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={isProcessing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              <Mic className="w-5 h-5" />
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <Square className="w-5 h-5" />
              <span>Stop Recording</span>
            </button>
          )}
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="flex items-center space-x-2 text-gray-600">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Processing recording...</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
