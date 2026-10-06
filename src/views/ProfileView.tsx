import React, { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Copy,
  HeartPulse,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Save,
  Shield,
  ShieldCheck,
  User as UserIcon,
  UserPlus,
  LogOut
} from 'lucide-react';
import { User } from '../types';

interface Props {
  user: User;
  onUpdateUser: (updated: Partial<User>) => void;
  onOpenRegister?: () => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<Props> = ({ user, onUpdateUser, onOpenRegister, onLogout }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '+1 (555) 234-8901');
  const [dob, setDob] = useState(user.dob || '1990-04-14');
  const [gender, setGender] = useState(user.gender || 'Female');
  const [bloodType, setBloodType] = useState(user.bloodType || 'A+');
  const [allergies, setAllergies] = useState(user.allergies?.join(', ') || 'Penicillin');
  const [accessPin, setAccessPin] = useState(user.accessPin || '1234');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedMrn, setCopiedMrn] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      email,
      phone,
      dob,
      gender: gender as any,
      bloodType,
      accessPin,
      allergies: allergies.split(',').map(s => s.trim()).filter(Boolean)
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCopyMRN = () => {
    if (user.medicalRecordNumber) {
      navigator.clipboard.writeText(user.medicalRecordNumber);
      setCopiedMrn(true);
      setTimeout(() => setCopiedMrn(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-cyan-700 text-xs font-bold uppercase tracking-wider">
            <UserIcon className="w-4 h-4" /> Account & Patient Demographics
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Patient Profile & Security Credentials
          </h1>
          <p className="text-xs text-slate-500">
            Manage your verified patient demographics, emergency contacts, and history vault access PIN.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenRegister && (
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Patient</span>
            </button>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
              title="Log out of account"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {savedSuccess && (
          <div className="p-3.5 bg-teal-50 border border-teal-300 text-teal-900 text-xs font-bold rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Profile and security credentials successfully updated!</span>
          </div>
        )}

        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-700 to-teal-600 text-white text-2xl font-black flex items-center justify-center border border-cyan-800 shadow-md">
              {name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">{name}</h2>
              <p className="text-xs text-slate-500">{email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200 uppercase">
                  Role: {user.role}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Identity Verified
                </span>
              </div>
            </div>
          </div>

          {/* MRN Badge */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between sm:justify-end gap-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Medical Record No.</span>
              <span className="text-sm font-black font-mono text-cyan-900">{user.medicalRecordNumber || 'MRN-884920'}</span>
            </div>
            <button
              onClick={handleCopyMRN}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Copy MRN"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-cyan-600 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-cyan-600 font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-cyan-600 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-cyan-600 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Biological Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-cyan-600 font-medium"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
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
              <label className="block font-bold text-slate-700 mb-1">Known Allergies / Sensitivities</label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Penicillin, Latex, Contrast Dye"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-cyan-600 font-medium"
              />
            </div>
          </div>

          {/* Medical Records Security PIN Section */}
          <div className="p-4 bg-cyan-50/70 border border-cyan-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-cyan-900 font-bold">
              <KeyRound className="w-4 h-4 text-cyan-700" />
              <span>Medical Analysis History Protection PIN</span>
            </div>
            <p className="text-[11px] text-cyan-800 leading-relaxed">
              This 4-digit PIN is required to unlock and access your stored diagnostic scan history, radiology reports, and Grad-CAM neural attention overlays.
            </p>
            <div className="max-w-xs pt-1">
              <label className="block font-bold text-slate-700 mb-1">4-Digit Access PIN</label>
              <input
                type="password"
                maxLength={4}
                value={accessPin}
                onChange={(e) => setAccessPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-center font-mono text-base tracking-widest font-black focus:outline-hidden focus:border-cyan-600"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            {onLogout ? (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Log Out of Account</span>
              </button>
            ) : <div />}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Profile & Security Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
