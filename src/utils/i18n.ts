export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'zh' | 'ar' | 'pt' | 'kn';

export interface LanguageInfo {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  locale: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', locale: 'en-US', flag: '🇺🇸', dir: 'ltr' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', locale: 'kn-IN', flag: '🇮🇳', dir: 'ltr' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', locale: 'hi-IN', flag: '🇮🇳', dir: 'ltr' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', locale: 'es-ES', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', locale: 'fr-FR', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', locale: 'de-DE', flag: '🇩🇪', dir: 'ltr' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文 (简体)', locale: 'zh-CN', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', locale: 'ar-SA', flag: '🇸🇦', dir: 'rtl' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português', locale: 'pt-BR', flag: '🇧🇷', dir: 'ltr' },
];

export interface TranslationDictionary {
  // Navigation
  navDashboard: string;
  navUpload: string;
  navHistory: string;
  navDoctors: string;
  navDoctorDashboard: string;
  navAdmin: string;
  navLogin: string;
  navLogout: string;
  navLanguage: string;

  // Header & General
  portalPatient: string;
  portalDoctor: string;
  portalAdmin: string;
  medicalChatbot: string;
  emergencyNotice: string;

  // Voice Assistant
  voiceAssistant: string;
  voiceResultTitle: string;
  voiceResultDesc: string;
  voiceListenScan: string;
  voiceListening: string;
  voiceSpeakQuestion: string;
  voiceStopListening: string;
  voicePlaying: string;
  voicePaused: string;
  voiceStopped: string;
  voiceReplay: string;
  voiceSpeed: string;
  voiceNarratingIn: string;
  voiceViewTranscript: string;
  voiceHideTranscript: string;
  voiceAutoRead: string;
  voiceAutoReadOn: string;
  voiceAutoReadOff: string;
  voiceReadAloud: string;
  voiceStopReading: string;
  voiceMicDenied: string;
  voiceMicNotSupported: string;

  // Result View
  resultPreliminaryScreening: string;
  resultDetectedCondition: string;
  resultModelConfidence: string;
  resultModality: string;
  resultAnatomy: string;
  resultModel: string;
  resultVerifiedScan: string;
  resultWhatThisMeans: string;
  resultObservedFeatures: string;
  resultRecommendedNextSteps: string;
  resultWhenToSeekUrgentCare: string;
  resultDownloadReport: string;
  resultViewHeatmap: string;
  resultDoctorVerified: string;
  resultConsultSpecialist: string;

  // Chatbot
  chatTitle: string;
  chatSubtitle: string;
  chatPlaceholder: string;
  chatSuggestedQuestions: string;
  chatEmergencyDetected: string;
  chatPresetQuestions: string[];
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    navDashboard: 'Dashboard',
    navUpload: 'Upload Scan',
    navHistory: 'History & Vault',
    navDoctors: 'Find Radiologist',
    navDoctorDashboard: 'Doctor Review Queue',
    navAdmin: 'Admin Console',
    navLogin: 'Sign In',
    navLogout: 'Log Out',
    navLanguage: 'Language',

    portalPatient: 'Patient Portal',
    portalDoctor: 'Clinical Doctor',
    portalAdmin: 'System Admin',
    medicalChatbot: 'Medical Chatbot',
    emergencyNotice: 'Educational AI only. In emergencies, call 911 immediately.',

    voiceAssistant: 'Voice Assistant',
    voiceResultTitle: 'AI Voice Assistant • Audio Diagnostic Briefing',
    voiceResultDesc: 'Listen to an audible clinical overview of findings, confidence scores, and recommended actions in your preferred language.',
    voiceListenScan: 'Narrate Findings Aloud',
    voiceListening: 'Listening... Speak your medical question clearly',
    voiceSpeakQuestion: 'Speak your question',
    voiceStopListening: 'Stop listening',
    voicePlaying: 'Speaking diagnostic report...',
    voicePaused: 'Audio narration paused',
    voiceStopped: 'Audio stopped',
    voiceReplay: 'Replay Narration',
    voiceSpeed: 'Speed',
    voiceNarratingIn: 'Narrating in',
    voiceViewTranscript: 'Show Audio Transcript',
    voiceHideTranscript: 'Hide Audio Transcript',
    voiceAutoRead: 'Auto-Read Responses',
    voiceAutoReadOn: 'Auto-read aloud enabled',
    voiceAutoReadOff: 'Auto-read aloud disabled',
    voiceReadAloud: 'Read aloud',
    voiceStopReading: 'Stop reading',
    voiceMicDenied: 'Microphone access was denied. Please allow microphone permissions in your browser.',
    voiceMicNotSupported: 'Speech recognition is not supported in this browser. Please type your query.',

    resultPreliminaryScreening: 'Preliminary AI Screening Assessment',
    resultDetectedCondition: 'Primary Detected Condition',
    resultModelConfidence: 'Model Confidence',
    resultModality: 'Modality',
    resultAnatomy: 'Anatomy',
    resultModel: 'Model',
    resultVerifiedScan: 'Verified Medical Diagnostic Scan',
    resultWhatThisMeans: 'What this result means',
    resultObservedFeatures: 'Observed Radiological Features',
    resultRecommendedNextSteps: 'Recommended Clinical Next Steps',
    resultWhenToSeekUrgentCare: 'When to Seek Urgent Medical Care',
    resultDownloadReport: 'Download Report',
    resultViewHeatmap: 'View Heatmap',
    resultDoctorVerified: 'Attending Physician Verification',
    resultConsultSpecialist: 'Consult a Specialist',

