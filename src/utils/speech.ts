import { LanguageCode, SUPPORTED_LANGUAGES } from './i18n';

// Type definitions for Web Speech API SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

let activeUtterance: SpeechSynthesisUtterance | null = null;
let currentRecognizer: any = null;

export interface SpeakOptions {
  text: string;
  langCode?: LanguageCode;
  locale?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onError?: (err: any) => void;
  onBoundary?: (event: SpeechSynthesisEvent) => void;
}

/**
 * Returns true if speech synthesis is supported in the current browser.
 */
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Returns true if speech recognition (Speech-to-Text) is supported in current browser.
 */
export function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
}

/**
 * Find the best matching browser voice for the desired language locale.
 */
export function getBestVoice(locale: string): SpeechSynthesisVoice | null {
  if (!isSpeechSynthesisSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Exact match e.g. "es-ES" or "zh-CN"
  let match = voices.find(v => v.lang.toLowerCase() === locale.toLowerCase());
  if (match) return match;

  // 2. Prefix match e.g. "es" matches "es-MX" or "es-US"
  const langPrefix = locale.split('-')[0].toLowerCase();
  match = voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
  if (match) return match;

  // 3. Check default voice
  const defaultVoice = voices.find(v => v.default);
  return defaultVoice || voices[0] || null;
}

/**
 * Speaks text aloud using Speech Synthesis with safety guards for Chrome GC bug.
 */
export function speakText(options: SpeakOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isSpeechSynthesisSupported()) {
      options.onError?.(new Error('Speech synthesis not supported in this browser.'));
      reject(new Error('Speech synthesis not supported.'));
      return;
    }

    try {
      // Cancel previous speech before starting
      window.speechSynthesis.cancel();

      const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === options.langCode);
      const targetLocale = options.locale || langInfo?.locale || 'en-US';

      const utterance = new SpeechSynthesisUtterance(options.text);
      utterance.lang = targetLocale;
      utterance.rate = options.rate !== undefined ? options.rate : 1.0;
      utterance.pitch = options.pitch !== undefined ? options.pitch : 1.0;
      utterance.volume = options.volume !== undefined ? options.volume : 1.0;

      const voice = getBestVoice(targetLocale);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onend = () => {
        activeUtterance = null;
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (e) => {
        // Interrupted is normal when user cancels or switches
        if (e.error === 'interrupted' || e.error === 'canceled') {
          activeUtterance = null;
          options.onEnd?.();
          resolve();
          return;
        }
        activeUtterance = null;
        options.onError?.(e);
        reject(e);
      };

      utterance.onpause = () => {
        options.onPause?.();
      };

      utterance.onresume = () => {
        options.onResume?.();
      };

      if (options.onBoundary) {
        utterance.onboundary = options.onBoundary;
      }

      // Maintain reference in module scope to prevent garbage collection bug in Chrome
      activeUtterance = utterance;

      // Chrome bug workaround: speech sometimes pauses after 15 seconds if long
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      options.onError?.(err);
      reject(err);
    }
  });
}

/**
 * Stops any ongoing speech synthesis.
 */
export function stopSpeech(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

/**
 * Pauses active speech synthesis.
 */
export function pauseSpeech(): void {
  if (isSpeechSynthesisSupported() && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
}

/**
 * Resumes paused speech synthesis.
 */
export function resumeSpeech(): void {
  if (isSpeechSynthesisSupported() && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}

/**
 * Checks if speech is currently playing.
 */
export function isSpeaking(): boolean {
  return Boolean(isSpeechSynthesisSupported() && window.speechSynthesis.speaking && !window.speechSynthesis.paused);
}

/**
 * Checks if speech is currently paused.
 */
export function isSpeechPaused(): boolean {
  return Boolean(isSpeechSynthesisSupported() && window.speechSynthesis.paused);
}

export interface ListenOptions {
  langCode?: LanguageCode;
  locale?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: any) => void;
  onEnd?: () => void;
  onStart?: () => void;
}

/**
 * Starts microphone speech recognition for voice queries.
 */
export function startListening(options: ListenOptions): { stop: () => void; abort: () => void } | null {
  if (!isSpeechRecognitionSupported()) {
    options.onError?.({ error: 'not_supported', message: 'Speech recognition is not supported in this browser.' });
    return null;
  }

  try {
    // Stop any existing recognizer
    if (currentRecognizer) {
      try {
        currentRecognizer.stop();
      } catch {
        // silent
      }
      currentRecognizer = null;
    }

    const SpeechRecClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognizer = new SpeechRecClass();

    const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === options.langCode);
    recognizer.lang = options.locale || langInfo?.locale || 'en-US';
    recognizer.continuous = Boolean(options.continuous);
    recognizer.interimResults = options.interimResults !== undefined ? options.interimResults : true;
    recognizer.maxAlternatives = 1;

    recognizer.onstart = () => {
      options.onStart?.();
    };

    recognizer.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      if (final) {
        options.onResult(final.trim(), true);
      } else if (interim) {
        options.onResult(interim.trim(), false);
      }
    };

    recognizer.onerror = (event: any) => {
      // Ignore 'no-speech' or 'aborted' if user stopped
      if (event.error === 'no-speech' || event.error === 'aborted') {
        return;
      }
      options.onError?.(event);
    };

    recognizer.onend = () => {
      currentRecognizer = null;
      options.onEnd?.();
    };

    recognizer.start();
    currentRecognizer = recognizer;

    return {
      stop: () => {
        try {
          recognizer.stop();
        } catch {
          // silent
        }
        currentRecognizer = null;
      },
      abort: () => {
        try {
          recognizer.abort();
        } catch {
          // silent
        }
        currentRecognizer = null;
      }
    };
  } catch (err) {
    options.onError?.(err);
    return null;
  }
}

/**
 * Stops any active speech recognition microphone recording.
 */
export function stopListening(): void {
  if (currentRecognizer) {
    try {
      currentRecognizer.stop();
    } catch {
      // silent
    }
    currentRecognizer = null;
  }
}
