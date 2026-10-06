import React, { useEffect, useMemo, useState } from 'react';
import {
  Globe,
  Headphones,
  Info,
  Pause,
  Play,
  RotateCcw,
  Square,
  Volume2,
  VolumeX,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { MedicalAnalysis } from '../types';
import {
  generateAudioReportTranscript,
  getTranslation,
  LanguageCode,
  SUPPORTED_LANGUAGES
} from '../utils/i18n';
import {
  isSpeechSynthesisSupported,
  pauseSpeech,
  resumeSpeech,
  speakText,
  stopSpeech
} from '../utils/speech';

interface Props {
  analysis: MedicalAnalysis;
  currentLanguage: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export const VoiceAssistantPlayer: React.FC<Props> = ({
  analysis,
  currentLanguage,
  onLanguageChange
}) => {
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(currentLanguage);
  const [playbackState, setPlaybackState] = useState<'idle' | 'playing' | 'paused' | 'ended'>('idle');
  const [rate, setRate] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [supported, setSupported] = useState<boolean>(true);

  const t = getTranslation(selectedLang);

  useEffect(() => {
    setSelectedLang(currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    setSupported(isSpeechSynthesisSupported());
    return () => {
      stopSpeech();
    };
  }, []);

  const transcript = useMemo(() => {
    return generateAudioReportTranscript(analysis, selectedLang);
  }, [analysis, selectedLang]);

  const handlePlay = async () => {
    if (playbackState === 'paused') {
      resumeSpeech();
      setPlaybackState('playing');
      return;
    }

    setPlaybackState('playing');

    try {
      await speakText({
        text: transcript,
        langCode: selectedLang,
        rate,
        onStart: () => setPlaybackState('playing'),
        onPause: () => setPlaybackState('paused'),
        onResume: () => setPlaybackState('playing'),
        onEnd: () => setPlaybackState('ended'),
        onError: () => setPlaybackState('idle')
      });
    } catch {
      setPlaybackState('idle');
    }
  };

  const handlePause = () => {
    pauseSpeech();
    setPlaybackState('paused');
  };

  const handleStop = () => {
    stopSpeech();
    setPlaybackState('idle');
  };

  const handleReplay = () => {
    stopSpeech();
    handlePlay();
  };

  const handleLanguageSelect = (newLang: LanguageCode) => {
    if (playbackState === 'playing' || playbackState === 'paused') {
      stopSpeech();
      setPlaybackState('idle');
    }
    setSelectedLang(newLang);
    onLanguageChange?.(newLang);
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (playbackState === 'playing') {
      // Re-trigger with new rate smoothly
      stopSpeech();
      setTimeout(() => {
        setPlaybackState('playing');
        speakText({
          text: transcript,
          langCode: selectedLang,
          rate: newRate,
          onStart: () => setPlaybackState('playing'),
          onPause: () => setPlaybackState('paused'),
          onResume: () => setPlaybackState('playing'),
          onEnd: () => setPlaybackState('ended'),
          onError: () => setPlaybackState('idle')
        }).catch(() => setPlaybackState('idle'));
      }, 50);
    }
  };

  if (!supported) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 flex items-center gap-2.5">
        <VolumeX className="w-4 h-4 text-amber-600 shrink-0" />
        <span>Voice assistant narration is not supported in this browser.</span>
      </div>
    );
  }

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 text-white rounded-2xl border border-cyan-800/40 shadow-lg overflow-hidden transition-all">
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold tracking-wide uppercase text-cyan-300">
                {t.voiceResultTitle}
              </h3>
              {playbackState === 'playing' && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Speaking
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300">
              {t.voiceResultDesc}
            </p>
          </div>
        </div>

        {/* Language Switcher for Audio */}
        <div className="flex items-center gap-2">
          <div className="relative inline-flex items-center">
            <Globe className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedLang}
              onChange={(e) => handleLanguageSelect(e.target.value as LanguageCode)}
              className="bg-slate-800/90 text-white text-xs font-medium pl-7 pr-7 py-1.5 rounded-xl border border-cyan-500/30 hover:border-cyan-400 focus:outline-hidden cursor-pointer appearance-none"
              title="Select narration language"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.flag} {lang.nativeLabel} ({lang.label})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Interactive Controls */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Playback Button Group & Equalizer */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-center sm:justify-start">
          {playbackState === 'playing' ? (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{playbackState === 'paused' ? 'Resume' : t.voiceListenScan}</span>
            </button>
          )}

          {(playbackState === 'playing' || playbackState === 'paused') && (
            <button
              onClick={handleStop}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
              title="Stop audio"
            >
              <Square className="w-4 h-4" />
            </button>
          )}

          {playbackState === 'ended' && (
            <button
              onClick={handleReplay}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.voiceReplay}</span>
            </button>
          )}

          {/* Sound wave visualizer when speaking */}
          <div className="flex items-center gap-1 px-3 py-2 bg-black/30 rounded-xl border border-white/5">
            {[40, 75, 55, 90, 60, 85, 45, 70].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-200 ${
                  playbackState === 'playing'
                    ? 'bg-cyan-400 animate-pulse'
                    : 'bg-slate-600'
                }`}
                style={{
                  height: playbackState === 'playing' ? `${Math.max(8, (h * (i % 2 === 0 ? 1 : 0.7)) / 3.5)}px` : '6px',
                  animationDelay: `${i * 120}ms`
                }}
              />
            ))}
            <span className="text-[11px] text-slate-400 ml-2 font-mono">
              {playbackState === 'playing' ? t.voicePlaying : playbackState === 'paused' ? t.voicePaused : `${currentLangObj.flag} ${currentLangObj.nativeLabel}`}
            </span>
          </div>
        </div>

        {/* Speed Controls & Transcript Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-center sm:justify-end text-xs">
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <span className="text-[11px] text-slate-400 px-2">{t.voiceSpeed}:</span>
            {[0.8, 1.0, 1.25].map((s) => (
              <button
                key={s}
                onClick={() => handleRateChange(s)}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  rate === s
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowTranscript(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white rounded-xl text-xs font-medium border border-white/10 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-300" />
            <span>{showTranscript ? t.voiceHideTranscript : t.voiceViewTranscript}</span>
            {showTranscript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expandable Transcript Panel */}
      {showTranscript && (
        <div className="px-5 pb-5 pt-1 border-t border-white/10 bg-black/25 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-[11px] text-cyan-300 font-semibold mb-2">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Spoken Script ({currentLangObj.nativeLabel}):
            </span>
            <span className="text-slate-400 font-mono">{analysis.prediction.condition}</span>
          </div>
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/10 text-slate-200 leading-relaxed max-h-48 overflow-y-auto font-sans text-xs">
            {transcript}
          </div>
        </div>
      )}
    </div>
  );
};
