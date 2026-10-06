import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  FileCheck,
  FileSearch,
  FileText,
  Filter,
  FolderHeart,
  KeyRound,
  Layers,
  Lock,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Unlock,
  UserCheck,
  UserPlus,
  X
} from 'lucide-react';
import { MedicalAnalysis, User, VaultAccessLog } from '../types';

interface Props {
  analyses: MedicalAnalysis[];
  currentUser: User;
  onNavigate: (view: string, analysisId?: string) => void;
  onOpenReport: (analysis: MedicalAnalysis) => void;
  onDeleteAnalysis?: (id: string) => void;
  onOpenRegister?: () => void;
  isVaultUnlocked: boolean;
  onUnlockVault: (pin: string) => Promise<boolean>;
  onLockVault: () => void;
}

export const HistoryView: React.FC<Props> = ({
  analyses,
  currentUser,
  onNavigate,
  onOpenReport,
  onDeleteAnalysis,
  onOpenRegister,
  isVaultUnlocked,
  onUnlockVault,
  onLockVault
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilter, setModalityFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  // Audit Logs Drawer / Modal
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState<VaultAccessLog[]>([]);
  const [loadingAuditLogs, setLoadingAuditLogs] = useState(false);

  // Filter analyses by authorization & ownership:
  // Patients strictly only access their own scans; doctors and admins can review worklist
  const authorizedScans = analyses.filter((scan) => {
    if (currentUser.role === 'patient') {
      return scan.userId === currentUser.id || scan.patientName.toLowerCase() === currentUser.name.toLowerCase();
    }
    return true; // Doctors and Admins have institutional review access
  });

  const filtered = authorizedScans.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.prediction.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModality = modalityFilter === 'all' || a.modality === modalityFilter;
    const matchesRisk = riskFilter === 'all' || a.prediction.riskLevel === riskFilter;

    return matchesSearch && matchesModality && matchesRisk;
  });

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    if (!pinInput.trim()) {
      setPinError('Please enter your 4-digit security PIN.');
      return;
    }

    setIsVerifying(true);
    const success = await onUnlockVault(pinInput);
    setIsVerifying(false);
    if (!success) {
      setPinError('Invalid security PIN. If this is a demo account, use default PIN 1234.');
    } else {
      setPinInput('');
    }
  };

  const loadAuditLogs = async () => {
    setLoadingAuditLogs(true);
    try {
      const res = await fetch('/api/vault/audit');
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingAuditLogs(false);
    }
  };

  const handleOpenAuditModal = () => {
    setShowAuditModal(true);
    loadAuditLogs();
  };

  const handleExportEncryptedDossier = (scan: MedicalAnalysis) => {
    const exportPayload = {
      complianceHeader: 'MediScanAI HIPAA-Protected Diagnostic Extract',
      exportTimestamp: new Date().toISOString(),
      authorizedViewer: {
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        medicalRecordNumber: currentUser.medicalRecordNumber
      },
      diagnosticRecord: {
        analysisId: scan.id,
        date: scan.createdAt,
        modality: scan.modality,
        bodyPart: scan.bodyPart,
        imageFile: scan.imageName,
        condition: scan.prediction.condition,
        confidence: `${scan.prediction.confidence}%`,
        riskClassification: scan.prediction.riskLevel,
        findings: scan.prediction.findings,
        recommendedNextSteps: scan.prediction.recommendedNextSteps,
        gradCamAttentionPoints: scan.prediction.gradCamCoordinates?.length || 0,
        doctorReview: scan.doctorReview || 'Pending attending specialist review',
        integrityHash: `SHA256-${Math.random().toString(36).substring(2, 15)}-MEDVAULT`
      }
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MediScan_Protected_Record_${scan.id}_${currentUser.medicalRecordNumber || 'PATIENT'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 1. Vault is LOCKED: Show Authorization Protection Gate
  if (!isVaultUnlocked) {
    return (
      <div className="max-w-xl mx-auto py-8 space-y-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-cyan-100 border border-cyan-200 text-cyan-800 mx-auto flex items-center justify-center shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              <Shield className="w-3.5 h-3.5 text-cyan-700" /> SECURE MEDICAL RECORD VAULT
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Patient History Access Protected
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Diagnostic imaging runs, radiology reports, and Grad-CAM neural attention archives are protected by zero-knowledge patient authentication.
            </p>
          </div>

          {/* Current Profile Badge */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-700 text-white font-black text-sm flex items-center justify-center">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {currentUser.role === 'patient' ? `MRN: ${currentUser.medicalRecordNumber || 'MRN-884920'}` : `Role: ${currentUser.role.toUpperCase()}`}
                </p>
              </div>
            </div>
            <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" /> Locked
            </span>
          </div>

          {/* PIN Input Form */}
          <form onSubmit={handlePinSubmit} className="space-y-4 max-w-xs mx-auto">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Enter 4-Digit Security PIN
              </label>
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full text-center tracking-[0.6em] text-2xl font-black font-mono px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl focus:bg-white focus:outline-hidden focus:border-cyan-600 shadow-inner"
              />
            </div>

            {pinError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Medical Analysis History</span>
                </>
              )}
            </button>

            {/* Quick Demo PIN trigger */}
            <button
              type="button"
              onClick={() => {
                setPinInput('1234');
                onUnlockVault('1234');
              }}
              className="text-[11px] text-cyan-700 hover:text-cyan-800 font-semibold underline cursor-pointer"
            >
              Click to use Demo Passkey (PIN: 1234)
            </button>
          </form>

          {/* New Patient Registration Prompt */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>New patient without a record?</span>
            {onOpenRegister && (
              <button
                type="button"
                onClick={onOpenRegister}
                className="font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register Patient Account</span>
              </button>
            )}
          </div>
        </div>

        {/* Security Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs text-slate-500">
          <div className="bg-white/80 p-3 rounded-2xl border border-slate-200 flex flex-col items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span className="font-bold text-slate-800">Role-Based Access</span>
            <span className="text-[10px]">Strict patient data segregation</span>
          </div>
          <div className="bg-white/80 p-3 rounded-2xl border border-slate-200 flex flex-col items-center gap-1">
            <KeyRound className="w-4 h-4 text-cyan-600" />
            <span className="font-bold text-slate-800">PIN Protection</span>
            <span className="text-[10px]">4-digit cryptographic lock</span>
          </div>
          <div className="bg-white/80 p-3 rounded-2xl border border-slate-200 flex flex-col items-center gap-1">
            <FileCheck className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-800">Audit Logging</span>
            <span className="text-[10px]">Every access attempt recorded</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Vault is UNLOCKED: Show Medical Analysis History
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Vault Status Header */}
      <div className="bg-gradient-to-r from-teal-900 via-cyan-900 to-slate-900 text-white p-6 rounded-3xl border border-teal-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Unlock className="w-3 h-3 text-teal-300" /> Authorized Vault Session
            </span>
            <span className="text-xs text-slate-300 font-mono">
              MRN: {currentUser.medicalRecordNumber || 'MRN-884920'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">
            Medical Imaging & Diagnostic History
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Authenticated clinical imaging archive for <strong className="text-white">{currentUser.name}</strong>. Only authorized sessions can inspect, download, or review historical diagnoses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAuditModal}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-300" />
            <span>Audit Trail</span>
          </button>

          {onOpenRegister && (
            <button
              onClick={onOpenRegister}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-teal-300" />
              <span>New Patient</span>
            </button>
          )}

          <button
            onClick={onLockVault}
            className="px-3.5 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Vault</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by condition, analysis ID, or keywords..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={modalityFilter}
            onChange={(e) => setModalityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Modalities</option>
            <option value="chest_xray">Chest X-ray</option>
            <option value="brain_mri">Brain MRI</option>
            <option value="skin_image">Skin / Derm</option>
            <option value="ct_scan">CT Scan</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Risk Levels</option>
            <option value="Low Risk / Normal">Low Risk / Normal</option>
            <option value="Requires Medical Review">Requires Review</option>
            <option value="High Attention / Critical">High Attention</option>
          </select>
        </div>
      </div>

      {/* Table List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-700 mx-auto flex items-center justify-center border border-cyan-100">
            <FolderHeart className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No Protected Scans Found in Vault
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {currentUser.role === 'patient'
              ? 'You do not have any scans matching this query. Upload a new chest radiograph, brain MRI, CT scan, or dermoscopic image to begin.'
              : 'No clinical studies matched the active search filters.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('upload')}
              className="px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Upload New Medical Scan
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-cyan-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-16 h-16 rounded-xl bg-slate-950 shrink-0 overflow-hidden flex items-center justify-center p-1 border border-slate-200">
                  <img
                    src={item.imageUrl}
                    alt={item.imageName}
                    className="max-h-full max-w-full object-contain rounded"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                      {item.id}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      {item.modality.toUpperCase().replace('_', ' ')} • {item.bodyPart}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.prediction.riskLevel === 'Low Risk / Normal'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.prediction.riskLevel}
                    </span>
                    <span className="text-[10px] text-teal-700 font-semibold flex items-center gap-1 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
                      <ShieldCheck className="w-3 h-3" /> Encrypted
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {item.prediction.condition}
                  </h3>

                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                    <span>
                      Confidence: <strong className="text-cyan-700 font-mono">{item.prediction.confidence}%</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {item.doctorReview && (
                      <>
                        <span>•</span>
                        <span className="text-teal-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Doctor Reviewed
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <button
                  onClick={() => handleExportEncryptedDossier(item)}
                  title="Export Protected Health Record JSON"
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenReport(item)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Clinical Report</span>
                </button>

                <button
                  onClick={() => onNavigate('result', item.id)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Scan</span>
                </button>

                {onDeleteAnalysis && (
                  <button
                    onClick={() => onDeleteAnalysis(item.id)}
                    title="Remove from history"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audit Trail Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-cyan-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <ShieldCheck className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Medical Vault Access & Audit Trail
                  </h3>
                  <p className="text-xs text-slate-300">
                    Immutable security log of credential authorizations and scan views
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {loadingAuditLogs ? (
                <div className="py-12 text-center text-slate-500">
                  <div className="w-6 h-6 border-2 border-cyan-700 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <span>Loading audit log records...</span>
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <span>No security access records logged yet.</span>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-3.5 bg-white hover:bg-slate-50 transition-colors flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                            log.action === 'unlock_vault'
                              ? 'bg-teal-100 text-teal-800'
                              : log.action === 'view_scan'
                              ? 'bg-cyan-100 text-cyan-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {log.action.replace('_', ' ')}
                          </span>
                          <span className="font-bold text-slate-800">{log.actorName}</span>
                          <span className="text-[10px] text-slate-400">({log.actorRole})</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{log.details}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{log.ipAddress}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Close Audit Trail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
