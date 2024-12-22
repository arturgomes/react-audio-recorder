import { useState, useRef, useEffect } from 'react';

export interface AudioRecorderConfig {
  onSave?: (blob: Blob) => void;
  onDelete?: () => void;
  onUpdate?: (blob: Blob) => void;
  maxDuration?: number;
  compressionFormat?: string;
  compressionBitsPerSecond?: number;
}

interface AudioRecorderState {
  isRecording: boolean;
  isPlaying: boolean;
  duration: number;
  audioUrl: string;
}

interface AudioRecorderControls {
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  togglePlayback: () => void;
  deleteRecording: () => void;
}

const useAudioRecorder = ({
  onSave = () => {},
  onDelete = () => {},
  onUpdate = () => {},
  maxDuration = 300,
  compressionFormat = 'audio/webm;codecs=opus',
  compressionBitsPerSecond = 96000,
}: AudioRecorderConfig = {}): [AudioRecorderState, AudioRecorderControls] => {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    isPlaying: false,
    duration: 0,
    audioUrl: '',
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef(new Audio());

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: compressionFormat,
        bitsPerSecond: compressionBitsPerSecond
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: compressionFormat });
        const url = URL.createObjectURL(blob);
        setState(prev => ({ ...prev, audioUrl: url }));
        onSave(blob);
      };
      
      setState(prev => ({ ...prev, isRecording: true, duration: 0 }));
      mediaRecorder.start(1000);
      
      timerRef.current = window.setInterval(() => {
        setState(prev => ({ ...prev, duration: prev.duration + 1 }));
        if (state.duration >= maxDuration) {
          stopRecording();
        }
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setState(prev => ({ ...prev, isRecording: false }));
    }
  };

  const togglePlayback = () => {
    if (state.isPlaying) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    } else {
      audioRef.current.src = state.audioUrl;
      audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  };

  const deleteRecording = () => {
    setState({
      isRecording: false,
      isPlaying: false,
      duration: 0,
      audioUrl: '',
    });
    onDelete();
  };

  useEffect(() => {
    audioRef.current.onended = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (state.audioUrl) {
        URL.revokeObjectURL(state.audioUrl);
      }
    };
  }, [state.audioUrl]);

  return [
    state,
    {
      startRecording,
      stopRecording,
      togglePlayback,
      deleteRecording,
    }
  ];
};

export default useAudioRecorder;