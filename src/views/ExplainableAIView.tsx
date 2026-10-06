import React from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Download,
  Eye,
  FileText,
  HelpCircle,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { GradCamViewer } from '../components/GradCamViewer';
import { MedicalAnalysis } from '../types';

interface Props {
  analysis: MedicalAnalysis;
  onNavigate: (view: string, analysisId?: string) => void;
  onOpenReport: (analysis: MedicalAnalysis) => void;
}

export const ExplainableAIView: React.FC<Props> = ({ analysis, onNavigate, onOpenReport }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Navigation header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('result', analysis.id)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Analysis Result
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenReport(analysis)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" /> Clinical Report
          </button>
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-1 bg-cyan-100 text-cyan-800 rounded text-xs font-bold font-mono">
            XAI MODULE
          </span>
          <span className="text-xs text-slate-500">Analysis #{analysis.id}</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">
          Explainable AI (XAI) & Grad-CAM Visualization
        </h1>
        <p className="text-xs text-slate-500 max-w-2xl">
          Visualizing the gradient-weighted class activation mapping (Grad-CAM) to reveal which pixel clusters 
          and anatomical structures drove the convolutional neural network's screening classification.
        </p>
      </div>

      <DisclaimerBanner variant="card" onLearnMore={() => onNavigate('disclaimer')} />

      {/* Main Interactive Grad-CAM Visualizer */}
      <GradCamViewer
        imageUrl={analysis.imageUrl}
        gradCamCoordinates={analysis.prediction.gradCamCoordinates}
        condition={analysis.prediction.condition}
        modality={analysis.modality}
        aiExplanation={analysis.prediction.aiAttentionExplanation}
        initialMode="side-by-side"
      />

      {/* Educational Guide: What is Grad-CAM in Healthcare */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h3 className="text-xs font-bold text-slate-800">Gradient Flow Attribution</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Grad-CAM uses the gradients of any target concept flowing into the final convolutional layer to produce a coarse localization map highlighting important regions.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h3 className="text-xs font-bold text-slate-800">Eliminating "Black-Box" AI</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Rather than a blind percentage, clinicians can visually verify whether the model is focusing on genuine pathological tissue or irrelevant background artifacts.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <h3 className="text-xs font-bold text-slate-800">Screening Assistance Only</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Heatmap peaks must never be interpreted as definitive disease margins or autonomous surgical boundaries without certified radiologist sign-off.
          </p>
        </div>
      </div>
    </div>
  );
};
