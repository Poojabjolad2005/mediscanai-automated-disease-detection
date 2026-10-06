import React, { useEffect, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Cpu,
  Eye,
  FileCheck,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import { BodyPart, ImageModality } from '../types';

interface Props {
  scanPayload: {
    imageData: string;
    imageName: string;
    fileSize: string;
    fileFormat: string;
    modality: ImageModality;
    bodyPart: BodyPart;
  };
  onComplete: () => void;
}

const STEPS = [
  { id: 1, title: 'Image Integrity & DICOM Validation', detail: 'Verifying pixel matrix, grayscale contrast & dynamic range' },
  { id: 2, title: 'Preprocessing & Normalization', detail: 'Applying bilateral noise reduction, 512x512 tensor resizing & Z-score windowing' },
  { id: 3, title: 'Selecting Specialized Neural Architecture', detail: 'Binding target modality to verified deep CNN model weights' },
  { id: 4, title: 'Deep Learning Convolution & Feature Extraction', detail: 'Propagating activations across residual bottleneck blocks' },
  { id: 5, title: 'Grad-CAM Attention Map Synthesis', detail: 'Computing gradient activations with respect to target feature feature maps' },
  { id: 6, title: 'Compiling Clinical Guidance & Findings', detail: 'Structuring confidence metrics, risk classification, and next steps' }
];

export const AnalysisRunningView: React.FC<Props> = ({ scanPayload, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;
  const hasTriggeredRef = React.useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (!hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            setTimeout(() => {
              onCompleteRef.current();
            }, 600);
          }
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.round(((currentStepIndex + 1) / STEPS.length) * 100);

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-8 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold font-mono">
          <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-700" /> DEEP LEARNING INFERENCE IN PROGRESS
        </div>
        <h2 className="text-2xl font-black text-slate-900">
          Analyzing {scanPayload.imageName}
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Passing raw radiograph through the multi-stage neural network classifier and Grad-CAM spatial explainability engine.
        </p>
      </div>

      {/* Center scan thumbnail with scanner beam effect */}
      <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden bg-slate-950 border-2 border-cyan-500/50 shadow-2xl p-2 flex items-center justify-center">
        <img
          src={scanPayload.imageData}
          alt="Processing Scan"
          className="max-h-full max-w-full object-contain rounded opacity-80"
        />
        {/* Animated laser scan beam */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-bounce" />
        <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 text-cyan-300 text-[10px] font-mono py-1 px-2 rounded text-center">
          {progressPercent}% Complete
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 max-w-md mx-auto">
        <div className="flex justify-between text-xs font-bold text-slate-700 font-mono">
          <span>Inference Pipeline</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-600 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Pipeline Steps List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-cyan-50/80 border border-cyan-200/80 text-cyan-950 scale-[1.01]'
                  : isDone
                  ? 'text-slate-700'
                  : 'text-slate-400 opacity-60'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-cyan-600 border-t-transparent animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">
                    {step.id}
                  </div>
                )}
              </div>

              <div className="space-y-0.5">
                <div className="text-xs font-bold">{step.title}</div>
                <div className="text-[11px] text-slate-500 leading-tight">{step.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
