import React from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  FileText,
  HeartPulse,
  HelpCircle,
  Layers,
  MessageSquare,
  Mic,
  Shield,
  Stethoscope,
  TrendingUp,
  User,
  Volume2
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { VoiceAssistantPlayer } from '../components/VoiceAssistantPlayer';
import { MedicalAnalysis } from '../types';
import { getTranslation, LanguageCode } from '../utils/i18n';

interface Props {
  analysis: MedicalAnalysis;
  onNavigate: (view: string, analysisId?: string) => void;
  onOpenReport: (analysis: MedicalAnalysis) => void;
  onOpenChatbot: () => void;
  currentLanguage?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export const ResultView: React.FC<Props> = ({
  analysis,
  onNavigate,
  onOpenReport,
  onOpenChatbot,
  currentLanguage = 'en',
  onLanguageChange
}) => {
  const t = getTranslation(currentLanguage);

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Low Risk / Normal':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Requires Medical Review':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Elevated / Moderate':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'High Attention / Critical':
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Top navigation back link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenReport(analysis)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> {t.resultDownloadReport}
          </button>
          <button
            onClick={() => onNavigate('explainable-ai', analysis.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" /> {t.resultViewHeatmap}
          </button>
        </div>
      </div>

      {/* Mandatory Safety Notice */}
      <DisclaimerBanner variant="card" onLearnMore={() => onNavigate('disclaimer')} />

      {/* AI Voice Assistant Audio Diagnostic Briefing Widget */}
      <VoiceAssistantPlayer
        analysis={analysis}
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
      />

      {/* Primary Result Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg">
              <HeartPulse className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-wider text-cyan-300">
                {t.resultPreliminaryScreening}
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Analysis #{analysis.id} • {new Date(analysis.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskBadgeColor(analysis.prediction.riskLevel)}`}>
              {analysis.prediction.riskLevel}
            </span>
          </div>
        </div>

        {/* Prediction Main Section */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                {t.resultDetectedCondition}
              </span>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {analysis.prediction.condition}
              </h2>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span>{t.resultModality}: <strong className="uppercase text-slate-800">{analysis.validationInfo?.identifiedModality || analysis.modality}</strong></span>
                <span>•</span>
                <span>{t.resultAnatomy}: <strong className="text-slate-800">{analysis.validationInfo?.identifiedAnatomy || analysis.bodyPart}</strong></span>
                <span>•</span>
                <span>{t.resultModel}: <strong className="text-slate-800">{analysis.modelUsed.name}</strong></span>
              </div>

              {/* Clinical Domain Verification Badge */}
              {analysis.validationInfo && (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {t.resultVerifiedScan}
                  </span>
                  {analysis.validationInfo.viewOrProjection && (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-medium">
                      {analysis.validationInfo.viewOrProjection}
                    </span>
                  )}
                  {analysis.validationInfo.qualityAssessment && (
                    <span className="px-2.5 py-1 bg-cyan-50 text-cyan-800 border border-cyan-200/60 rounded-lg font-medium">
                      Quality: {analysis.validationInfo.qualityAssessment}
                    </span>
                  )}
                </div>
              )}

              {analysis.validationInfo?.modalityMismatchWarning && (
                <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-lg flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  {analysis.validationInfo.modalityMismatchWarning}
                </div>
              )}
            </div>

            {/* Big Confidence Metric */}
            <div className="bg-cyan-50/80 border border-cyan-200/80 px-5 py-3 rounded-2xl text-right shrink-0">
              <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider block">
                {t.resultModelConfidence}
              </span>
              <div className="text-3xl font-black text-cyan-800 font-mono">
                {analysis.prediction.confidence}%
              </div>
              <span className="text-[10px] text-cyan-700 block">Softmax Probability</span>
            </div>
          </div>

          {/* Image & Secondary Probabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Scan Preview & Explainable AI Teaser */}
            <div className="space-y-3">
              <div className="aspect-square bg-slate-950 rounded-xl overflow-hidden relative group border border-slate-200">
                <img
                  src={analysis.imageUrl}
                  alt={analysis.imageName}
                  className="w-full h-full object-contain p-2"
                />
                <button
                  onClick={() => onNavigate('explainable-ai', analysis.id)}
                  className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white p-4 text-center cursor-pointer"
                >
                  <Layers className="w-8 h-8 text-cyan-400" />
                  <span className="text-xs font-bold">Open Interactive Grad-CAM Heatmap</span>
                </button>
              </div>

              <button
                onClick={() => onNavigate('explainable-ai', analysis.id)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Inspect Explainable AI ({analysis.prediction.gradCamCoordinates.length} ROIs)
              </button>
            </div>

            {/* Detailed Findings & Differential Diagnoses */}
            <div className="md:col-span-2 space-y-4 text-xs">
              {/* What this means */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-700" /> {t.resultWhatThisMeans}:
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {analysis.prediction.whatThisMeans}
                </p>
              </div>

              {/* Radiological Findings */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  {t.resultObservedFeatures}
                </h3>
                <div className="space-y-1.5">
                  {analysis.prediction.findings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 bg-white border border-slate-200 p-2.5 rounded-lg"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary Differential Probabilities if present */}
              {analysis.prediction.secondaryConditions && analysis.prediction.secondaryConditions.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Differential Classification Spectrum
                  </h3>
                  <div className="space-y-1.5">
                    {analysis.prediction.secondaryConditions.map((sec, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-medium text-slate-700">{sec.name}</span>
                          <span className="font-mono text-slate-500">{sec.probability}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-400 rounded-full"
                            style={{ width: `${sec.probability}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Guidance Grid: Recommended Next Steps vs Urgent Care */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Recommended Next Steps */}
            <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl space-y-2 text-xs">
              <h3 className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t.resultRecommendedNextSteps}
              </h3>
              <ul className="space-y-1.5 pl-1">
                {analysis.prediction.recommendedNextSteps.map((step, idx) => (
                  <li key={idx} className="text-emerald-950 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* When to Seek Urgent Care */}
            <div className="bg-red-50/70 border border-red-200 p-4 rounded-xl space-y-2 text-xs">
              <h3 className="font-bold text-red-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" /> {t.resultWhenToSeekUrgentCare}
              </h3>
              <ul className="space-y-1.5 pl-1">
                {analysis.prediction.seekUrgentCareWhen.map((warning, idx) => (
                  <li key={idx} className="text-red-950 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Doctor Review Verification Card */}
          {analysis.doctorReview ? (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-5 rounded-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                    {t.resultDoctorVerified}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {analysis.doctorReview.doctorName}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {analysis.doctorReview.doctorSpecialty} • {analysis.doctorReview.hospital}
                  </p>
                </div>
                <div className="px-3 py-1 bg-emerald-200/80 text-emerald-900 font-bold text-xs rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Certified Sign-off
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-emerald-100 text-xs text-slate-800">
                <strong>Physician Notes:</strong> {analysis.doctorReview.clinicalNotes}
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>Signed: {new Date(analysis.doctorReview.reviewedAt).toLocaleString()}</span>
                <span className="font-serif italic text-slate-700">Digital Signature: {analysis.doctorReview.signature}</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-sm font-bold text-slate-900">Need a Professional Second Opinion?</h3>
                <p className="text-xs text-slate-500">
                  Connect with licensed radiologists or discuss your scan with the MediScanAI Voice Assistant.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('doctors')}
                  className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
                >
                  <Stethoscope className="w-3.5 h-3.5 inline mr-1" /> {t.resultConsultSpecialist}
                </button>
                <button
                  onClick={onOpenChatbot}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  <Mic className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Voice Chatbot</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
