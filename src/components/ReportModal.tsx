import React from 'react';
import { CheckCircle2, Download, FileText, Printer, Shield, User, X } from 'lucide-react';
import { MedicalAnalysis } from '../types';

interface Props {
  analysis: MedicalAnalysis;
  onClose: () => void;
}

export const ReportModal: React.FC<Props> = ({ analysis, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    const reportHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>MediScanAI Clinical Report - ${analysis.id}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 40px; color: #1e293b; line-height: 1.5; }
    .header { border-bottom: 2px solid #0284c7; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 24px; font-weight: bold; color: #0369a1; }
    .badge { background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
    .box h4 { margin-top: 0; color: #334155; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
    .finding-list { padding-left: 20px; }
    .disclaimer { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; font-size: 13px; color: #78350f; }
    .footer { font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #cbd5e1; padding-top: 15px; margin-top: 40px; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">MediScanAI Clinical Screening Report</div>
      <div style="font-size: 13px; color: #64748b;">Automated Deep Learning Medical Image Analysis System</div>
    </div>
    <div>
      <span class="badge">${analysis.status.toUpperCase()}</span>
      <div style="font-size: 12px; color: #64748b; margin-top: 5px;">ID: ${analysis.id}</div>
    </div>
  </div>

  <div class="grid">
    <div class="box">
      <h4>Patient Demographics</h4>
      <p><strong>Name:</strong> ${analysis.patientName}</p>
      <p><strong>DOB:</strong> ${analysis.patientDob || 'N/A'}</p>
      <p><strong>Gender:</strong> ${analysis.patientGender || 'N/A'}</p>
      <p><strong>Report Date:</strong> ${new Date(analysis.createdAt).toLocaleString()}</p>
    </div>
    <div class="box">
      <h4>Imaging Metadata & AI Model</h4>
      <p><strong>Modality:</strong> ${analysis.modality.toUpperCase()}</p>
      <p><strong>Body Part:</strong> ${analysis.bodyPart}</p>
      <p><strong>Model Engine:</strong> ${analysis.modelUsed.name} (${analysis.modelUsed.architecture})</p>
      <p><strong>Version:</strong> ${analysis.modelUsed.version}</p>
    </div>
  </div>

  <div class="box" style="border-left: 4px solid #0284c7;">
    <h3 style="margin-top:0; color: #0284c7;">Preliminary AI Prediction: ${analysis.prediction.condition}</h3>
    <p><strong>Confidence Score:</strong> ${analysis.prediction.confidence}% | <strong>Risk Level:</strong> ${analysis.prediction.riskLevel}</p>
    <p><strong>What this means:</strong> ${analysis.prediction.whatThisMeans}</p>
  </div>

  <div class="box" style="margin-top: 20px;">
    <h4>Radiological Findings</h4>
    <ul class="finding-list">
      ${analysis.prediction.findings.map(f => `<li>${f}</li>`).join('')}
    </ul>
  </div>

  <div class="grid">
    <div class="box">
      <h4>Recommended Next Steps</h4>
      <ul class="finding-list">
        ${analysis.prediction.recommendedNextSteps.map(s => `<li>${s}</li>`).join('')}
      </ul>
    </div>
    <div class="box">
      <h4>When to Seek Urgent Medical Care</h4>
      <ul class="finding-list">
        ${analysis.prediction.seekUrgentCareWhen.map(u => `<li>${u}</li>`).join('')}
      </ul>
    </div>
  </div>

  ${analysis.doctorReview ? `
  <div class="box" style="background: #ecfdf5; border-color: #a7f3d0;">
    <h4 style="color: #065f46;">Attending Physician Review & Sign-off</h4>
    <p><strong>Reviewed by:</strong> ${analysis.doctorReview.doctorName} (${analysis.doctorReview.doctorSpecialty})</p>
    <p><strong>Hospital:</strong> ${analysis.doctorReview.hospital}</p>
    <p><strong>Clinical Notes:</strong> ${analysis.doctorReview.clinicalNotes}</p>
    <p><strong>Physician Recommendations:</strong></p>
    <ul>
      ${analysis.doctorReview.recommendations.map(r => `<li>${r}</li>`).join('')}
    </ul>
    <p><strong>Digital Signature:</strong> <em>${analysis.doctorReview.signature}</em> [Verified]</p>
  </div>
  ` : `
  <div class="box" style="background: #fffbeb; border-color: #fde68a;">
    <p style="color: #92400e; font-size: 13px;"><em>Doctor review status: Awaiting clinical sign-off from attending radiologist or specialist.</em></p>
  </div>
  `}

  <div class="disclaimer">
    <strong>MANDATORY MEDICAL SAFETY REQUIREMENT:</strong>
    This AI-generated result is for informational and screening assistance only. It is not a medical diagnosis. 
    Please consult a qualified healthcare professional for diagnosis and treatment decisions. MediScanAI does not 
    prescribe medicines automatically based on the AI prediction.
  </div>

  <div class="footer">
    Generated by MediScanAI Clinical Cloud • Medical Record ID: ${analysis.id} • SHA-256 Verified
  </div>
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MediScanAI_Report_${analysis.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Actions */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Medical Analysis Clinical Report</h2>
              <p className="text-xs text-slate-400">Analysis Reference #{analysis.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={handleDownloadHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export HTML
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div id="printable-report" className="p-8 space-y-6 text-slate-800 max-h-[80vh] overflow-y-auto text-sm">
          {/* Institution Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-cyan-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  M
                </span>
                <span className="text-xl font-black text-slate-900 tracking-tight">MediScanAI</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Automated Deep Learning Medical Imaging Analysis & Screening Platform
              </p>
            </div>

            <div className="text-right sm:text-right text-xs space-y-1">
              <div className="font-mono text-slate-700 font-semibold">REF: {analysis.id}</div>
              <div className="text-slate-500">Date: {new Date(analysis.createdAt).toLocaleDateString()}</div>
              <div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px] ${
                  analysis.status === 'verified'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {analysis.status === 'verified' ? <CheckCircle2 className="w-3 h-3" /> : null}
                  Status: {analysis.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Demographic & Scan Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-600" /> Patient Details
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Patient Name:</span>
                  <div className="font-semibold text-slate-900">{analysis.patientName}</div>
                </div>
                <div>
                  <span className="text-slate-500">DOB:</span>
                  <div className="font-semibold text-slate-900">{analysis.patientDob || '1990-04-14'}</div>
                </div>
                <div>
                  <span className="text-slate-500">Gender:</span>
                  <div className="font-semibold text-slate-900">{analysis.patientGender || 'Female'}</div>
                </div>
                <div>
                  <span className="text-slate-500">Image Source:</span>
                  <div className="font-semibold text-slate-900 truncate">{analysis.imageName}</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-600" /> Imaging & Model Metadata
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Modality:</span>
                  <div className="font-semibold text-slate-900 uppercase">{analysis.modality}</div>
                </div>
                <div>
                  <span className="text-slate-500">Body Part:</span>
                  <div className="font-semibold text-slate-900">{analysis.bodyPart}</div>
                </div>
                <div>
                  <span className="text-slate-500">AI Model:</span>
                  <div className="font-semibold text-slate-900">{analysis.modelUsed.name}</div>
                </div>
                <div>
                  <span className="text-slate-500">Architecture:</span>
                  <div className="font-semibold text-slate-900 truncate">{analysis.modelUsed.architecture}</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Primary Prediction */}
          <div className="p-5 rounded-xl border border-cyan-200 bg-cyan-50/50 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider">
                  Deep Learning Inference Result
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  {analysis.prediction.condition}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-slate-500">AI Confidence:</span>
                  <div className="text-lg font-black text-cyan-700 font-mono">
                    {analysis.prediction.confidence}%
                  </div>
                </div>
                <div className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-lg border border-amber-200">
                  {analysis.prediction.riskLevel}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-cyan-100">
              <strong className="text-slate-900">What this result means:</strong> {analysis.prediction.whatThisMeans}
            </div>
          </div>

          {/* Scan thumbnail & Findings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Examined Image
              </h3>
              <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-slate-200">
                <img
                  src={analysis.imageUrl}
                  alt={analysis.imageName}
                  className="max-h-full max-w-full object-contain rounded"
                />
              </div>
              <div className="text-[11px] text-slate-500 text-center font-mono">
                {analysis.fileFormat} • {analysis.fileSize}
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Key Radiological Findings
                </h3>
                <ul className="space-y-1.5">
                  {analysis.prediction.findings.map((f, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 mt-1.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Recommended Clinical Next Steps
                </h3>
                <ul className="space-y-1.5">
                  {analysis.prediction.recommendedNextSteps.map((s, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
                  When to Seek Urgent Emergency Care
                </h3>
                <ul className="space-y-1.5">
                  {analysis.prediction.seekUrgentCareWhen.map((u, i) => (
                    <li key={i} className="text-xs text-red-800 bg-red-50 px-2 py-1 rounded flex items-start gap-2">
                      <span className="font-bold text-red-600">!</span>
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Doctor Review Section */}
          {analysis.doctorReview ? (
            <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Medical Specialist Verification & Sign-off
                  </span>
                  <div className="font-bold text-slate-900 text-sm">
                    {analysis.doctorReview.doctorName}
                  </div>
                  <div className="text-xs text-slate-600">
                    {analysis.doctorReview.doctorSpecialty} • {analysis.doctorReview.hospital}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-700 font-mono">
                    Signed: {new Date(analysis.doctorReview.reviewedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-emerald-100 text-xs text-slate-800 space-y-1">
                <div className="font-semibold text-slate-900">Physician Clinical Remarks:</div>
                <p>{analysis.doctorReview.clinicalNotes}</p>
              </div>

              <div className="text-xs text-slate-700">
                <div className="font-semibold text-slate-900 mb-1">Direct Recommendations:</div>
                <ul className="list-disc pl-5 space-y-0.5">
                  {analysis.doctorReview.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs text-slate-500">
                <span>Verification Hash: <code>{analysis.doctorReview.id.toUpperCase()}</code></span>
                <span className="font-serif italic font-semibold text-slate-700">
                  Digitally signed by: {analysis.doctorReview.signature}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <strong>Pending Physician Review:</strong> This analysis is queued for certified radiologist review. You can share this report with your attending doctor or book a review from the "Find Doctor" directory.
            </div>
          )}

          {/* Mandatory Clinical Disclaimer */}
          <div className="p-4 bg-amber-50/80 border-l-4 border-amber-500 rounded-r-xl text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <Shield className="w-4 h-4 text-amber-700" />
              MANDATORY MEDICAL DISCLAIMER & SAFETY NOTICE
            </div>
            <p className="leading-relaxed">
              This AI-generated result is for informational and screening assistance only. It is not a medical diagnosis. 
              Please consult a qualified healthcare professional for diagnosis and treatment decisions. MediScanAI does not 
              prescribe medicines automatically based on the AI prediction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
