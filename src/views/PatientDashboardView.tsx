import React from 'react';
import {
  Activity,
  ArrowRight,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  FileSearch,
  FileText,
  HeartPulse,
  KeyRound,
  Layers,
  Lock,
  MessageSquare,
  Shield,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  Unlock,
  Upload,
  UserPlus
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { ImageModality, MedicalAnalysis, User } from '../types';

interface Props {
  user: User;
  analyses: MedicalAnalysis[];
  onNavigate: (view: string, analysisId?: string) => void;
  onOpenReport: (analysis: MedicalAnalysis) => void;
  onOpenChatbot: () => void;
  onOpenRegister?: () => void;
  isVaultUnlocked?: boolean;
}

export const PatientDashboardView: React.FC<Props> = ({
  user,
  analyses,
  onNavigate,
  onOpenReport,
  onOpenChatbot,
  onOpenRegister,
  isVaultUnlocked = false
}) => {
  const latestAnalysis = analyses[0];
  const requiresReviewCount = analyses.filter(a => a.prediction.riskLevel !== 'Low Risk / Normal').length;
  const verifiedCount = analyses.filter(a => a.status === 'verified').length;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
              <HeartPulse className="w-3.5 h-3.5" /> MediScanAI Automated Screening Platform
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isVaultUnlocked
                ? 'bg-teal-500/20 border-teal-400/30 text-teal-300'
                : 'bg-amber-500/20 border-amber-400/30 text-amber-300'
            }`}>
              {isVaultUnlocked ? (
                <>
                  <Unlock className="w-3 h-3 text-teal-300" />
                  <span>Vault Unlocked (MRN: {user.medicalRecordNumber || 'MRN-884920'})</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-amber-300" />
                  <span>History Protected (PIN Required)</span>
                </>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user.name}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Upload diagnostic medical images (Chest X-rays, Brain MRIs, Skin Lesions, CT scans) to receive automated 
            deep learning screening results, explainable Grad-CAM heatmaps, and certified physician reviews.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" /> Upload New Medical Scan
            </button>

            <button
              onClick={() => onNavigate('history')}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              {isVaultUnlocked ? <ShieldCheck className="w-4 h-4 text-teal-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
              <span>View Medical History</span>
            </button>

            {onOpenRegister && (
              <button
                onClick={onOpenRegister}
                className="flex items-center gap-2 px-4 py-2.5 bg-cyan-800/80 hover:bg-cyan-700/80 text-white font-semibold text-xs rounded-xl border border-cyan-600/60 transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-cyan-300" /> Register Patient Account
              </button>
            )}

            <button
              onClick={onOpenChatbot}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" /> Ask Health Chatbot
            </button>
          </div>
        </div>
      </div>

      {/* Safety Notice Card */}
      <DisclaimerBanner variant="card" onLearnMore={() => onNavigate('disclaimer')} />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Analyses</span>
            <Activity className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{analyses.length}</div>
          <p className="text-[11px] text-slate-500">Diagnostic records in profile</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Doctor Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">{verifiedCount}</div>
          <p className="text-[11px] text-slate-500">Signed off by radiologist</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Requires Follow-up</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 font-mono">{requiresReviewCount}</div>
          <p className="text-[11px] text-slate-500">Abnormal screening finding</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>AI Average Confidence</span>
            <Brain className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700 font-mono">94.2%</div>
          <p className="text-[11px] text-slate-500">Multi-label ensemble models</p>
        </div>
      </div>

      {/* Latest Analysis Feature Box */}
      {latestAnalysis && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
              <h2 className="text-sm font-bold text-slate-900">Latest AI Screening Finding</h2>
              <span className="text-xs text-slate-500 font-mono">#{latestAnalysis.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                {new Date(latestAnalysis.createdAt).toLocaleDateString()}
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                latestAnalysis.status === 'verified'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {latestAnalysis.status === 'verified' ? 'Doctor Verified' : 'Under Clinical Review'}
              </span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Image Preview with CAM badge */}
            <div className="relative aspect-4/3 bg-slate-950 rounded-xl overflow-hidden group border border-slate-200">
              <img
                src={latestAnalysis.imageUrl}
                alt={latestAnalysis.imageName}
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                <span className="text-[10px] uppercase font-bold text-cyan-400">
                  {latestAnalysis.modality.toUpperCase()} • {latestAnalysis.bodyPart}
                </span>
                <span className="text-xs font-semibold truncate">{latestAnalysis.imageName}</span>
              </div>
            </div>

            {/* Prediction details */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Condition Detected
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-xs font-bold rounded">
                    {latestAnalysis.prediction.riskLevel}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  {latestAnalysis.prediction.condition}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl text-xs">
                <div>
                  <span className="text-slate-500 block">AI Confidence</span>
                  <span className="text-lg font-black text-cyan-700 font-mono">
                    {latestAnalysis.prediction.confidence}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Model Engine</span>
                  <span className="font-semibold text-slate-800 truncate block">
                    {latestAnalysis.modelUsed.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Grad-CAM ROI Focus</span>
                  <span className="font-semibold text-slate-800">
                    {latestAnalysis.prediction.gradCamCoordinates.length} Detected Regions
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                <strong>What this means:</strong> {latestAnalysis.prediction.whatThisMeans}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={() => onNavigate('result', latestAnalysis.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> View Full Diagnostic Result
                </button>

                <button
                  onClick={() => onNavigate('explainable-ai', latestAnalysis.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" /> Explore Grad-CAM Heatmap
                </button>

                <button
                  onClick={() => onOpenReport(latestAnalysis)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" /> Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supported Diagnostic Modalities Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
          <span>Supported Deep Learning Diagnostic Pipelines</span>
          <button
            onClick={() => onNavigate('about')}
            className="text-xs font-semibold text-cyan-700 hover:underline cursor-pointer"
          >
            Model Architecture Specs →
          </button>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-cyan-300 transition-all space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
              CXR
            </div>
            <h4 className="text-xs font-bold text-slate-900">Chest X-ray Model</h4>
            <p className="text-[11px] text-slate-500">
              ChexNet DenseNet-121 detecting Pneumonia, Tuberculosis, Cardiomegaly, Atelectasis & Effusion.
            </p>
            <div className="text-[10px] text-blue-600 font-semibold font-mono">94.8% Accuracy • NIH Dataset</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-cyan-300 transition-all space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
              MRI
            </div>
            <h4 className="text-xs font-bold text-slate-900">Brain MRI Classifier</h4>
            <p className="text-[11px] text-slate-500">
              EfficientNet-B4 classifying Glioma, Meningioma, Pituitary Tumors, and normal intracranial scans.
            </p>
            <div className="text-[10px] text-purple-600 font-semibold font-mono">96.2% Accuracy • BraTS 2023</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-cyan-300 transition-all space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
              DERM
            </div>
            <h4 className="text-xs font-bold text-slate-900">Skin Lesion Vision</h4>
            <p className="text-[11px] text-slate-500">
              MobileNetV3-Large detecting Melanoma, Basal Cell Carcinoma, and benign melanocytic nevi.
            </p>
            <div className="text-[10px] text-amber-600 font-semibold font-mono">93.6% Accuracy • ISIC Archive</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-cyan-300 transition-all space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
              CT
            </div>
            <h4 className="text-xs font-bold text-slate-900">Thoracic CT Analysis</h4>
            <p className="text-[11px] text-slate-500">
              3D-DenseNet volumetric detector for pulmonary nodules, ground-glass opacities, and emphysema.
            </p>
            <div className="text-[10px] text-teal-600 font-semibold font-mono">95.1% Accuracy • LIDC-IDRI</div>
          </div>
        </div>
      </div>

      {/* Analysis History Mini-Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Medical Analysis History</h3>
            <p className="text-xs text-slate-500">Review past scans, AI confidence scores, and specialist review status</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 cursor-pointer"
          >
            Full Archive ({analyses.length}) <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-lg bg-slate-900 shrink-0 overflow-hidden flex items-center justify-center">
                  <img
                    src={analysis.imageUrl}
                    alt={analysis.imageName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate">
                    {analysis.prediction.condition}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span className="uppercase font-semibold text-slate-700">{analysis.modality}</span>
                    <span>•</span>
                    <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="font-mono text-cyan-700 font-semibold">
                      {analysis.prediction.confidence}% conf.
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  analysis.status === 'verified'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {analysis.status === 'verified' ? 'Doctor Verified' : 'Pending Review'}
                </span>

                <button
                  onClick={() => onNavigate('result', analysis.id)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors cursor-pointer"
                >
                  View
                </button>

                <button
                  onClick={() => onOpenReport(analysis)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors cursor-pointer"
                >
                  Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
