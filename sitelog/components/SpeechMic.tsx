import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface SpeechMicProps {
  onTranscript: (text: string) => void;
  className?: string;
  disabled?: boolean;
}

export const SpeechMic: React.FC<SpeechMicProps> = ({ onTranscript, className = '', disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
            onTranscript(transcript);
        }
        setIsListening(false);
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, [onTranscript]);

  const toggleListening = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSupported || !recognition) {
        alert("Voice input is not supported in this browser. Please use Chrome, Safari, or Edge.");
        return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
        setIsListening(false);
      }
    }
  }, [recognition, isListening, isSupported]);

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      className={`transition-all flex items-center justify-center rounded-full p-1.5 ${className} ${
        isListening 
          ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/50' 
          : 'text-slate-400 hover:text-white hover:bg-slate-600'
      }`}
      title={isListening ? "Stop listening" : "Tap to speak"}
    >
      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
    </button>
  );
};
