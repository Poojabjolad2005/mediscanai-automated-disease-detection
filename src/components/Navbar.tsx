import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Bell,
  ChevronDown,
  FileSearch,
  FolderHeart,
  Globe,
  HeartPulse,
  HelpCircle,
  Info,
  LogOut,
  MessageSquare,
  ShieldCheck,
  Stethoscope,
  Upload,
  User,
  UserPlus,
  Users
} from 'lucide-react';
import { User as UserType, UserRole } from '../types';
import { getTranslation, LanguageCode, SUPPORTED_LANGUAGES } from '../utils/i18n';

interface Props {
  currentUser: UserType;
  currentView: string;
  onNavigate: (view: string) => void;
  onSwitchRole: (role: UserRole) => void;
  onOpenChatbot: () => void;
  onOpenRegister?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  pendingReviewsCount?: number;
  isVaultUnlocked?: boolean;
  currentLanguage?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export const Navbar: React.FC<Props> = ({
  currentUser,
  currentView,
  onNavigate,
  onSwitchRole,
  onOpenChatbot,
  onOpenRegister,
  onLogout,
  isAuthenticated = true,
  pendingReviewsCount = 1,
  isVaultUnlocked = false,
  currentLanguage = 'en',
  onLanguageChange
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = getTranslation(currentLanguage);
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const navItems = [
    ...(currentUser.role === 'patient'
      ? [
          { id: 'dashboard', label: 'Patient Dashboard', icon: Activity },
          { id: 'upload', label: 'Upload & Scan', icon: Upload, highlight: true },
          { id: 'history', label: 'My Analyses', icon: FolderHeart },
          { id: 'doctors', label: 'Find a Doctor', icon: Stethoscope }
        ]
      : []),
    ...(currentUser.role === 'doctor'
      ? [
          { id: 'doctor-dashboard', label: 'Doctor Review Hub', icon: Stethoscope, badge: pendingReviewsCount },
          { id: 'upload', label: 'Clinical Ingestion', icon: Upload },
          { id: 'history', label: 'Radiology Scans', icon: FolderHeart },
          { id: 'doctors', label: 'Colleagues Directory', icon: Users }
        ]
      : []),
    ...(currentUser.role === 'admin'
      ? [
          { id: 'admin-dashboard', label: 'System Admin', icon: ShieldCheck },
          { id: 'upload', label: 'Diagnostic Testing', icon: Upload },
          { id: 'history', label: 'Audit Logs', icon: FolderHeart },
          { id: 'doctors', label: 'Doctor Network', icon: Users }
        ]
      : []),
    { id: 'about', label: 'About Models', icon: Info },
    { id: 'disclaimer', label: 'Safety & Disclaimer', icon: AlertCircle }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate(currentUser.role === 'doctor' ? 'doctor-dashboard' : currentUser.role === 'admin' ? 'admin-dashboard' : 'dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-700 to-teal-500 text-white flex items-center justify-center shadow-md shadow-cyan-900/10 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-slate-900 tracking-tight">MediScan<span className="text-cyan-700">AI</span></span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200 uppercase">
                    v2.4
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-none hidden sm:block">
                  Automated Disease Detection Platform
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-800 font-bold border border-cyan-200/80 shadow-xs'
                      : item.highlight
                      ? 'text-cyan-700 hover:bg-cyan-50/70 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-500 text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* If not authenticated, show direct Sign In button */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                {onOpenRegister && (
                  <button
                    onClick={onOpenRegister}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-cyan-700" />
                    <span>Register</span>
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Register Patient Button */}
                {onOpenRegister && (
                  <button
                    onClick={onOpenRegister}
                    className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    title="Register New Patient Account"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-cyan-200" />
                    <span>Register</span>
                  </button>
                )}

                {/* Global Language Selector Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold cursor-pointer text-slate-700"
                    title="Change Platform Language"
                  >
                    <Globe className="w-3.5 h-3.5 text-cyan-700" />
                    <span className="hidden sm:inline">{currentLangObj.flag} {currentLangObj.nativeLabel}</span>
                    <span className="sm:hidden">{currentLangObj.flag}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {langDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Select Language
                        </span>
                      </div>
                      <div className="space-y-0.5 max-h-64 overflow-y-auto">
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              onLanguageChange?.(lang.code);
                              setLangDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                              currentLanguage === lang.code
                                ? 'bg-cyan-50 text-cyan-900 font-bold border border-cyan-200/60'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-base leading-none">{lang.flag}</span>
                              <span className="font-semibold text-xs">{lang.nativeLabel}</span>
                            </span>
                            <span className="text-[10px] text-slate-400">{lang.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Chatbot Launcher Button */}
                <button
                  onClick={onOpenChatbot}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 hover:from-teal-500/20 hover:to-cyan-500/20 text-cyan-900 border border-cyan-200/80 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  title="Medical Chatbot Assistant"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-700" />
                  <span className="hidden sm:inline">AI Chat</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </button>

                {/* Role Switcher Pill */}
                <div className="relative">
                  <button
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-xs cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center">
                      {currentUser.role === 'patient' ? 'P' : currentUser.role === 'doctor' ? 'Dr' : 'A'}
                    </div>
                    <div className="text-left hidden lg:block">
                      <div className="text-[11px] font-bold text-slate-800 leading-tight">
                        {currentUser.name.split(',')[0]}
                      </div>
                      <div className="text-[9px] uppercase font-bold text-cyan-700 tracking-wider flex items-center gap-1">
                        <span>Role: {currentUser.role}</span>
                        {currentUser.role === 'patient' && (
                          <span className={`w-1.5 h-1.5 rounded-full ${isVaultUnlocked ? 'bg-teal-500' : 'bg-amber-500'}`} />
                        )}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {roleDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          User Profile & Role
                        </span>
                        {onOpenRegister && (
                          <button
                            onClick={() => {
                              setRoleDropdownOpen(false);
                              onOpenRegister();
                            }}
                            className="text-[10px] font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 cursor-pointer"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>Register</span>
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          onSwitchRole('patient');
                          setRoleDropdownOpen(false);
                          onNavigate('dashboard');
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                          currentUser.role === 'patient' ? 'bg-cyan-50 text-cyan-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                          P
                        </div>
                        <div>
                          <div className="font-semibold">Patient Mode</div>
                          <div className="text-[10px] text-slate-400">{currentUser.role === 'patient' ? currentUser.name : 'Sarah Jenkins (Upload & Scans)'}</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          onSwitchRole('doctor');
                          setRoleDropdownOpen(false);
                          onNavigate('doctor-dashboard');
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                          currentUser.role === 'doctor' ? 'bg-cyan-50 text-cyan-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                          Dr
                        </div>
                        <div>
                          <div className="font-semibold">Doctor / Radiologist Mode</div>
                          <div className="text-[10px] text-slate-400">Dr. Elena Vance, MD (Review & Sign)</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          onSwitchRole('admin');
                          setRoleDropdownOpen(false);
                          onNavigate('admin-dashboard');
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                          currentUser.role === 'admin' ? 'bg-cyan-50 text-cyan-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                          A
                        </div>
                        <div>
                          <div className="font-semibold">Administrator Mode</div>
                          <div className="text-[10px] text-slate-400">Dr. Marcus Chen (System & Models)</div>
                        </div>
                      </button>

                      <div className="pt-2 border-t border-slate-100 mt-1 space-y-1">
                        {onOpenRegister && (
                          <button
                            onClick={() => {
                              onOpenRegister();
                              setRoleDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-cyan-700 hover:bg-cyan-50 text-left font-bold cursor-pointer"
                          >
                            <UserPlus className="w-3.5 h-3.5 text-cyan-700" /> + Register New Patient
                          </button>
                        )}
                        <button
                          onClick={() => {
                            onNavigate('profile');
                            setRoleDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-left cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5 text-slate-400" /> View / Edit Profile
                        </button>

                        {onLogout && (
                          <button
                            onClick={() => {
                              setRoleDropdownOpen(false);
                              onLogout();
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-700 hover:bg-rose-50 text-left font-bold cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5 text-rose-600" /> Log Out
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Explicit Log Out Header Action Button */}
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    title="Log Out of Session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Log Out</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav bar row */}
      <div className="md:hidden border-t border-slate-100 bg-slate-50/90 px-3 py-2 flex items-center justify-around text-xs">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 p-1 font-medium cursor-pointer ${
                isActive ? 'text-cyan-800 font-bold' : 'text-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}

        {isAuthenticated && onLogout && (
          <button
            onClick={onLogout}
            className="flex flex-col items-center gap-1 p-1 font-medium text-rose-600 hover:text-rose-800 cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[10px]">Log Out</span>
          </button>
        )}
      </div>
    </header>
  );
};
