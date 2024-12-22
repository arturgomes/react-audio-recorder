import React from "react";
import { Play, Pause, Mic, Square, Trash2 } from 'lucide-react';

import useAudioRecorder, { AudioRecorderConfig } from "../hooks/useAudioRecorder";
import { formatTime } from "../utils/formatTime";

export const AudioRecorder: React.FC<AudioRecorderConfig> = (props) => {
  const [state, controls] = useAudioRecorder(props);
  const { isRecording, isPlaying, duration, audioUrl } = state;
  const { startRecording, stopRecording, togglePlayback, deleteRecording } = controls;

  return (
    <div className="w-full max-w-md rounded-full bg-white shadow-sm">
      <div className="flex items-center px-4 py-2">
        {audioUrl ? (
          <>
            <button
              onClick={togglePlayback}
              className="mr-3 rounded-full p-2 hover:bg-blue-50"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-blue-500" />
              ) : (
                <Play className="h-5 w-5 text-blue-500" />
              )}
            </button>
            <div className="flex-1">
              <div className="h-2 rounded-full bg-gray-100">
                <div 
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${(duration / (props.maxDuration || 300)) * 100}%` }}
                />
              </div>
            </div>
            <button
              onClick={deleteRecording}
              className="ml-3 rounded-full p-2 hover:bg-red-50"
              aria-label="Delete recording"
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className="mr-3 rounded-full p-2 hover:bg-blue-50"
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? (
                <Square className="h-5 w-5 text-red-500" />
              ) : (
                <Mic className="h-5 w-5 text-blue-500" />
              )}
            </button>
            <div className="flex-1">
              <div className="h-2 rounded-full bg-gray-100">
                <div 
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${(duration / (props.maxDuration || 300)) * 100}%` }}
                />
              </div>
            </div>
          </>
        )}
        <span className="ml-3 min-w-[40px] text-sm text-gray-500">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default AudioRecorder;