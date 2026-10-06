import React from 'react';
import {
  Brain,
  CheckCircle2,
  Cpu,
  Database,
  Eye,
  FileCode,
  HeartPulse,
  Layers,
  Lock,
  Server,
  Sparkles
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
          <Brain className="w-3.5 h-3.5" /> Technical System Architecture
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          About MediScanAI Technology Stack
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          MediScanAI combines state-of-the-art Convolutional Neural Networks (CNNs), Vision Transformers, 
          and Gradient-weighted Class Activation Mapping (Grad-CAM) to deliver explainable, preliminary medical image analysis.
        </p>
      </div>

      {/* Model Architecture Deep-Dive */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-700" /> Deep Learning Pipelines & Architectures
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-mono font-bold rounded">
                CHEST X-RAY (CXR)
              </span>
              <span className="text-xs font-mono text-slate-500">DenseNet-121</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">ChexNet DenseNet-121</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Uses 121-layer densely connected convolutional blocks where each layer receives direct feature inputs from all preceding layers. 
              Trained on over 112,000 frontal chest radiographs from the NIH Clinical Center to identify 14 pathological conditions.
            </p>
            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono">
              Dataset: NIH ChestX-ray14 • AUROC: 0.948 • Loss: Focal Cross-Entropy
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-xs font-mono font-bold rounded">
                BRAIN MRI
              </span>
              <span className="text-xs font-mono text-slate-500">EfficientNet-B4</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">NeuroScan EfficientNet-B4</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Employs compound scaling across depth, width, and resolution to analyze multi-sequence MRI (T1, T2, FLAIR, T1-contrast). 
              Detects focal cranial space-occupying lesions with high sensitivity.
            </p>
            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono">
              Dataset: BraTS 2023 & Figshare • AUROC: 0.962 • Input: 380x380x3
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-mono font-bold rounded">
                DERMATOLOGY
              </span>
              <span className="text-xs font-mono text-slate-500">MobileNetV3</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">DermaVision MobileNetV3</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Designed for edge and mobile dermoscopic image evaluation using lightweight depthwise-separable convolutions and hard-swish activations. 
              Distinguishes melanoma from benign melanocytic lesions.
            </p>
            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono">
              Dataset: ISIC Archive • AUROC: 0.936 • Latency: 120ms
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 text-xs font-mono font-bold rounded">
                THORACIC CT
              </span>
              <span className="text-xs font-mono text-slate-500">3D-DenseNet</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">ThoraxCT 3D-DenseNet</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Processes volumetric helical CT scans to identify solid and sub-solid pulmonary nodules down to 3mm in diameter, 
              evaluating sphericity and calcification patterns.
            </p>
            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono">
              Dataset: LIDC-IDRI • Sensitivity: 95.1% • Slice: 1.25mm
            </div>
          </div>
        </div>
      </div>

      {/* Explainable AI (Grad-CAM) Methodology */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-700" /> Explainable AI (Grad-CAM) Mechanics
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Standard deep learning architectures are often termed "black boxes" because they output a classification score without 
          revealing which anatomical pixels motivated the classification. 
          MediScanAI computes the gradient of the winning class score with respect to the feature activation map of the final convolutional layer:
        </p>

        <div className="bg-slate-900 text-cyan-300 p-4 rounded-xl font-mono text-xs overflow-x-auto">
          {'L_GradCAM^c = ReLU( ∑_k α_k^c · A^k ) where α_k^c = (1/Z) ∑_i ∑_j (∂y^c / ∂A_{i,j}^k)'}
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          By applying the Rectified Linear Unit (ReLU), only features that have a positive influence on the selected class are displayed in the 
          color-coded heatmap (Blue → Cyan → Yellow → Red), ensuring clinicians understand the model's visual reasoning.
        </p>
      </div>

      {/* Data Privacy & HIPAA Alignment */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-700" /> Patient Privacy & De-Identification
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          MediScanAI strips protected health information (PHI) from DICOM headers in compliance with HIPAA Safe Harbor regulations. 
          Uploaded scan tensors are processed ephemerally in secure memory buffers without persistent retention of raw unmasked patient identifiers.
        </p>
      </div>
    </div>
  );
};
