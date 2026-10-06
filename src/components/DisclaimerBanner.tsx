import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  variant?: 'banner' | 'compact' | 'card';
  onLearnMore?: () => void;
}

export const DisclaimerBanner: React.FC<Props> = ({ variant = 'banner', onLearnMore }) => {
  if (variant === 'compact') {
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span><strong>Screening Aid:</strong> Not a medical diagnosis. Consult a qualified physician.</span>
        {onLearnMore && (
          <button 
            onClick={onLearnMore} 
            className="ml-auto underline text-amber-700 hover:text-amber-900 font-medium"
          >
            Details
          </button>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              Important Medical Safety & Screening Notice
              <span className="text-[10px] uppercase font-semibold tracking-wider bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                Regulatory Class: Research Prototype
              </span>
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              This AI-generated result is for informational and screening assistance only. It is not a medical diagnosis. 
              Please consult a qualified healthcare professional for diagnosis and treatment decisions. MediScanAI does not prescribe 
              medicines or replace clinical radiological interpretation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-950 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="p-1 bg-amber-200/60 rounded text-amber-800 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </span>
          <span className="font-medium text-amber-900">
            <strong>Clinical Safety Requirement:</strong> This AI-generated result is for informational and screening assistance only. It is not a medical diagnosis. Please consult a qualified healthcare professional for diagnosis and treatment decisions.
          </span>
        </div>
        {onLearnMore && (
          <button
            onClick={onLearnMore}
            className="shrink-0 font-semibold text-amber-800 hover:text-amber-950 underline cursor-pointer"
          >
            Safety Protocols →
          </button>
        )}
      </div>
    </div>
  );
};