    chatTitle: 'MediScan Medical Assistant',
    chatSubtitle: 'Restricted Healthcare & Clinical Screening Guidance',
    chatPlaceholder: 'Ask about scan findings, diseases, or symptoms... (or click microphone to speak)',
    chatSuggestedQuestions: 'Suggested Medical Questions:',
    chatEmergencyDetected: 'EMERGENCY WARNING DETECTED',
    chatPresetQuestions: [
      'What does "alveolar consolidation" on a chest X-ray mean?',
      'What is the difference between benign and malignant brain lesions?',
      'What are the ABCDE rules for checking skin moles?',
      'How do I prepare for a contrast-enhanced CT scan?',
      'When should I visit the Emergency Room for chest symptoms?'
    ]
  },

  es: {
    navDashboard: 'Panel Principal',
    navUpload: 'Subir Imagen',
    navHistory: 'Historial y Bóveda',
    navDoctors: 'Buscar Radiólogo',
    navDoctorDashboard: 'Cola de Médicos',
    navAdmin: 'Consola de Admin',
    navLogin: 'Iniciar Sesión',
    navLogout: 'Cerrar Sesión',
    navLanguage: 'Idioma',

    portalPatient: 'Portal del Paciente',
    portalDoctor: 'Médico Clínico',
    portalAdmin: 'Administrador',
    medicalChatbot: 'Chatbot Médico',
    emergencyNotice: 'IA educativa solamente. En emergencias, llame al 911 o 112 de inmediato.',

    voiceAssistant: 'Asistente de Voz',
    voiceResultTitle: 'Asistente de Voz IA • Resumen Diagnóstico en Audio',
    voiceResultDesc: 'Escuche un resumen clínico detallado de los hallazgos, niveles de confianza y pasos recomendados en su idioma.',
    voiceListenScan: 'Narrar Hallazgos en Audio',
    voiceListening: 'Escuchando... Hable con claridad su pregunta médica',
    voiceSpeakQuestion: 'Hablar pregunta',
    voiceStopListening: 'Detener escucha',
    voicePlaying: 'Narrando informe diagnóstico...',
    voicePaused: 'Narración de audio pausada',
    voiceStopped: 'Audio detenido',
    voiceReplay: 'Repetir Narración',
    voiceSpeed: 'Velocidad',
    voiceNarratingIn: 'Narrando en',
    voiceViewTranscript: 'Ver Transcripción de Audio',
    voiceHideTranscript: 'Ocultar Transcripción',
    voiceAutoRead: 'Lectura Automática',
    voiceAutoReadOn: 'Lectura automática activada',
    voiceAutoReadOff: 'Lectura automática desactivada',
    voiceReadAloud: 'Leer en voz alta',
    voiceStopReading: 'Detener lectura',
    voiceMicDenied: 'Se denegó el acceso al micrófono. Por favor habilite el permiso en su navegador.',
    voiceMicNotSupported: 'El reconocimiento de voz no es compatible con este navegador.',

    resultPreliminaryScreening: 'Evaluación Preliminar de Detección por IA',
    resultDetectedCondition: 'Condición Primaria Detectada',
    resultModelConfidence: 'Confianza del Modelo',
    resultModality: 'Modalidad',
    resultAnatomy: 'Anatomía',
    resultModel: 'Modelo',
    resultVerifiedScan: 'Imagen Diagnóstica Médica Verificada',
    resultWhatThisMeans: 'Qué significa este resultado',
    resultObservedFeatures: 'Características Radiológicas Observadas',
    resultRecommendedNextSteps: 'Pasos Clínicos Recomendados',
    resultWhenToSeekUrgentCare: 'Cuándo Buscar Atención Médica de Urgencia',
    resultDownloadReport: 'Descargar Informe',
    resultViewHeatmap: 'Ver Mapa de Calor',
    resultDoctorVerified: 'Verificación del Médico Tratante',
    resultConsultSpecialist: 'Consultar a un Especialista',

    chatTitle: 'Asistente Médico MediScan',
    chatSubtitle: 'Orientación Clínica y Detección de Salud Restringida',
    chatPlaceholder: 'Pregunte sobre hallazgos, enfermedades o síntomas... (o pulse el micrófono)',
    chatSuggestedQuestions: 'Preguntas Médicas Sugeridas:',
    chatEmergencyDetected: 'ALERTA DE EMERGENCIA DETECTADA',
    chatPresetQuestions: [
      '¿Qué significa "consolidación alveolar" en una radiografía de tórax?',
      '¿Cuál es la diferencia entre lesiones cerebrales benignas y malignas?',
      '¿Cuáles son las reglas ABCDE para revisar lunares en la piel?',
      '¿Cómo me preparo para una tomografía computarizada con contraste?',
      '¿Cuándo debo ir a urgencias por dolor torácico?'
    ]
  },

  fr: {
    navDashboard: 'Tableau de bord',
    navUpload: 'Téléverser Scan',
    navHistory: 'Historique & Coffre',
    navDoctors: 'Trouver Radiologue',
    navDoctorDashboard: 'File des Médecins',
    navAdmin: 'Console Admin',
    navLogin: 'Connexion',
    navLogout: 'Déconnexion',
    navLanguage: 'Langue',

    portalPatient: 'Portail Patient',
    portalDoctor: 'Médecin Praticien',
    portalAdmin: 'Administrateur',
    medicalChatbot: 'Chatbot Médical',
    emergencyNotice: 'IA éducative uniquement. En cas d\'urgence, appelez le 15 ou le 112 immédiatement.',

    voiceAssistant: 'Assistant Vocal',
    voiceResultTitle: 'Assistant Vocal IA • Synthèse Diagnostique Audio',
    voiceResultDesc: 'Écoutez un compte-rendu clinique détaillé des observations, du score de confiance et des démarches recommandées.',
    voiceListenScan: 'Écouter le Rapport Vocal',
    voiceListening: 'À l\'écoute... Posez votre question médicale clairement',
    voiceSpeakQuestion: 'Parler au micro',
    voiceStopListening: 'Arrêter l\'écoute',
    voicePlaying: 'Lecture audio du rapport en cours...',
    voicePaused: 'Narration audio en pause',
    voiceStopped: 'Audio arrêté',
    voiceReplay: 'Réécouter la Narration',
    voiceSpeed: 'Vitesse',
    voiceNarratingIn: 'Lecture en',
    voiceViewTranscript: 'Afficher la Transcription',
    voiceHideTranscript: 'Masquer la Transcription',
    voiceAutoRead: 'Lecture Automatique',
    voiceAutoReadOn: 'Lecture automatique activée',
    voiceAutoReadOff: 'Lecture automatique désactivée',
    voiceReadAloud: 'Lire à voix haute',
    voiceStopReading: 'Arrêter la lecture',
    voiceMicDenied: 'L\'accès au microphone a été refusé dans votre navigateur.',
    voiceMicNotSupported: 'La reconnaissance vocale n\'est pas prise en charge sur ce navigateur.',

    resultPreliminaryScreening: 'Évaluation Préliminaire de Dépistage IA',
    resultDetectedCondition: 'Condition Principale Détectée',
    resultModelConfidence: 'Niveau de Confiance',
    resultModality: 'Modalité',
    resultAnatomy: 'Anatomie',
    resultModel: 'Modèle',
    resultVerifiedScan: 'Image Médicale Diagnostique Validée',
    resultWhatThisMeans: 'Ce que signifie ce résultat',
    resultObservedFeatures: 'Signes Radiologiques Observés',
    resultRecommendedNextSteps: 'Prochaines Étapes Cliniques',
    resultWhenToSeekUrgentCare: 'Quand Consulter en Urgence',
    resultDownloadReport: 'Télécharger le Rapport',
    resultViewHeatmap: 'Voir Carte Thermique',
    resultDoctorVerified: 'Validation par le Médecin Référent',
    resultConsultSpecialist: 'Consulter un Spécialiste',

    chatTitle: 'Assistant Médical MediScan',
    chatSubtitle: 'Conseils et Orientation Clinique Éducative',
    chatPlaceholder: 'Posez une question sur vos résultats ou symptômes... (ou utilisez le micro)',
    chatSuggestedQuestions: 'Questions Médicales Suggérées :',
    chatEmergencyDetected: 'AVERTISSEMENT D\'URGENCE DÉTECTÉ',
    chatPresetQuestions: [
      'Que signifie une "consolidation alvéolaire" sur une radiographie pulmonaire ?',
      'Quelle est la différence entre lésion cérébrale bénigne et maligne ?',
      'Quelles sont les règles ABCDE pour surveiller un grain de beauté ?',
      'Comment se préparer à un scanner avec injection de produit de contraste ?',
      'Quand faut-il se rendre aux urgences pour des douleurs à la poitrine ?'
    ]
  },

  de: {
    navDashboard: 'Übersicht',
    navUpload: 'Scan hochladen',
    navHistory: 'Historie & Tresor',
    navDoctors: 'Radiologen finden',
    navDoctorDashboard: 'Arzt-Prüfung',
    navAdmin: 'Admin-Konsole',
    navLogin: 'Anmelden',
    navLogout: 'Abmelden',
    navLanguage: 'Sprache',

    portalPatient: 'Patientenportal',
    portalDoctor: 'Klinischer Arzt',
    portalAdmin: 'Administrator',
    medicalChatbot: 'Medizinischer Chatbot',
    emergencyNotice: 'Nur zu Bildungszwecken. Im Notfall wählen Sie sofort 112.',

    voiceAssistant: 'Sprachassistent',
    voiceResultTitle: 'KI-Sprachassistent • Akustischer Diagnosebericht',
    voiceResultDesc: 'Hören Sie sich eine verständliche Zusammenfassung der Befunde, Konfidenzwerte und Handlungsempfehlungen an.',
    voiceListenScan: 'Befund laut vorlesen',
    voiceListening: 'Höre zu... Sprechen Sie Ihre medizinische Frage deutlich',
    voiceSpeakQuestion: 'Frage einsprechen',
    voiceStopListening: 'Aufnahme beenden',
    voicePlaying: 'Diagnosebericht wird vorgelesen...',
    voicePaused: 'Audio pausiert',
    voiceStopped: 'Audio gestoppt',
    voiceReplay: 'Erneut abspielen',
    voiceSpeed: 'Geschwindigkeit',
    voiceNarratingIn: 'Sprache der Vorlesung',
    voiceViewTranscript: 'Transkript anzeigen',
    voiceHideTranscript: 'Transkript ausblenden',
    voiceAutoRead: 'Antworten vorlesen',
    voiceAutoReadOn: 'Automatisches Vorlesen an',
    voiceAutoReadOff: 'Automatisches Vorlesen aus',
    voiceReadAloud: 'Vorlesen',
    voiceStopReading: 'Stoppen',
    voiceMicDenied: 'Mikrofonzugriff wurde verweigert. Bitte Berechtigung im Browser erteilen.',
    voiceMicNotSupported: 'Spracherkennung wird in diesem Browser nicht unterstützt.',

    resultPreliminaryScreening: 'Vorläufige KI-Screening-Bewertung',
    resultDetectedCondition: 'Primärer erkannter Befund',
    resultModelConfidence: 'Modell-Konfidenz',
    resultModality: 'Modalität',
    resultAnatomy: 'Anatomie',
    resultModel: 'Modell',
    resultVerifiedScan: 'Verifizierter medizinischer Scan',
    resultWhatThisMeans: 'Bedeutung dieses Ergebnisses',
    resultObservedFeatures: 'Beobachtete radiologische Merkmale',
    resultRecommendedNextSteps: 'Empfohlene nächste Schritte',
    resultWhenToSeekUrgentCare: 'Wann sofort Notaufnahme aufzusuchen ist',
    resultDownloadReport: 'Bericht herunterladen',
    resultViewHeatmap: 'Heatmap ansehen',
    resultDoctorVerified: 'Bestätigung durch Facharzt',
    resultConsultSpecialist: 'Facharzt kontaktieren',

    chatTitle: 'MediScan Medizinischer Assistent',
    chatSubtitle: 'Klinische Screening- und Gesundheitsberatung',
    chatPlaceholder: 'Fragen zu Befunden, Krankheiten oder Symptomen stellen... (oder Mikrofon nutzen)',
    chatSuggestedQuestions: 'Vorgeschlagene medizinische Fragen:',
    chatEmergencyDetected: 'NOTFALL-WARNUNG ERKANNT',
    chatPresetQuestions: [
      'Was bedeutet "alveoläre Konsolidierung" auf einem Thorax-Röntgenbild?',
      'Was ist der Unterschied zwischen gutartigen und bösartigen Hirnläsionen?',
      'Was besagt die ABCDE-Regel zur Hautkrebsvorsorge?',
      'Wie bereite ich mich auf ein Kontrastmittel-CT vor?',
      'Wann sollte ich bei Brustschmerzen die Notaufnahme aufsuchen?'
    ]
  },

  hi: {
    navDashboard: 'डैशबोर्ड',
    navUpload: 'स्कैन अपलोड करें',
    navHistory: 'इतिहास और वॉल्ट',
    navDoctors: 'रेडियोलॉजिस्ट खोजें',
    navDoctorDashboard: 'डॉक्टर समीक्षा कतार',
    navAdmin: 'एडमिन कंसोल',
    navLogin: 'साइन इन',
    navLogout: 'लॉग आउट',
    navLanguage: 'भाषा',

    portalPatient: 'रोगी पोर्टल',
    portalDoctor: 'चिकित्सक डॉक्टर',
    portalAdmin: 'सिस्टम एडमिन',
    medicalChatbot: 'मेडिकल चैटबॉट',
    emergencyNotice: 'केवल शैक्षिक मार्गदर्शन के लिए। आपात स्थिति में तुरंत 112 या 108 पर कॉल करें।',

    voiceAssistant: 'वॉयस असिस्टेंट',
    voiceResultTitle: 'AI वॉयस असिस्टेंट • ऑडियो डायग्नोस्टिक विवरण',
    voiceResultDesc: 'अपनी पसंदीदा भाषा में निष्कर्ष, आत्मविश्वास स्तर और अनुशंसित चरणों का ऑडियो सारांश सुनें।',
    voiceListenScan: 'निष्कर्ष बोलकर सुनाएं',
    voiceListening: 'सुन रहे हैं... कृपया अपना चिकित्सा प्रश्न स्पष्ट बोलें',
    voiceSpeakQuestion: 'बोलकर पूछें',
    voiceStopListening: 'सुनना बंद करें',
    voicePlaying: 'डायग्नोस्टिक रिपोर्ट सुनाई जा रही है...',
    voicePaused: 'ऑडियो रोका गया',
    voiceStopped: 'ऑडियो बंद',
    voiceReplay: 'फिर से सुनें',
    voiceSpeed: 'गति',
    voiceNarratingIn: 'सुनाने की भाषा',
    voiceViewTranscript: 'ऑडियो टेक्स्ट देखें',
    voiceHideTranscript: 'टेक्स्ट छिपाएं',
    voiceAutoRead: 'उत्तर बोलकर सुनाएं',
    voiceAutoReadOn: 'ऑटो-बोलना सक्षम',
    voiceAutoReadOff: 'ऑटो-बोलना अक्षम',
    voiceReadAloud: 'बोलकर सुनाएं',
    voiceStopReading: 'रोकें',
    voiceMicDenied: 'माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।',
    voiceMicNotSupported: 'इस ब्राउज़र में आवाज़ पहचान समर्थित नहीं है।',

    resultPreliminaryScreening: 'प्रारंभिक AI स्क्रीनिंग मूल्यांकन',
    resultDetectedCondition: 'मुख्य पाया गया रोग / स्थिति',
    resultModelConfidence: 'मॉडल आत्मविश्वास',
    resultModality: 'स्कैन का प्रकार',
    resultAnatomy: 'शरीर का अंग',
    resultModel: 'AI मॉडल',
    resultVerifiedScan: 'सत्यापित मेडिकल डायग्नोस्टिक स्कैन',
    resultWhatThisMeans: 'इस परिणाम का क्या अर्थ है',
    resultObservedFeatures: 'देखे गए रेडियोलॉजिकल लक्षण',
    resultRecommendedNextSteps: 'अनुशंसित अगले चिकित्सीय कदम',
    resultWhenToSeekUrgentCare: 'तुरंत आपातकालीन चिकित्सा कब लें',
    resultDownloadReport: 'रिपोर्ट डाउनलोड करें',
    resultViewHeatmap: 'हीटमैप देखें',
    resultDoctorVerified: 'चिकित्सक सत्यापन',
    resultConsultSpecialist: 'विशेषज्ञ से परामर्श लें',

    chatTitle: 'मेडिस्कैन मेडिकल असिस्टेंट',
    chatSubtitle: 'स्वास्थ्य और क्लिनिकल स्क्रीनिंग मार्गदर्शन',
    chatPlaceholder: 'स्कैन निष्कर्षों, रोगों या लक्षणों के बारे में पूछें... (या माइक दबाकर बोलें)',
    chatSuggestedQuestions: 'सुझाए गए चिकित्सा प्रश्न:',
    chatEmergencyDetected: 'आपातकालीन चेतावनी पाई गई',
    chatPresetQuestions: [
      'छाती के एक्स-रे में "एल्वियोलर कंसॉलिडेशन" का क्या अर्थ है?',
      'ब्रेन ट्यूमर में बिनाइन और मैलिग्नेंट में क्या अंतर है?',
      'त्वचा के तिलों की जांच के लिए ABCDE नियम क्या हैं?',
      'कंट्रास्ट सीटी स्कैन की तैयारी कैसे करें?',
      'सीने में दर्द होने पर इमरजेंसी कब जाना चाहिए?'
    ]
  },

  zh: {
    navDashboard: '控制面板',
    navUpload: '上传影像',
    navHistory: '病史与保险库',
    navDoctors: '寻找放射科医生',
    navDoctorDashboard: '医生审核队列',
    navAdmin: '管理控制台',
    navLogin: '登录',
    navLogout: '退出登录',
    navLanguage: '语言',

    portalPatient: '患者门户',
    portalDoctor: '临床主治医师',
    portalAdmin: '系统管理员',
    medicalChatbot: '医疗对话助手',
    emergencyNotice: '仅供健康教育参考。如遇紧急医疗情况，请立即拨打120或911。',

    voiceAssistant: '语音助手',
    voiceResultTitle: 'AI 语音助手 • 影像诊断报告语音解读',
    voiceResultDesc: '使用您习惯的语言，收听放射学观察结果、置信度及临床建议步骤的语音朗读。',
    voiceListenScan: '语音朗读诊断结果',
    voiceListening: '正在聆听... 请清晰陈述您的医疗问题',
    voiceSpeakQuestion: '语音提问',
    voiceStopListening: '停止聆听',
    voicePlaying: '正在为您朗读诊断报告...',
    voicePaused: '语音朗读已暂停',
    voiceStopped: '语音已停止',
    voiceReplay: '重新播放',
    voiceSpeed: '语速',
    voiceNarratingIn: '朗读语言',
    voiceViewTranscript: '查看语音文稿',
    voiceHideTranscript: '隐藏语音文稿',
    voiceAutoRead: '自动语音朗读',
    voiceAutoReadOn: '已开启自动朗读',
    voiceAutoReadOff: '已关闭自动朗读',
    voiceReadAloud: '朗读回答',
    voiceStopReading: '停止朗读',
    voiceMicDenied: '麦克风权限被拒绝，请在浏览器中允许麦克风权限。',
    voiceMicNotSupported: '当前浏览器不支持语音识别，请直接键入问题。',

    resultPreliminaryScreening: '初步 AI 智能影像筛查评估',
    resultDetectedCondition: '主要检测疾病/病征',
    resultModelConfidence: '模型置信度',
    resultModality: '影像类型',
    resultAnatomy: '解剖部位',
    resultModel: '检测模型',
    resultVerifiedScan: '已验证临床医学诊断影像',
    resultWhatThisMeans: '此诊断结果代表什么',
    resultObservedFeatures: '影像学特征与观察表现',
    resultRecommendedNextSteps: '建议的临床后续步骤',
    resultWhenToSeekUrgentCare: '何时应当寻求紧急救治',
    resultDownloadReport: '下载完整报告',
    resultViewHeatmap: '查看热力图 (Grad-CAM)',
    resultDoctorVerified: '主治医师复核签名',
    resultConsultSpecialist: '预约放射科专家',

    chatTitle: 'MediScan 医疗智能助手',
    chatSubtitle: '专业临床辅助与健康筛查指导',
    chatPlaceholder: '输入关于影像学、疾病或症状的疑问...（或点击麦克风说话）',
    chatSuggestedQuestions: '推荐医疗咨询问题：',
    chatEmergencyDetected: '检测到紧急病情预警',
    chatPresetQuestions: [
      '胸部X光片上的“肺泡实变（Alveolar Consolidation）”是什么意思？',
      '脑部良性病变与恶性肿瘤的主要区别是什么？',
      '皮肤黑素瘤自查的 ABCDE 准则是什么？',
      '做增强CT扫描前需要做哪些准备？',
      '出现哪些胸痛症状必须立即去急诊室？'
    ]
  },

  ar: {
    navDashboard: 'لوحة التحكم',
    navUpload: 'رفع الأشعة',
    navHistory: 'السجل والخزينة',
    navDoctors: 'الأطباء المختصون',
    navDoctorDashboard: 'قائمة مراجعة الأطباء',
    navAdmin: 'لوحة الإدارة',
    navLogin: 'تسجيل الدخول',
    navLogout: 'تسجيل الخروج',
    navLanguage: 'اللغة',

    portalPatient: 'بوابة المريض',
    portalDoctor: 'طبيب استشاري',
    portalAdmin: 'مدير النظام',
    medicalChatbot: 'المساعد الطبي الذكي',
    emergencyNotice: 'للإرشاد والتوعية الطبية فقط. في حالات الطوارئ اتصل فوراً بالإسعاف (997 / 112).',

    voiceAssistant: 'المساعد الصوتي',
    voiceResultTitle: 'المساعد الصوتي الذكي • ملخص التشخيص الصوتي',
    voiceResultDesc: 'استمع إلى تقرير صوتي مفصل للنتائج ومستوى الدقة والتوصيات الطبية باللغة التي تختارها.',
    voiceListenScan: 'الاستماع إلى التقرير صوتياً',
    voiceListening: 'جاري الاستماع... تفضل بطرح سؤالك الطبي بوضوح',
    voiceSpeakQuestion: 'تحدث الآن',
    voiceStopListening: 'إيقاف الاستماع',
    voicePlaying: 'جاري قراءة التقرير التشخيصي...',
    voicePaused: 'تم إيقاف القراءة مؤقتاً',
    voiceStopped: 'تم إيقاف الصوت',
    voiceReplay: 'إعادة الاستماع',
    voiceSpeed: 'السرعة',
    voiceNarratingIn: 'لغة القراءة',
    voiceViewTranscript: 'عرض النص الصوتي',
    voiceHideTranscript: 'إخفاء النص الصوتي',
    voiceAutoRead: 'القراءة التلقائية للإجابات',
    voiceAutoReadOn: 'تم تفعيل القراءة التلقائية',
    voiceAutoReadOff: 'تم تعطيل القراءة التلقائية',
    voiceReadAloud: 'قراءة بصوت عالٍ',
    voiceStopReading: 'إيقاف القراءة',
    voiceMicDenied: 'تم رفض إذن الميكروفون. يرجى السماح به من إعدادات المتصفح.',
    voiceMicNotSupported: 'ميزة التعرف على الصوت غير مدعومة في هذا المتصفح.',

    resultPreliminaryScreening: 'التقييم الأولي للذكاء الاصطناعي',
    resultDetectedCondition: 'الحالة المشخصة الرئيسية',
    resultModelConfidence: 'مستوى الثقة بالنموذج',
    resultModality: 'نوع الأشعة',
    resultAnatomy: 'العضو المفحوص',
    resultModel: 'نموذج الذكاء الاصطناعي',
    resultVerifiedScan: 'صورة أشعة طبية تشخيصية موثوقة',
    resultWhatThisMeans: 'ماذا تعني هذه النتيجة',
    resultObservedFeatures: 'الملاحظات الإشعاعية المرصودة',
    resultRecommendedNextSteps: 'الخطوات الطبية الموصى بها',
    resultWhenToSeekUrgentCare: 'متى يجب مراجعة الطوارئ فوراً',
    resultDownloadReport: 'تحميل التقرير',
    resultViewHeatmap: 'عرض الخريطة الحرارية',
    resultDoctorVerified: 'اعتماد الطبيب المعالج',
    resultConsultSpecialist: 'استشارة طبيب مختص',

    chatTitle: 'مساعد MediScan الطبي',
    chatSubtitle: 'إرشاد طبي سريري وتوعوي',
    chatPlaceholder: 'اسأل عن نتائج الأشعة أو الأمراض أو الأعراض... (أو انقر على الميكروفون للتحدث)',
    chatSuggestedQuestions: 'أسئلة طبية مقترحة:',
    chatEmergencyDetected: 'تحذير طوارئ مكتشف',
    chatPresetQuestions: [
      'ماذا يعني "التكثف السنخي" في أشعة الصدر السينية؟',
      'ما الفرق بين الآفات الدماغية الحميدة والخبيثة؟',
      'ما هي قواعد ABCDE لفحص الشامات الجلدية؟',
      'كيف أستعد للفحص بالأشعة المقطعية مع الصبغة؟',
      'متى يجب الذهاب فوراً لقسم الطوارئ عند الشعور بآلام الصدر؟'
    ]
  },

  pt: {
    navDashboard: 'Painel',
    navUpload: 'Enviar Exame',
    navHistory: 'Histórico & Cofre',
    navDoctors: 'Buscar Radiologistas',
    navDoctorDashboard: 'Fila Médica',
    navAdmin: 'Painel de Administração',
    navLogin: 'Entrar',
    navLogout: 'Sair da Conta',
    navLanguage: 'Idioma',

    portalPatient: 'Portal do Paciente',
    portalDoctor: 'Médico Clínico',
    portalAdmin: 'Administrador',
    medicalChatbot: 'Chatbot Médico',
    emergencyNotice: 'Apenas para fins educacionais. Em caso de emergência, ligue 192 imediatamente.',

    voiceAssistant: 'Assistente de Voz',
    voiceResultTitle: 'Assistente de Voz IA • Relatório Diagnóstico em Áudio',
    voiceResultDesc: 'Ouça uma explicação clínica detalhada dos achados, níveis de confiança e orientações no seu idioma preferido.',
    voiceListenScan: 'Ouvir Relatório em Áudio',
    voiceListening: 'Ouvindo... Faça sua pergunta médica com clareza',
    voiceSpeakQuestion: 'Falar pergunta',
    voiceStopListening: 'Parar gravação',
    voicePlaying: 'Narrando relatório diagnóstico...',
    voicePaused: 'Áudio pausado',
    voiceStopped: 'Áudio interrompido',
    voiceReplay: 'Repetir Narração',
    voiceSpeed: 'Velocidade',
    voiceNarratingIn: 'Narrando em',
    voiceViewTranscript: 'Ver Transcrição do Áudio',
    voiceHideTranscript: 'Ocultar Transcrição',
    voiceAutoRead: 'Ler Respostas Automaticamente',
    voiceAutoReadOn: 'Leitura automática ativada',
    voiceAutoReadOff: 'Leitura automática desativada',
    voiceReadAloud: 'Ler em voz alta',
    voiceStopReading: 'Parar leitura',
    voiceMicDenied: 'Acesso ao microfone foi negado. Habilite a permissão no seu navegador.',
    voiceMicNotSupported: 'Reconhecimento de voz não suportado neste navegador.',

    resultPreliminaryScreening: 'Avaliação Preliminar de Triagem por IA',
    resultDetectedCondition: 'Condição Primária Detectada',
    resultModelConfidence: 'Confiança do Modelo',
    resultModality: 'Modalidade',
    resultAnatomy: 'Anatomia',
    resultModel: 'Modelo',
    resultVerifiedScan: 'Exame Diagnóstico Médico Verificado',
    resultWhatThisMeans: 'O que significa este resultado',
    resultObservedFeatures: 'Achados Radiológicos Observados',
    resultRecommendedNextSteps: 'Próximos Passos Clínicos Recomendados',
    resultWhenToSeekUrgentCare: 'Quando Buscar Atendimento de Urgência',
    resultDownloadReport: 'Baixar Relatório',
    resultViewHeatmap: 'Ver Mapa de Calor',
    resultDoctorVerified: 'Verificação do Médico Assistente',
    resultConsultSpecialist: 'Consultar Especialista',

    chatTitle: 'Assistente Médico MediScan',
    chatSubtitle: 'Orientação de Saúde e Triagem Clínica',
    chatPlaceholder: 'Pergunte sobre laudos, doenças ou sintomas... (ou clique no microfone)',
    chatSuggestedQuestions: 'Perguntas Médicas Sugeridas:',
    chatEmergencyDetected: 'ALERTA DE EMERGÊNCIA DETECTADO',
    chatPresetQuestions: [
      'O que significa "consolidação alveolar" no raio-x do tórax?',
      'Qual a diferença entre lesões cerebrais benignas e malignas?',
      'Quais são as regras ABCDE para avaliar manchas na pele?',
      'Como me preparar para uma tomografia com contraste?',
      'Quando devo procurar a emergência por dor no peito?'
    ]
  },
  kn: {
    navDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    navUpload: 'ಸ್ಕ್ಯಾನ್ ಅಪ್ಲೋಡ್',
    navHistory: 'ಇತಿಹಾಸ & ವಾಲ್ಟ್',
    navDoctors: 'ರೇಡಿಯಾಲಜಿಸ್ಟ್ ಹುಡುಕಿ',
    navDoctorDashboard: 'ವೈದ್ಯರ ಪರಿಶೀಲನಾ ಕ್ಯೂ',
    navAdmin: 'ನಿರ್ವಾಹಕ ಕನ್ಸೋಲ್',
    navLogin: 'ಸೈನ್ ಇನ್',
    navLogout: 'ಲಾಗ್ ಔಟ್',
    navLanguage: 'ಭಾಷೆ',

    portalPatient: 'ರೋಗಿಯ ಪೋರ್ಟಲ್',
    portalDoctor: 'ಕ್ಲಿನಿಕಲ್ ವೈದ್ಯರು',
    portalAdmin: 'ಸಿಸ್ಟಮ್ ನಿರ್ವಾಹಕರು',
    medicalChatbot: 'ವೈದ್ಯಕೀಯ ಚಾಟ್‌ಬಾಟ್',
    emergencyNotice: 'ಶೈಕ್ಷಣಿಕ AI ಮಾತ್ರ. ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ತಕ್ಷಣ 112 ಅಥವಾ 108 ಕ್ಕೆ ಕರೆ ಮಾಡಿ.',

    voiceAssistant: 'ಧ್ವನಿ ಸಹಾಯಕ (Voice Assistant)',
    voiceResultTitle: 'AI ಧ್ವನಿ ಸಹಾಯಕ • ಆಡಿಯೋ ರೋಗನಿರ್ಣಯ ವಿವರಣೆ',
    voiceResultDesc: 'ನಿಮ್ಮ ಮೆಚ್ಚಿನ ಭಾಷೆಯಲ್ಲಿ ಕ್ಲಿನಿಕಲ್ ಫಲಿತಾಂಶಗಳು, ನಿಖರತೆಯ ಸ್ಕೋರ್‌ಗಳು ಮತ್ತು ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮಗಳನ್ನು ಆಲಿಸಿ.',
    voiceListenScan: 'ಫಲಿತಾಂಶಗಳನ್ನು ಆಲಿಸಿ',
    voiceListening: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ... ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಪ್ರಶ್ನೆಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ',
    voiceSpeakQuestion: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಮಾತನಾಡಿ',
    voiceStopListening: 'ಮಾತನಾಡುವುದನ್ನು ನಿಲ್ಲಿಸಿ',
    voicePlaying: 'ರೋಗನಿರ್ಣಯ ವರದಿಯನ್ನು ಓದಲಾಗುತ್ತಿದೆ...',
    voicePaused: 'ಆಡಿಯೋ ವಿವರಣೆಯನ್ನು ವಿರಾಮಗೊಳಿಸಲಾಗಿದೆ',
    voiceStopped: 'ಆಡಿಯೋ ನಿಲ್ಲಿಸಲಾಗಿದೆ',
    voiceReplay: 'ಮತ್ತೆ ಆಲಿಸಿ',
    voiceSpeed: 'ವೇಗ',
    voiceNarratingIn: 'ವಿವರಣೆ ಭಾಷೆ',
    voiceViewTranscript: 'ಲಿಖಿತ ಪ್ರತಿ ವೀಕ್ಷಿಸಿ',
    voiceHideTranscript: 'ಲಿಖಿತ ಪ್ರತಿ ಮರೆಮಾಡಿ',
    voiceAutoRead: 'ಉತ್ತರಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಓದಿ',
    voiceAutoReadOn: 'ಸ್ವಯಂ ಧ್ವನಿ ಚಾಲನೆಯಲ್ಲಿದೆ',
    voiceAutoReadOff: 'ಸ್ವಯಂ ಧ್ವನಿ ಆಫ್ ಆಗಿದೆ',
    voiceReadAloud: 'ಗಟ್ಟಿಯಾಗಿ ಓದಿ',
    voiceStopReading: 'ಓದುವುದನ್ನು ನಿಲ್ಲಿಸಿ',
    voiceMicDenied: 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಅನುಮತಿ ನೀಡಿ.',
    voiceMicNotSupported: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ (Voice Recognition) ಬೆಂಬಲಿತವಾಗಿಲ್ಲ.',

    resultPreliminaryScreening: 'ಪ್ರಾಥಮಿಕ AI ಸ್ಕ್ರೀನಿಂಗ್ ಮೌಲ್ಯಮಾಪನ',
    resultDetectedCondition: 'ಪತ್ತೆಯಾದ ಮುಖ್ಯ ಸಮಸ್ಯೆ / ಸ್ಥಿತಿ',
    resultModelConfidence: 'ಮಾದರಿಯ ನಿಖರತೆ',
    resultModality: 'ಸ್ಕ್ಯಾನ್ ಪ್ರಕಾರ',
    resultAnatomy: 'ದೇಹದ ಭಾಗ',
    resultModel: 'AI ಮಾದರಿ',
    resultVerifiedScan: 'ದೃಢೀಕೃತ ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯ ಸ್ಕ್ಯಾನ್',
    resultWhatThisMeans: 'ಈ ಫಲಿತಾಂಶದ ಅರ್ಥವೇನು',
    resultObservedFeatures: 'ಕಂಡುಬಂದ ರೇಡಿಯಾಲಾಜಿಕಲ್ ಲಕ್ಷಣಗಳು',
    resultRecommendedNextSteps: 'ಶಿಫಾರಸು ಮಾಡಲಾದ ಮುಂದಿನ ಹಂತಗಳು',
    resultWhenToSeekUrgentCare: 'ತುರ್ತು ಚಿಕಿತ್ಸೆ ಯಾವಾಗ ಪಡೆಯಬೇಕು',
    resultDownloadReport: 'ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    resultViewHeatmap: 'ಹೀಟ್‌ಮ್ಯಾಪ್ ವೀಕ್ಷಿಸಿ',
    resultDoctorVerified: 'ವೈದ್ಯರ ಪರಿಶೀಲನೆ',
    resultConsultSpecialist: 'ತಜ್ಞ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ',

    chatTitle: 'ಮೆಡಿಸ್ಕ್ಯಾನ್ ವೈದ್ಯಕೀಯ ಸಹಾಯಕ',
    chatSubtitle: 'ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಕ್ಲಿನಿಕಲ್ ಸ್ಕ್ರೀನಿಂಗ್',
    chatPlaceholder: 'ವರದಿಗಳು, ಲಕ್ಷಣಗಳು ಅಥವಾ ಕಾಯಿಲೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ... (ಅಥವಾ ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ)',
    chatSuggestedQuestions: 'ಸೂಚಿಸಲಾದ ವೈದ್ಯಕೀಯ ಪ್ರಶ್ನೆಗಳು:',
    chatEmergencyDetected: 'ತುರ್ತು ಎಚ್ಚರಿಕೆ ಪತ್ತೆಯಾಗಿದೆ',
    chatPresetQuestions: [
      'ಎದೆಯ ಎಕ್ಸ್‌-ರೇಯಲ್ಲಿ "ಕನ್ಸಾಲಿಡೇಶನ್" ಎಂದರೆ ಏನು?',
      'ಮೆದುಳಿನ ಗಡ್ಡೆಗಳಲ್ಲಿ ಹಾನಿಕಾರಕ ಮತ್ತು ಹಾನಿರಹಿತ ನಡುವಿನ ವ್ಯತ್ಯಾಸವೇನು?',
      'ಚರ್ಮದ ಕಲೆಗಳನ್ನು ಪರೀಕ್ಷಿಸಲು ABCDE ನಿಯಮಗಳು ಯಾವುವು?',
      'ಕಾಂಟ್ರಾಸ್ಟ್ ಸಿಟಿ ಸ್ಕ್ಯಾನ್‌ಗೆ ಹೇಗೆ ಸಿದ್ಧರಾಗಬೇಕು?',
      'ಎದೆ ನೋವಿಗೆ ಯಾವಾಗ ತುರ್ತು ಚಿಕಿತ್ಸೆಗೆ ಹೋಗಬೇಕು?'
    ]
  }
};

