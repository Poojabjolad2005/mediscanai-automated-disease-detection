import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FileCheck,
  HeartPulse,
  KeyRound,
  Lock,
  Phone,
  Shield,
  ShieldCheck,
  User,
  UserCheck,
  UserPlus,
  X
} from 'lucide-react';
import { PatientRegistrationData, User as UserType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (newUser: UserType) => void;
}

export const PatientRegistrationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onRegisterSuccess
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredPatient, setRegisteredPatient] = useState<UserType | null>(null);

  // Form State
  const [formData, setFormData] = useState<PatientRegistrationData>({
    name: '',
    email: '',
    dob: '1992-06-15',
    gender: 'Female',
    phone: '+1 (555) 482-1920',
    bloodType: 'O+',
    allergies: 'None reported',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: 'Spouse',
    accessPin: '1234',
    consentAgreed: true
  });

  const [confirmPin, setConfirmPin] = useState('1234');

  if (!isOpen) return null;

  const handleNext = () => {
    setErrorMessage(null);
    if (step === 1) {
      if (!formData.name.trim()) {
        setErrorMessage('Please enter your full legal name.');
        return;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      if (!formData.dob) {
        setErrorMessage('Please enter your date of birth.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (formData.accessPin.length < 4) {
      setErrorMessage('Please enter a 4-digit security access PIN.');
      return;
    }
    if (formData.accessPin !== confirmPin) {
      setErrorMessage('Security PIN and confirmation do not match.');
      return;
    }
    if (!formData.consentAgreed) {
      setErrorMessage('Please accept the HIPAA health data terms and consent.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: 'patient',
          dob: formData.dob,
          gender: formData.gender,
          phone: formData.phone,
          bloodType: formData.bloodType,
          allergies: formData.allergies,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone: formData.emergencyContactPhone,
          emergencyContactRelationship: formData.emergencyContactRelationship,
          accessPin: formData.accessPin
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register patient');
      }

      setRegisteredPatient(data.user);
      // Notify parent after brief delay or user dismissal
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    if (registeredPatient) {
      onRegisterSuccess(registeredPatient);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-cyan-900 via-cyan-800 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <UserPlus className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Patient Registration & Vault Setup
              </h2>
              <p className="text-xs text-cyan-200 font-medium">
                Create your verified clinical account with protected health records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Card Screen */}
        {registeredPatient ? (
          <div className="p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-teal-100 border border-teal-200 text-teal-700 mx-auto flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
                Registration Confirmed
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                Welcome, {registeredPatient.name}!
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Your medical record account has been established with encrypted history protection.
              </p>
            </div>

            {/* Patient ID Card Mock */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white p-5 rounded-2xl border border-slate-700 text-left shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase">MediScanAI Health Card</p>
                  <p className="text-base font-black text-white mt-0.5">{registeredPatient.name}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{registeredPatient.email}</p>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold">
                  {registeredPatient.medicalRecordNumber}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-700/60 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">DOB</span>
                  <span className="font-semibold text-slate-200">{registeredPatient.dob || '1990-01-01'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Blood Group</span>
                  <span className="font-semibold text-slate-200">{registeredPatient.bloodType || 'O+'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Vault Protection</span>
                  <span className="font-semibold text-teal-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> PIN Locked
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left flex items-start gap-2.5">
              <KeyRound className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-xs text-amber-900">
                <p className="font-bold">Your 4-Digit History Access PIN: <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 ml-1">{formData.accessPin}</span></p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Keep this PIN secure. It will be required each time you access or export your diagnostic imaging archive.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleFinish}
                className="w-full py-3.5 px-4 rounded-2xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Login Page to Sign In</span>
                <CheckCircle2 className="w-4 h-4 text-teal-300" />
              </button>
              <p className="text-[11px] text-slate-500">
                You will be redirected directly to the Login portal to authenticate with your new credentials.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            {/* Steps indicator */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold">
              <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-cyan-700' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${step >= 1 ? 'bg-cyan-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  1
                </span>
                <span>Demographics</span>
              </div>
              <div className="w-8 h-px bg-slate-200" />
              <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-cyan-700' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${step >= 2 ? 'bg-cyan-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  2
                </span>
                <span>Clinical Info</span>
              </div>
              <div className="w-8 h-px bg-slate-200" />
              <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-cyan-700' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${step >= 3 ? 'bg-cyan-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  3
                </span>
                <span>Protection PIN</span>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Scrollable Form Content */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Jonathan Miller"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-cyan-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="patient@example.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-cyan-600 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Date of Birth <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-cyan-600 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-cyan-600 font-medium"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-cyan-600 font-medium"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                      <select
                        value={formData.bloodType}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-cyan-600 font-medium"
                      >
                        <option value="O+">O Positive (O+)</option>
                        <option value="O-">O Negative (O-)</option>
                        <option value="A+">A Positive (A+)</option>
                        <option value="A-">A Negative (A-)</option>
                        <option value="B+">B Positive (B+)</option>
                        <option value="B-">B Negative (B-)</option>
                        <option value="AB+">AB Positive (AB+)</option>
                        <option value="AB-">AB Negative (AB-)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Emergency Contact Relationship</label>
                      <input
                        type="text"
                        value={formData.emergencyContactRelationship}
                        onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                        placeholder="e.g. Spouse, Parent, Sibling"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-cyan-600 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Emergency Contact Name</label>
                    <input
                      type="text"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      placeholder="e.g., Emily Miller"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-cyan-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      placeholder="+1 (555) 999-8888"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-cyan-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Known Drug / Environmental Allergies
                    </label>
                    <input
                      type="text"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      placeholder="e.g. Penicillin, Radiographic Iodine Contrast, Latex"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-cyan-600 font-medium"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3.5 bg-cyan-50 border border-cyan-200 rounded-2xl flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-700 text-white flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-cyan-900 text-xs">Medical Records Vault Protection</h4>
                      <p className="text-[11px] text-cyan-800 mt-0.5 leading-relaxed">
                        To protect your private diagnostic images, radiographs, and physician reports, set a 4-digit security PIN. Only you and authorized clinical personnel can view your history.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        4-Digit Access PIN <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        value={formData.accessPin}
                        onChange={(e) => setFormData({ ...formData, accessPin: e.target.value.replace(/\D/g, '') })}
                        placeholder="••••"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base tracking-widest text-center font-mono font-bold focus:bg-white focus:outline-hidden focus:border-cyan-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Confirm PIN <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base tracking-widest text-center font-mono font-bold focus:bg-white focus:outline-hidden focus:border-cyan-600"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.consentAgreed}
                        onChange={(e) => setFormData({ ...formData, consentAgreed: e.target.checked })}
                        className="mt-0.5 rounded text-cyan-700 focus:ring-cyan-500"
                      />
                      <span className="text-[11px] text-slate-600 leading-relaxed">
                        I authorize MediScanAI to store my diagnostic images within this protected clinical vault. I understand that AI screening does not replace in-person physician examination.
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as any)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Continue to Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Complete Patient Registration</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
