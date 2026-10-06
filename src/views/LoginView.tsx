import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  User,
  UserCheck,
  UserPlus
} from 'lucide-react';
import { User as UserType } from '../types';

interface RegistrationNotice {
  name: string;
  email: string;
  medicalRecordNumber?: string;
  accessPin?: string;
}

interface Props {
  onLoginSuccess: (user: UserType, options?: { autoUnlockVault?: boolean }) => void;
  onOpenRegister: () => void;
  registrationNotice?: RegistrationNotice | null;
  logoutNotice?: string | null;
  onDismissNotices?: () => void;
}

export const LoginView: React.FC<Props> = ({
  onLoginSuccess,
  onOpenRegister,
  registrationNotice,
  logoutNotice,
  onDismissNotices
}) => {
  const [activeTab, setActiveTab] = useState<'patient' | 'staff'>('patient');
  const [identifier, setIdentifier] = useState(registrationNotice?.email || registrationNotice?.medicalRecordNumber || 'sarah@mediscan.ai');
  const [pin, setPin] = useState(registrationNotice?.accessPin || '1234');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update identifier and pin if registration notice changes
  useEffect(() => {
    if (registrationNotice) {
      setIdentifier(registrationNotice.email || registrationNotice.medicalRecordNumber || '');
      if (registrationNotice.accessPin) {
        setPin(registrationNotice.accessPin);
      }
      setActiveTab('patient');
    }
  }, [registrationNotice]);

  const handleLogin = async (e?: React.FormEvent, directUser?: UserType, directPin?: string) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (directUser) {
        onLoginSuccess(directUser, { autoUnlockVault: true });
        return;
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: identifier.trim(),
          medicalRecordNumber: identifier.trim(),
          pin: pin.trim(),
          role: activeTab === 'staff' ? 'doctor' : 'patient'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check credentials.');
      }

      onLoginSuccess(data.user, { autoUnlockVault: Boolean(pin && pin === data.user.accessPin) });
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to authenticate. Please verify your details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick preset login helper
  const handleQuickLogin = async (role: 'patient' | 'doctor' | 'admin', customEmail?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customEmail,
          role,
          pin: '1234'
        })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onLoginSuccess(data.user, { autoUnlockVault: true });
      } else {
        throw new Error(data.error || 'Quick login failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 animate-in fade-in duration-300">
      {/* Registration Notification Banner */}
      {registrationNotice && (
        <div className="bg-teal-900/90 text-white border border-teal-500/40 rounded-3xl p-6 shadow-xl relative overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400/20 to-transparent pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-200 text-[11px] font-bold uppercase tracking-wider mb-1">
                  <UserCheck className="w-3.5 h-3.5" /> Registration Successful
                </div>
                <h2 className="text-xl font-black text-white">
                  Welcome, {registrationNotice.name}!
                </h2>
                <p className="text-xs text-teal-100/90 mt-0.5 leading-relaxed">
                  Your patient account has been created. Your official Medical Record Number is{' '}
                  <span className="font-mono font-black text-white bg-teal-800/80 px-2 py-0.5 rounded border border-teal-400/40">
                    {registrationNotice.medicalRecordNumber || 'MRN-PENDING'}
                  </span>
                  . Please log in below to open your patient portal.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleLogin()}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-teal-400 hover:bg-teal-300 text-teal-950 font-black text-xs transition-all shadow-lg cursor-pointer shrink-0"
            >
              <span>Sign In as {registrationNotice.name.split(' ')[0]}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Logout Notice Banner */}
      {logoutNotice && !registrationNotice && (
        <div className="bg-slate-900 text-slate-200 border border-slate-700 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-cyan-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Logged Out Securely</p>
              <p className="text-[11px] text-slate-400">{logoutNotice}</p>
            </div>
          </div>
          {onDismissNotices && (
            <button
              onClick={onDismissNotices}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded cursor-pointer"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Login Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white relative">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <HeartPulse className="w-4 h-4" /> MediScanAI Portal Access
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Sign In to Patient & Clinical Portal
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Access AI-assisted radiological screenings, Grad-CAM attention overlays, and verified physician reviews.
            </p>

            {/* Portal Tab Switcher */}
            <div className="grid grid-cols-2 gap-2 mt-6 p-1 bg-slate-800/80 rounded-2xl border border-slate-700/60">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('patient');
                  if (!registrationNotice) {
                    setIdentifier('sarah@mediscan.ai');
                  }
                  setPin('1234');
                  setErrorMessage(null);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'patient'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Patient Portal</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('staff');
                  setIdentifier('dr.vance@mediscan.ai');
                  setPin('1234');
                  setErrorMessage(null);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'staff'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Doctor / Staff</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 space-y-5">
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {activeTab === 'patient'
                    ? 'Patient Email or Medical Record Number (MRN)'
                    : 'Staff / Clinical Email'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      activeTab === 'patient'
                        ? 'e.g. sarah@mediscan.ai or MRN-884920'
                        : 'e.g. dr.vance@mediscan.ai'
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:border-cyan-600 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    4-Digit Security Access PIN
                  </label>
                  <span className="text-[10px] text-slate-400">Default demo PIN: 1234</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold tracking-widest text-slate-800 focus:bg-white focus:outline-hidden focus:border-cyan-600 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-600 border-slate-300 focus:ring-cyan-500"
                  />
                  <span>Keep vault unlocked during session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In to {activeTab === 'patient' ? 'Patient Portal' : 'Clinical Portal'}</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">Need a verified patient profile?</span>
              <button
                onClick={onOpenRegister}
                className="flex items-center gap-1.5 font-bold text-cyan-700 hover:text-cyan-800 hover:underline cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register as New Patient</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Demo Switcher & Security Assurances */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Demo Access Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5" /> Rapid Authentication
              </div>
              <h3 className="text-base font-black text-slate-900 mt-1">
                Demo Accounts & Quick Access
              </h3>
              <p className="text-xs text-slate-500">
                Instantly switch into clinical or patient personas for evaluation:
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Registered user card if available in localstorage */}
              {registrationNotice && (
                <button
                  type="button"
                  onClick={() => handleLogin()}
                  className="w-full p-3 rounded-2xl border-2 border-teal-500 bg-teal-50/60 hover:bg-teal-50 text-left transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                      {registrationNotice.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-black text-teal-950 flex items-center gap-1.5">
                        <span>{registrationNotice.name}</span>
                        <span className="px-1.5 py-0.2 bg-teal-200 text-teal-900 text-[9px] font-bold rounded">New</span>
                      </div>
                      <div className="text-[11px] text-teal-700 font-mono">
                        {registrationNotice.medicalRecordNumber || registrationNotice.email}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                    Sign In <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              )}

              {/* Patient Demo */}
              <button
                type="button"
                onClick={() => handleQuickLogin('patient', 'sarah@mediscan.ai')}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-cyan-400 hover:bg-slate-50 text-left transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    P
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Sarah Jenkins</div>
                    <div className="text-[11px] text-slate-400 font-mono">Patient • MRN-884920</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-cyan-700">Select</span>
              </button>

              {/* Doctor Demo */}
              <button
                type="button"
                onClick={() => handleQuickLogin('doctor', 'dr.vance@mediscan.ai')}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-cyan-400 hover:bg-slate-50 text-left transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    Dr
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Dr. Elena Vance, MD</div>
                    <div className="text-[11px] text-slate-400">Thoracic Radiologist</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-cyan-700">Select</span>
              </button>

              {/* Admin Demo */}
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin@mediscan.ai')}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:border-cyan-400 hover:bg-slate-50 text-left transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                    A
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Dr. Marcus Chen</div>
                    <div className="text-[11px] text-slate-400">Chief Medical Administrator</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-cyan-700">Select</span>
              </button>
            </div>
          </div>

          {/* Security & Compliance Highlights */}
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-700" />
              <span>Protected Health Information (PHI) Security</span>
            </h4>
            <ul className="space-y-2 text-slate-600 text-[11px] leading-relaxed">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>Encrypted medical vault secured by 4-digit verification PIN and end-to-end TLS.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>Full immutable audit logging of radiological scan retrievals and report exports.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>Strict role segregation prevents unauthorized cross-patient record access.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
