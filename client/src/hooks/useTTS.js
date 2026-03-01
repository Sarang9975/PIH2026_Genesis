import { useCallback, useRef, useState } from 'react';
import api from '../lib/api';

/**
 * Custom hook encapsulating text‑to‑speech behavior with proxy fallback.
 *
 * Returns an object with:
 *  - isTTSPlaying (boolean)
 *  - speakText(text, language?) function
 *  - setTTSPlaying(boolean) helper for external callers
 */
export function useTTS() {
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const currentTTSAudioRef = useRef(null);

  const setTTSPlaying = useCallback((v) => {
    setIsTTSPlaying(v);
  }, []);

  const speakText = useCallback(async (text, language = 'en-US') => {
    if (!text) return;

    // stop any existing audio
    if (currentTTSAudioRef.current) {
      try {
        currentTTSAudioRef.current.pause();
        currentTTSAudioRef.current.currentTime = 0;
      } catch (e) {
        console.warn('Error stopping previous TTS audio:', e);
      }
      currentTTSAudioRef.current = null;
    }

    // cancel browser speech as a courtesy
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsTTSPlaying(true);

    try {
      const langCode = (language || 'en').split('-')[0];
      const encodedText = encodeURIComponent(text);
      const signalingOrigin = import.meta.env.VITE_SIGNALING_URL || 'http://localhost:5000';
      const url = `${signalingOrigin.replace(/\/$/, '')}/api/translate/tts?text=${encodedText}&lang=${langCode}`;

      const audio = new Audio(url);
      audio.crossOrigin = 'anonymous';
      currentTTSAudioRef.current = audio;

      const safetyTimeout = setTimeout(() => {
        console.warn('⚠️ TTS safety timeout: resetting isTTSPlaying');
        setIsTTSPlaying(false);
        if (currentTTSAudioRef.current === audio) currentTTSAudioRef.current = null;
      }, 10000);

      audio.addEventListener('ended', () => {
        clearTimeout(safetyTimeout);
        setIsTTSPlaying(false);
        if (currentTTSAudioRef.current === audio) currentTTSAudioRef.current = null;
      });
      audio.addEventListener('error', () => {
        clearTimeout(safetyTimeout);
        setIsTTSPlaying(false);
        if (currentTTSAudioRef.current === audio) currentTTSAudioRef.current = null;
      });

      audio.play().catch(err => {
        console.error('❌ Audio Playback Failed (Proxy):', err);
        if (currentTTSAudioRef.current === audio) currentTTSAudioRef.current = null;
        setIsTTSPlaying(false);
        // fallback to browser
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(text);
          u.lang = language || 'en-US';
          u.onstart = () => setIsTTSPlaying(true);
          u.onend = () => setIsTTSPlaying(false);
          u.onerror = () => setIsTTSPlaying(false);
          window.speechSynthesis.speak(u);
        }
      });
    } catch (e) {
      console.error('❌ Google TTS setup failed:', e);
      setIsTTSPlaying(false);
    }
  }, []);

  return { isTTSPlaying, speakText, setTTSPlaying };
}
