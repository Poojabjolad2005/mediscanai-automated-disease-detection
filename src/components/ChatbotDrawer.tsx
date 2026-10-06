import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Bot,
  ChevronDown,
  Globe,
  HeartPulse,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Square,
  User,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import { ChatMessage, MedicalAnalysis } from '../types';
import {
  getTranslation,
  LanguageCode,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS
} from '../utils/i18n';
import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  speakText,
  startListening,
  stopListening,
  stopSpeech
} from '../utils/speech';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  latestAnalysis?: MedicalAnalysis | null;
  currentLanguage?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export const ChatbotDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  latestAnalysis,
  currentLanguage = 'en',
  onLanguageChange
}) => {
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(currentLanguage);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Voice Assistant states
  const [isListening, setIsListening] = useState(false);
  const [speechRecognizedText, setSpeechRecognizedText] = useState('');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [autoReadAloud, setAutoReadAloud] = useState<boolean>(() => {
    return localStorage.getItem('mediscan_chat_autoread') === 'true';
  });
  const [micNotice, setMicNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionControllerRef = useRef<{ stop: () => void; abort: () => void } | null>(null);

  const t = getTranslation(selectedLang);

  // Sync external language
  useEffect(() => {
    if (currentLanguage) {
      setSelectedLang(currentLanguage);
    }
  }, [currentLanguage]);

  // Initialize welcoming message whenever language changes or on first mount
  useEffect(() => {
    const welcomeMessages: Record<LanguageCode, string> = {
      en: `Hello! I am **MediScanAI's Healthcare Chatbot & Voice Assistant**.\n\nI can help you understand radiological terms, explain diseases, and answer your medical imaging questions.\n\n*Please note: I am an educational health assistant and cannot prescribe medicines or replace a doctor.* Feel free to type or tap the microphone to speak!`,
      kn: `ನಮಸ್ಕಾರ! ನಾನು **ಮೆಡಿಸ್ಕ್ಯಾನ್ AI ನ ಆರೋಗ್ಯ ಚಾಟ್‌ಬಾಟ್ ಮತ್ತು ಧ್ವನಿ ಸಹಾಯಕ**.\n\nವೈದ್ಯಕೀಯ ಇಮೇಜಿಂಗ್, ಸ್ಕ್ಯಾನ್ ವರದಿಗಳು, ರೋಗಲಕ್ಷಣಗಳು ಮತ್ತು ವೈದ್ಯಕೀಯ ಪದಗಳನ್ನು ಸುಲಭವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.\n\n*ದಯವಿಟ್ಟು ಗಮನಿಸಿ: ನಾನು ಶೈಕ್ಷಣಿಕ ಆರೋಗ್ಯ ಸಹಾಯಕ, ವೈದ್ಯರ ಪರ್ಯಾಯವಲ್ಲ.* ನೀವು ಟೈಪ್ ಮಾಡಬಹುದು ಅಥವಾ ಮೈಕ್ರೊಫೋನ್ ಒತ್ತಿ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಬಹುದು!`,
      es: `¡Hola! Soy el **Chatbot y Asistente de Voz de MediScanAI**.\n\nPuedo ayudarle a comprender términos de imágenes médicas, explicar patologías y resolver dudas sobre sus estudios.\n\n*Nota: Soy un asistente educativo y no reemplazo a un médico.* ¡Puede escribir o pulsar el micrófono para hablar!`,
      fr: `Bonjour ! Je suis le **Chatbot et Assistant Vocal Médical de MediScanAI**.\n\nJe peux vous aider à comprendre le vocabulaire radiologique, les pathologies et les démarches médicales.\n\n*Remarque : Je suis un assistant éducatif et ne remplace pas votre médecin.* Vous pouvez écrire ou utiliser le micro !`,
      de: `Hallo! Ich bin der **MediScanAI Medizin-Chatbot & Sprachassistent**.\n\nIch helfe Ihnen, radiologische Fachbegriffe, Krankheiten und Befunde verständlich zu erklären.\n\n*Hinweis: Bildungsassistent, ersetzt keinen Arzt.* Sie können tippen oder die Mikrofontaste zum Sprechen nutzen!`,
      hi: `नमस्ते! मैं **मेडिस्कैन AI का हेल्थकेयर चैटबॉट और वॉयस असिस्टेंट** हूँ।\n\nमैं आपको मेडिकल इमेजिंग, बीमारियों और रिपोर्ट के शब्दों को सरल भाषा में समझाने में मदद कर सकता हूँ।\n\n*कृपया ध्यान दें: यह केवल शैक्षिक मार्गदर्शन है, चिकित्सक का विकल्प नहीं।* आप लिखकर पूछ सकते हैं या माइक दबाकर बोल सकते हैं!`,
      zh: `您好！我是 **MediScanAI 医疗对话与语音助手**。\n\n我可以协助您解读影像学术语、阐明病情诊断并解答临床筛查疑问。\n\n*特别提示：本助手仅供健康教育参考，不可替代主治医师的诊断。* 您可以键入问题或点击麦克风直接语音提问！`,
      ar: `مرحباً بك! أنا **المساعد الطبي والذكي الصوتي من MediScanAI**.\n\nيمكنني مساعدتك في فهم مصطلحات الأشعة التشخيصية، وشرح الأمراض والنتائج بلغة مبسطة.\n\n*تنبيه: هذا مساعد استرشادي تعليمي ولا يغني عن استشارة الطبيب.* يمكنك الكتابة أو الضغط على الميكروفون للتحدث!`,
      pt: `Olá! Sou o **Chatbot e Assistente de Voz de Saúde do MediScanAI**.\n\nPosso ajudá-lo a entender laudos de imagem, terminologia médica e orientações de saúde.\n\n*Nota: Sou um assistente educativo e não substituo um médico.* Fique à vontade para digitar ou usar o microfone!`
    };

    setMessages([
      {
        id: `msg-init-${selectedLang}`,
        sender: 'assistant',
        content: welcomeMessages[selectedLang] || welcomeMessages.en,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [selectedLang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Clean up voice synthesis & listening on unmount or close
  useEffect(() => {
    return () => {
      stopSpeech();
      if (recognitionControllerRef.current) {
        recognitionControllerRef.current.abort();
      }
    };
  }, []);

  const handleLanguageChange = (lang: LanguageCode) => {
    stopSpeech();
    setSpeakingMessageId(null);
    setSelectedLang(lang);
    onLanguageChange?.(lang);
  };

  const toggleAutoReadAloud = () => {
    const next = !autoReadAloud;
    setAutoReadAloud(next);
    localStorage.setItem('mediscan_chat_autoread', String(next));
    if (!next) {
      stopSpeech();
      setSpeakingMessageId(null);
    }
  };

  // Text-to-Speech playback for a specific message
  const handleReadMessageAloud = async (messageId: string, text: string) => {
    if (speakingMessageId === messageId) {
      stopSpeech();
      setSpeakingMessageId(null);
      return;
    }

    stopSpeech();
    setSpeakingMessageId(messageId);

    // Clean markdown characters like asterisks, hashes from speech text
    const cleanText = text.replace(/[*_#`[\]()]/g, ' ').replace(/\s+/g, ' ').trim();

    try {
      await speakText({
        text: cleanText,
        langCode: selectedLang,
        rate: 1.0,
        onEnd: () => setSpeakingMessageId(null),
        onError: () => setSpeakingMessageId(null)
      });
    } catch {
      setSpeakingMessageId(null);
    }
  };

  // Speech-to-Text Microphone Recording
  const handleToggleListening = () => {
    if (!isSpeechRecognitionSupported()) {
      setMicNotice(t.voiceMicNotSupported);
      setTimeout(() => setMicNotice(null), 4000);
      return;
    }

    if (isListening) {
      if (recognitionControllerRef.current) {
        recognitionControllerRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    setMicNotice(null);
    setIsListening(true);
    setSpeechRecognizedText('');

    const controller = startListening({
      langCode: selectedLang,
      continuous: false,
      interimResults: true,
      onStart: () => {
        setIsListening(true);
      },
      onResult: (transcript, isFinal) => {
        setInput(transcript);
        setSpeechRecognizedText(transcript);
        if (isFinal) {
          setIsListening(false);
        }
      },
      onError: (err) => {
        setIsListening(false);
        if (err.error === 'not-allowed' || err.error === 'permission-denied') {
          setMicNotice(t.voiceMicDenied);
        } else if (err.error !== 'no-speech') {
          setMicNotice(`Microphone notice: ${err.message || err.error}`);
        }
        setTimeout(() => setMicNotice(null), 5000);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    recognitionControllerRef.current = controller;
  };

  const handleSend = async (queryText?: string) => {
    // If speaking or listening, stop
    if (isListening && recognitionControllerRef.current) {
      recognitionControllerRef.current.stop();
      setIsListening(false);
    }

    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSpeechRecognizedText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          language: selectedLang,
          history: messages.map(m => ({ sender: m.sender, content: m.content })),
          latestAnalysisContext: latestAnalysis ? {
            condition: latestAnalysis.prediction.condition,
            modality: latestAnalysis.modality,
            confidence: latestAnalysis.prediction.confidence,
            riskLevel: latestAnalysis.prediction.riskLevel
          } : undefined
        })
      });

      const data = await res.json();
      const botMsgId = `msg-bot-${Date.now()}`;
      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: 'assistant',
        content: data.text || 'I apologize, I am temporarily unable to respond. Please consult a physician.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergencyAlert: data.isEmergencyAlert
      };

      setMessages(prev => [...prev, botMsg]);

      // If Auto-Read Aloud is enabled, speak response
      if (autoReadAloud && data.text) {
        handleReadMessageAloud(botMsgId, data.text);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          content: 'I encountered an error reaching the medical knowledge service. Please try again or consult your doctor.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];
  const presetQuestions = t.chatPresetQuestions || TRANSLATIONS.en.chatPresetQuestions;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-250">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 sm:px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold flex items-center gap-1.5 text-white">
                {t.chatTitle}
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-[10px] text-slate-400">{t.chatSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-Read Aloud toggle button */}
            <button
              onClick={toggleAutoReadAloud}
              className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                autoReadAloud
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={autoReadAloud ? t.voiceAutoReadOn : t.voiceAutoReadOff}
            >
              {autoReadAloud ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative inline-flex items-center">
              <Globe className="w-3.5 h-3.5 text-cyan-400 absolute left-2 pointer-events-none" />
              <select
                value={selectedLang}
                onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
                className="bg-slate-800 text-white text-[11px] font-semibold pl-6 pr-6 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-500 focus:outline-hidden cursor-pointer appearance-none"
                title="Select language"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                    {l.flag} {l.nativeLabel}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 pointer-events-none" />
            </div>

            {/* Close drawer */}
            <button
              onClick={() => {
                stopSpeech();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Safety pill banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-[11px] leading-tight">{t.emergencyNotice}</span>
          </div>
          <span className="text-[10px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full font-mono shrink-0">
            {currentLangObj.flag} {currentLangObj.label}
          </span>
        </div>

        {/* Scan Context Badge if available */}
        {latestAnalysis && (
          <div className="bg-cyan-50 border-b border-cyan-100 px-4 py-2 text-xs text-cyan-950 flex items-center justify-between">
            <div className="truncate text-[11px]">
              <span className="font-bold text-cyan-800">Scan Context:</span> {latestAnalysis.prediction.condition} ({latestAnalysis.prediction.confidence}%)
            </div>
            <span className="text-[10px] bg-cyan-200/70 text-cyan-900 font-mono px-2 py-0.5 rounded-md font-semibold shrink-0">
              {latestAnalysis.modality}
            </span>
          </div>
        )}

        {/* Microphone Notice / Error if any */}
        {micNotice && (
          <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 text-xs text-rose-800 flex items-center gap-2 animate-in fade-in">
            <MicOff className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{micNotice}</span>
          </div>
        )}

        {/* Active Listening Visualizer Banner */}
        {isListening && (
          <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2.5 flex items-center justify-between shadow-sm animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white animate-ping" />
              <span className="text-xs font-bold">
                {t.voiceListening} ({currentLangObj.nativeLabel})
              </span>
            </div>
            <button
              onClick={handleToggleListening}
              className="text-[11px] font-semibold bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              {t.voiceStopListening}
            </button>
          </div>
        )}

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed space-y-2 relative group ${
                  m.sender === 'user'
                    ? 'bg-cyan-700 text-white rounded-br-xs shadow-xs'
                    : m.isEmergencyAlert
                    ? 'bg-red-50 text-red-950 border-2 border-red-400 rounded-bl-xs shadow-xs'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs shadow-xs'
                }`}
              >
                {m.isEmergencyAlert && (
                  <div className="flex items-center gap-1.5 font-bold text-red-700 text-xs">
                    <AlertCircle className="w-4 h-4" /> {t.chatEmergencyDetected}
                  </div>
                )}
                
                <div className="whitespace-pre-line leading-relaxed">{m.content}</div>

                <div className="flex items-center justify-between pt-1 border-t border-black/5 text-[10px]">
                  {/* Speaker button to read this message aloud */}
                  {m.sender === 'assistant' ? (
                    <button
                      onClick={() => handleReadMessageAloud(m.id, m.content)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                        speakingMessageId === m.id
                          ? 'bg-cyan-600 text-white shadow-xs'
                          : 'text-slate-500 hover:text-cyan-700 hover:bg-slate-200'
                      }`}
                      title={speakingMessageId === m.id ? t.voiceStopReading : t.voiceReadAloud}
                    >
                      {speakingMessageId === m.id ? (
                        <>
                          <Square className="w-3 h-3 fill-current" />
                          <span>Stop audio</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3" />
                          <span>{t.voiceReadAloud}</span>
                        </>
                      )}
                    </button>
                  ) : <div />}

                  <span className={m.sender === 'user' ? 'text-cyan-200' : 'text-slate-400'}>
                    {m.timestamp}
                  </span>
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-400 text-xs py-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce delay-200" />
                <span className="ml-1 text-slate-500">
                  Consulting MediScanAI guidelines in {currentLangObj.label}...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" /> {t.chatSuggestedQuestions}
          </div>
          <div className="flex gap-2 pb-1 overflow-x-auto no-scrollbar">
            {presetQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 hover:border-cyan-500 hover:text-cyan-700 transition-colors shrink-0 cursor-pointer shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar with Voice & Text */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Voice Input Button */}
            <button
              type="button"
              onClick={handleToggleListening}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-600 border-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-cyan-700'
              }`}
              title={isListening ? t.voiceStopListening : t.voiceSpeakQuestion}
            >
              {isListening ? <Mic className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? t.voiceListening : t.chatPlaceholder}
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500 focus:bg-white transition-all"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span>{currentLangObj.flag} {currentLangObj.nativeLabel} mode</span>
            <span>Emergency? Call 911 / 112 immediately</span>
          </div>
        </div>
      </div>
    </div>
  );
};
