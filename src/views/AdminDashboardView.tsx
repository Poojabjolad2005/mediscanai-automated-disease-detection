import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle2,
  Cpu,
  Database,
  Eye,
  FileCheck,
  FolderHeart,
  Layers,
  Server,
  ShieldAlert,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Users
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { AIModelMeta, MedicalAnalysis, User } from '../types';

interface Props {
  user: User;
  analyses: MedicalAnalysis[];
  onNavigate: (view: string, analysisId?: string) => void;
}

const INITIAL_MODELS: AIModelMeta[] = [
  {
    id: 'chexnet-dense121',
    name: 'ChexNet-DenseNet121',
    architecture: 'DenseNet-121 with Multi-label Sigmoid Heads',
    version: 'v2.4.1',
    dataset: 'NIH ChestX-ray14 (112,120 Frontal Views)',
    targetModality: 'chest_xray',
    supportedConditions: ['Pneumonia', 'Tuberculosis', 'Cardiomegaly', 'Effusion', 'Atelectasis'],
    accuracy: 94.8,
    precision: 93.5,
    recall: 95.2,
    f1Score: 94.3,
    isActive: true,
    lastTrained: '2025-11-20'
  },
  {
    id: 'neuroscan-effb4',
    name: 'NeuroScan EfficientNet-B4',
    architecture: 'EfficientNet-B4 + SE Blocks',
    version: 'v1.9.0',
    dataset: 'BraTS 2023 & Figshare Multi-sequence MRI',
    targetModality: 'brain_mri',
    supportedConditions: ['Glioma', 'Meningioma', 'Pituitary Tumor', 'Intracranial Hemorrhage'],
    accuracy: 96.2,
    precision: 95.8,
    recall: 96.6,
    f1Score: 96.2,
    isActive: true,
    lastTrained: '2026-01-14'
  },
  {
    id: 'dermavision-v3',
    name: 'DermaVision MobileNetV3',
    architecture: 'MobileNetV3-Large with Squeeze-and-Excitation',
    version: 'v3.1.2',
    dataset: 'ISIC Archive (33,000 Dermoscopic Images)',
    targetModality: 'skin_image',
    supportedConditions: ['Melanoma', 'Basal Cell Carcinoma', 'Melanocytic Nevi', 'Keratosis'],
    accuracy: 93.6,
    precision: 92.4,
    recall: 94.8,
    f1Score: 93.5,
    isActive: true,
    lastTrained: '2026-02-02'
  },
  {
    id: 'thoraxct-3d-dense',
    name: 'ThoraxCT 3D-DenseNet',
    architecture: '3D-DenseNet Volumetric Slice Feature Aggregator',
    version: 'v2.0.0',
    dataset: 'LIDC-IDRI (1,018 Volumetric CT Scans)',
    targetModality: 'ct_scan',
    supportedConditions: ['Pulmonary Nodule', 'Ground-Glass Opacity', 'Emphysema', 'Bronchiectasis'],
    accuracy: 95.1,
    precision: 94.2,
    recall: 96.0,
    f1Score: 95.1,
    isActive: true,
    lastTrained: '2025-12-18'
  }
];

export const AdminDashboardView: React.FC<Props> = ({ user, analyses, onNavigate }) => {
  const [models, setModels] = useState<AIModelMeta[]>(INITIAL_MODELS);

  const toggleModel = (id: string) => {
    setModels(prev =>
      prev.map(m => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> System & Model Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            MediScanAI Infrastructure & AI Models
          </h1>
          <p className="text-xs text-slate-300">
            Monitoring multi-modality deep learning models, inference telemetry, doctor validation metrics, and audit logs.
          </p>
        </div>
      </div>

      <DisclaimerBanner variant="compact" onLearnMore={() => onNavigate('disclaimer')} />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Inference Runs</span>
            <Activity className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">1,428</div>
          <p className="text-[11px] text-slate-500">Total lifetime scans processed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Active AI Models</span>
            <Brain className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700 font-mono">
            {models.filter(m => m.isActive).length} / {models.length}
          </div>
          <p className="text-[11px] text-slate-500">Convolutional pipelines live</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Clinical Concordance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">96.8%</div>
          <p className="text-[11px] text-slate-500">Doctor confirmed predictions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Safety Interventions</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 font-mono">100%</div>
          <p className="text-[11px] text-slate-500">Emergency & disclaimer adherence</p>
        </div>
      </div>

      {/* Model Registry Management */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-700" /> Registered Deep Learning Model Engines
            </h2>
            <p className="text-xs text-slate-500">Manage deep learning model weights, benchmark metrics, and production serving state</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map((model) => (
            <div
              key={model.id}
              className={`p-5 rounded-2xl border transition-all ${
                model.isActive
                  ? 'border-slate-200 bg-white shadow-xs'
                  : 'border-slate-200 bg-slate-50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{model.name}</h3>
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                      {model.version}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {model.architecture}
                  </div>
                </div>

                <button
                  onClick={() => toggleModel(model.id)}
                  className="cursor-pointer text-slate-600 hover:text-slate-900"
                  title={model.isActive ? 'Deactivate model' : 'Activate model'}
                >
                  {model.isActive ? (
                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                      <span>Online</span>
                      <ToggleRight className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-slate-400 font-bold text-xs">
                      <span>Offline</span>
                      <ToggleLeft className="w-6 h-6" />
                    </div>
                  )}
                </button>
              </div>

              {/* Benchmarks Grid */}
              <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-xl text-center text-xs font-mono my-3 border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Accuracy</span>
                  <span className="font-bold text-cyan-800">{model.accuracy}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Precision</span>
                  <span className="font-bold text-slate-800">{model.precision}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Recall</span>
                  <span className="font-bold text-slate-800">{model.recall}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">F1-Score</span>
                  <span className="font-bold text-slate-800">{model.f1Score}%</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-[11px] text-slate-600">
                  <strong className="text-slate-800">Training Corpus:</strong> {model.dataset}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {model.supportedConditions.map((cond, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium rounded"
                    >
                      {cond}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Audit Logs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-700" /> Recent Diagnostic System Logs
        </h2>

        <div className="space-y-2 text-xs font-mono">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <span className="text-slate-700">[INFERENCE_COMPLETE] Job #MED-2026-9901 executed via DenseNet-121 (Latency: 284ms)</span>
            <span className="text-slate-400 text-[11px]">Just now</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <span className="text-slate-700">[DOCTOR_VERIFIED] Dr. Elena Vance digitally signed radiograph #MED-2026-9901</span>
            <span className="text-slate-400 text-[11px]">3 hrs ago</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <span className="text-slate-700">[GRAD_CAM_GENERATED] Heatmap tensor synthesized (8 activation peaks detected)</span>
            <span className="text-slate-400 text-[11px]">1 day ago</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <span className="text-slate-700">[SYSTEM_HEALTH] API Gateways and Neural Workers 100% operational</span>
            <span className="text-slate-400 text-[11px]">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};
