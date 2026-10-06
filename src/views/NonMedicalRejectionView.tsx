import React from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileUp,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  XCircle
} from 'lucide-react';
import { NonMedicalRejection } from '../types';

interface Props {
  rejection: NonMedicalRejection;
  onTrySample: (sampleKey: 'chest_xray' | 'brain_mri' | 'ct_scan' | 'skin_image') => void;
  onUploadAgain: () => void;
  onNavigate: (view: string) => void;
}

const VERIFIED_SAMPLES = [
  {
    key: 'chest_xray' as const,
    title: 'Chest Radiograph (CXR)',
    type: 'Radiology / Pulmonology',
    desc: 'Frontal PA radiograph showing middle lobe alveolar consolidation.',
    img: '/samples/chest_xray_sample.jpg'
  },
  {
    key: 'brain_mri' as const,
    title: 'Cranial Brain MRI',
    type: 'Neuro-imaging',
    desc: 'Axial contrast-enhanced T1 brain scan showing extra-axial mass.',
    img: '/samples/brain_mri_sample.jpg'
  },
  {
    key: 'ct_scan' as const,
    title: 'Thoracic CT Slice',
    type: 'Computed Tomography',
    desc: 'High-resolution axial lung window with solitary pulmonary nodule.',
    img: '/samples/ct_scan_sample.jpg'
  },
  {
    key: 'skin_image' as const,
    title: 'Dermoscopic Skin Exam',
    type: 'Dermatology',
    desc: 'Polarized dermoscopy examining asymmetrical pigment network.',
    img: '/samples/dermoscopy_sample.jpg'
  }
];

export const NonMedicalRejectionView: React.FC<Props> = ({
  rejection,
  onTrySample,
  onUploadAgain,
  onNavigate
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onUploadAgain}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Upload
        </button>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          Safety Guardrail Active
        </span>
      </div>

      {/* Main Rejection Card */}
      <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white px-6 py-5 flex items-center gap-3.5">
          <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-xs shrink-0">
            <XCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-100 block">
              Domain Boundary Enforcement
            </span>
            <h1 className="text-lg md:text-xl font-black text-white">
              Medical Image Verification Failed: Non-Medical Image Detected
            </h1>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Image Preview with overlay */}
            <div className="md:col-span-4 space-y-2">
              <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden relative border border-slate-200 flex items-center justify-center">
                {rejection.imageUrl ? (
                  <img
                    src={rejection.imageUrl}
                    alt={rejection.imageName}
                    className="w-full h-full object-contain p-2 opacity-85"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-slate-600" />
                )}
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-red-600/90 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider rounded-md shadow-xs">
                  Non-Medical
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-mono text-center truncate">
                {rejection.imageName}
              </p>
            </div>

            {/* Explanation & Detection Details */}
            <div className="md:col-span-8 space-y-4">
              <div className="bg-red-50/80 border border-red-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-red-900 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  Reason for Rejection
                </div>
                <p className="text-xs md:text-sm text-red-900 font-medium leading-relaxed">
                  {rejection.rejectionReason}
                </p>
              </div>

              {/* Detected Subject */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Automated Content Classification
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    Detected Content:
                  </span>
                  <span className="px-2.5 py-0.5 bg-slate-200 text-slate-800 rounded-full text-xs font-semibold">
                    {rejection.detectedSubject || 'Everyday object / Non-clinical photography'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  MediScanAI uses neural network classifiers strictly trained for diagnostic radiology (X-rays, CT scans, MRIs) and dermoscopic pathology. Applying medical models to non-medical photographs produces invalid hallucinations. To ensure medical safety and diagnosis integrity, the analysis was halted.
                </p>
              </div>

              {/* Guidance on what is acceptable */}
              <div className="bg-cyan-50/60 border border-cyan-200 p-4 rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-cyan-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-cyan-700" />
                  What images are supported?
                </span>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <strong>Radiographs (X-rays)</strong>: Chest, bones/joints, dental, abdomen.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <strong>Magnetic Resonance Imaging (MRI)</strong>: Cranial/Brain, spine, musculo-skeletal.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <strong>Computed Tomography (CT Scans)</strong>: Thoracic, abdominal, cranial axial slices.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <strong>Dermoscopy / Skin Lesions</strong>: High-resolution clinical dermatological exams.
                  </li>
                </ul>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onUploadAgain}
                  className="flex items-center gap-2 px-4 py-2.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <FileUp className="w-4 h-4" />
                  Upload a Medical Diagnostic Image
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 shadow-xs transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* Test with Verified Medical Samples */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                  Try a Verified Medical Diagnostic Sample
                </h3>
                <p className="text-xs text-slate-500">
                  Select any authentic medical scan below to test MediScanAI's automated disease detection and Grad-CAM heatmap visualization:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {VERIFIED_SAMPLES.map((sample) => (
                <div
                  key={sample.key}
                  onClick={() => onTrySample(sample.key)}
                  className="group bg-slate-50 hover:bg-cyan-50/50 border border-slate-200 hover:border-cyan-300 rounded-xl p-3 text-left transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-200">
                      <img
                        src={sample.img}
                        alt={sample.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider block">
                        {sample.type}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-cyan-900">
                        {sample.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-tight line-clamp-2 mt-1">
                        {sample.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-cyan-700 group-hover:text-cyan-800">
                    <span>Analyze Sample</span>
                    <span className="text-xs">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