export function getTranslation(lang?: LanguageCode | string): TranslationDictionary {
  const code = (lang as LanguageCode) || 'en';
  return TRANSLATIONS[code] || TRANSLATIONS.en;
}

/**
 * Generates an articulate, compassionate speech transcript for a Medical Analysis
 * in the patient's selected language.
 */
export function generateAudioReportTranscript(
  analysis: {
    prediction: {
      condition: string;
      confidence: number;
      riskLevel: string;
      whatThisMeans: string;
      findings: string[];
      recommendedNextSteps: string[];
      seekUrgentCareWhen?: string[];
    };
    modality: string;
    bodyPart?: string;
  },
  lang: LanguageCode = 'en'
): string {
  const p = analysis.prediction;

  switch (lang) {
    case 'kn':
      return `ಮೆಡಿಸ್ಕ್ಯಾನ್ AI ರೋಗನಿರ್ಣಯ ಧ್ವನಿ ಸಾರಾಂಶ. ಪತ್ತೆಯಾದ ಮುಖ್ಯ ಸ್ಥಿತಿ: ${p.condition}, ${p.confidence} ಪ್ರತಿಶತ ನಿಖರತೆಯೊಂದಿಗೆ. ಅಪಾಯದ ಹಂತ: ${p.riskLevel}. ಈ ಫಲಿತಾಂಶದ ವಿವರಣೆ: ${p.whatThisMeans}. ಕಂಡುಬಂದ ರೇಡಿಯಾಲಾಜಿಕಲ್ ಲಕ್ಷಣಗಳು: ${p.findings.join('. ')}. ಶಿಫಾರಸು ಮಾಡಿದ ಮುಂದಿನ ಕ್ಲಿನಿಕಲ್ ಹಂತಗಳು: ${p.recommendedNextSteps.join('. ')}. ${p.seekUrgentCareWhen && p.seekUrgentCareWhen.length > 0 ? 'ತುರ್ತು ಎಚ್ಚರಿಕೆ ಸೂಚನೆ: ಈ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದರೆ ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಯ ತುರ್ತು ವಿಭಾಗಕ್ಕೆ ಭೇಟಿ ನೀಡಿ: ' + p.seekUrgentCareWhen.join('. ') : ''} ದಯವಿಟ್ಟು ಗಮನಿಸಿ: ಈ AI ವಿಶ್ಲೇಷಣೆಯು ಕೇವಲ ಪ್ರಾಥಮಿಕ ಸ್ಕ್ರೀನಿಂಗ್ ಮಾರ್ಗದರ್ಶನವಾಗಿದ್ದು, ನಿಮ್ಮ ತಜ್ಞ ವೈದ್ಯರಿಂದ ದೃಢೀಕರಿಸಲ್ಪಡಬೇಕು.`;

    case 'es':
      return `Resumen diagnóstico de MediScanAI. Condición detectada: ${p.condition}, con un nivel de confianza del ${p.confidence} por ciento. Clasificación de riesgo: ${p.riskLevel}. Explicación: ${p.whatThisMeans}. Hallazgos radiológicos observados: ${p.findings.join('. ')}. Pasos clínicos recomendados: ${p.recommendedNextSteps.join('. ')}. ${p.seekUrgentCareWhen && p.seekUrgentCareWhen.length > 0 ? 'Advertencia importante: Busque atención médica urgente inmediata si experimenta: ' + p.seekUrgentCareWhen.join('. ') : ''} Recuerde que este análisis es una ayuda diagnóstica y debe ser verificado por su médico tratante.`;

    case 'fr':
      return `Synthèse diagnostique de MediScanAI. Condition principale détectée : ${p.condition}, avec un taux de confiance de ${p.confidence} pour cent. Niveau de risque : ${p.riskLevel}. Ce que cela signifie : ${p.whatThisMeans}. Signes radiologiques observés : ${p.findings.join('. ')}. Prochaines étapes recommandées : ${p.recommendedNextSteps.join('. ')}. ${p.seekUrgentCareWhen && p.seekUrgentCareWhen.length > 0 ? 'Avertissement : Consultez immédiatement les urgences en cas de : ' + p.seekUrgentCareWhen.join('. ') : ''} Ce rapport préliminaire doit impérativement être validé par un médecin qualifié.`;

    case 'de':
      return `MediScanAI Diagnosebericht. Erkannter Befund: ${p.condition}, mit einer Modell-Konfidenz von ${p.confidence} Prozent. Risikostufe: ${p.riskLevel}. Bedeutung des Ergebnisses: ${p.whatThisMeans}. Beobachtete radiologische Merkmale: ${p.findings.join('. ')}. Empfohlene nächste Schritte: ${p.recommendedNextSteps.join('. ')}. ${p.seekUrgentCareWhen && p.seekUrgentCareWhen.length > 0 ? 'Wichtiger Notfallhinweis: Suchen Sie sofort die Notaufnahme auf bei: ' + p.seekUrgentCareWhen.join('. ') : ''} Bitte beachten Sie: Dieses Screening ersetzt keine ärztliche Untersuchung.`;

    case 'hi':
      return `मेडिस्कैन AI डायग्नोस्टिक सारांश। मुख्य निष्कर्ष: ${p.condition}, ${p.confidence} प्रतिशत आत्मविश्वास के साथ। जोखिम स्तर: ${p.riskLevel}। परिणाम का विवरण: ${p.whatThisMeans}। देखे गए रेडियोलॉजिकल लक्षण: ${p.findings.join(', ')}। अनुशंसित अगले कदम: ${p.recommendedNextSteps.join(', ')}। ${p.seekUrgentCareWhen && p.seekUrgentCareWhen.length > 0 ? 'आपातकालीन चेतावनी: यदि आप इन लक्षणों का अनुभव करते हैं तो तुरंत अस्पताल जाएं: ' + p.seekUrgentCareWhen.join(', ') : ''} कृपया ध्यान दें कि यह AI विश्लेषण केवल स्क्रीनिंग सहायता है और इसे अपने डॉक्टर से सत्यापित करवाएं।`;

    case 'zh':
      return `MediScanAI 智能诊断语音简报。主要检测结果：${p.condition}，模型置信度为百分之 ${p.confidence}。风险等级评估：${p.riskLevel}。结果解读：${p.whatThisMeans}。观察到的影像学特征：${p.findings.join('；')}。建议的临床后续步骤：${p.recommendedNextSteps.join('；')}。${p.seekUrgentCareWhen && p.seekUrgentCareWhen.length > 0 ? '紧急预警提示：如出现以下症状，请务必立即就医：' + p.seekUrgentCareWhen.join('；') : ''} 请注意：此初步筛查结果仅供参考，须由持证主治医师最终确认。`;

    case 'ar':
      return `تقرير التشخيص الصوتي من ميدي سكان. الحالة المشخصة: ${p.condition}، بنسبة ثقة ${p.confidence} بالمائة. مستوى الخطورة: ${p.riskLevel}. تفسير النتيجة: ${p.whatThisMeans}. الملاحظات الإشعاعية المرصودة: ${p.findings.join('، ')}. التوصيات والخطوات القادمة: ${p.recommendedNextSteps.join('، ')}. ${p.seekUrgentCareWhen && p.seekUrgentCareWhen.length > 0 ? 'تنبيه طوارئ عاجل: توجه فوراً إلى أقرب طوارئ عند حدوث: ' + p.seekUrgentCareWhen.join('، ') : ''} يرجى تذكر أن هذه النتيجة استرشادية وتتطلب مراجعة الطبيب المختص.`;

    case 'pt':
      return `Resumo diagnóstico do MediScanAI. Condição detectada: ${p.condition}, com índice de confiança de ${p.confidence} por cento. Nível de risco: ${p.riskLevel}. Significado clínico: ${p.whatThisMeans}. Achados radiológicos observados: ${p.findings.join('. ')}. Próximos passos recomendados: ${p.recommendedNextSteps.join('. ')}. ${p.seekUrgentCareWhen && p.seekUrgentCareWhen.length > 0 ? 'Atenção imediata: Procure atendimento de emergência se houver: ' + p.seekUrgentCareWhen.join('. ') : ''} Lembre-se que esta triagem por IA deve ser confirmada por seu médico assistente.`;

    case 'en':
    default:
      return `MediScanAI Diagnostic Briefing. Primary condition detected: ${p.condition}, evaluated with ${p.confidence} percent model confidence. Risk level: ${p.riskLevel}. Clinical explanation: ${p.whatThisMeans}. Observed radiological features: ${p.findings.join('. ')}. Recommended clinical next steps: ${p.recommendedNextSteps.join('. ')}. ${p.seekUrgentCareWhen && p.seekUrgentCareWhen.length > 0 ? 'Urgent care warning: Seek emergency medical evaluation immediately if you experience: ' + p.seekUrgentCareWhen.join('. ') : ''} Please remember that this AI screening is an educational and diagnostic aid, and must be correlated by your licensed physician.`;
  }
}
