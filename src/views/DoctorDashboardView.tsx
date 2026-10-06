import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Edit3,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Layers,
  Search,
  Send,
  ShieldCheck,
  Stethoscope,
  UserCheck
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { MedicalAnalysis, User } from '../types';

interface Props {
  user: User;
  analyses: MedicalAnalysis[];
  onNavigate: (view: string, analysisId?: string) => void;
  onOpenReport: (analysis: MedicalAnalysis) => void;
  onReviewSubmit: (analysisId: string, reviewData: {
    clinicalNotes: string;
    recommendations: string[];
    confirmedCondition: string;
    signature: string;
  }) => void;
}

export const DoctorDashboardView: React.FC<Props> = ({
  user,
  analyses,
  onNavigate,
  onOpenReport,
  onReviewSubmit
}) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<MedicalAnalysis | null>(
    analyses.find(a => a.status === 'pending_doctor_review') || analyses[0] || null
  );

  const [clinicalNotes, setClinicalNotes] = useState('');
  const [confirmedCondition, setConfirmedCondition] = useState('');
  const [recommendationInput, setRecommendationInput] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([
    'Schedule follow-up contrast-enhanced imaging in 4 weeks',
    'Clinical pulmonary function spirometry assessment',
    'Follow up with attending pulmonologist'
  ]);
  const [signature, setSignature] = useState(`Dr. ${user.name}`);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sync inputs when selected analysis changes
  const handleSelectAnalysis = (analysis: MedicalAnalysis) => {
    setSelectedAnalysis(analysis);
    setConfirmedCondition(analysis.prediction.condition);
    setClinicalNotes(
      analysis.doctorReview?.clinicalNotes ||
      `I have examined the ${analysis.modality.toUpperCase()} image alongside the deep learning Grad-CAM attention maps. Findings correlate with ${analysis.prediction.condition}.`
    );
    if (analysis.doctorReview?.recommendations) {
      setRecommendations(analysis.doctorReview.recommendations);
    }
  };

  const handleAddRec = () => {
    if (!recommendationInput.trim()) return;
    setRecommendations(prev => [...prev, recommendationInput.trim()]);
    setRecommendationInput('');
  };

  const handleRemoveRec = (idx: number) => {
    setRecommendations(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnalysis) return;

    onReviewSubmit(selectedAnalysis.id, {
      clinicalNotes,
      recommendations,
      confirmedCondition: confirmedCondition || selectedAnalysis.prediction.condition,
      signature: signature || `Dr. ${user.name}`
    });

    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const pendingCount = analyses.filter(a => a.status === 'pending_doctor_review').length;
  const verifiedCount = analyses.filter(a => a.status === 'verified').length;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Stethoscope className="w-3.5 h-3.5" /> Doctor & Radiologist Verification Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Clinical Review Workspace
            </h1>
            <p className="text-xs text-slate-300">
              Logged in as <strong>Dr. {user.name}</strong> • Attending Radiologist / Specialist
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Queue</span>
              <span className="text-xl font-black text-amber-400 font-mono">{pendingCount}</span>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified by You</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{verifiedCount}</span>
            </div>
          </div>
        </div>
      </div>

      <DisclaimerBanner variant="compact" onLearnMore={() => onNavigate('disclaimer')} />

      {/* Main Review Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Analysis Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Patient Queue ({analyses.length})</span>
              <span className="text-amber-700 font-mono font-bold text-[11px]">{pendingCount} Pending</span>
            </h3>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {analyses.map((a) => {
                const isSelected = selectedAnalysis?.id === a.id;
                const isPending = a.status === 'pending_doctor_review';

                return (
                  <button
                    key={a.id}
                    onClick={() => handleSelectAnalysis(a)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-600 bg-cyan-50/70 shadow-xs ring-2 ring-cyan-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-12 h-12 rounded-lg bg-slate-950 shrink-0 overflow-hidden flex items-center justify-center p-0.5 border border-slate-200">
                        <img
                          src={a.imageUrl}
                          alt={a.imageName}
                          className="max-h-full max-w-full object-contain rounded"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-slate-500">{a.id}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                            isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isPending ? 'Needs Review' : 'Verified'}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {a.prediction.condition}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center justify-between mt-0.5">
                          <span>{a.patientName}</span>
                          <span className="font-mono text-cyan-700 font-semibold">{a.prediction.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Analysis Review Form (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedAnalysis ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              {/* Top Case Details */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                      {selectedAnalysis.id}
                    </span>
                    <span className="text-xs text-slate-500 uppercase font-bold">
                      {selectedAnalysis.modality} • {selectedAnalysis.bodyPart}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    Reviewing: {selectedAnalysis.patientName}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('explainable-ai', selectedAnalysis.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" /> Inspect Grad-CAM
                  </button>
                  <button
                    onClick={() => onOpenReport(selectedAnalysis)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" /> Preview Report
                  </button>
                </div>
              </div>

              {/* Scan Thumbnail & AI Diagnosis */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="aspect-square bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center p-1 border border-slate-300">
                  <img
                    src={selectedAnalysis.imageUrl}
                    alt="Scan"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold">AI Screening Output:</span>
                    <div className="font-bold text-sm text-slate-900">{selectedAnalysis.prediction.condition}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-cyan-100 text-cyan-800 font-mono font-bold px-2 py-0.5 rounded text-xs">
                      {selectedAnalysis.prediction.confidence}% Confidence
                    </span>
                    <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-xs">
                      {selectedAnalysis.prediction.riskLevel}
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">
                    {selectedAnalysis.prediction.whatThisMeans}
                  </p>
                </div>
              </div>

              {/* Feedback Success Toast */}
              {submitSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Successfully signed and verified clinical report! Status updated to Doctor Verified.
                </div>
              )}

              {/* Review & Sign-off Form */}
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Confirmed Diagnostic Condition / Impression <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={confirmedCondition}
                    onChange={(e) => setConfirmedCondition(e.target.value)}
                    placeholder="Confirm or refine AI diagnostic prediction..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Physician Radiological Findings & Clinical Remarks <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    placeholder="Enter detailed radiological commentary, anatomical findings, or differential diagnosis..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Physician Direct Recommendations for Patient
                  </label>
                  <div className="space-y-2 mb-2">
                    {recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      >
                        <span>• {rec}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRec(idx)}
                          className="text-red-500 hover:text-red-700 font-bold px-1.5 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={recommendationInput}
                      onChange={(e) => setRecommendationInput(e.target.value)}
                      placeholder="Add another clinical recommendation..."
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddRec}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Digital Signature <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-serif italic text-xs font-semibold focus:outline-hidden focus:border-cyan-500"
                      required
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-900/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" /> Sign & Certify Analysis
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
              Select an analysis from the queue on the left to begin reviewing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
