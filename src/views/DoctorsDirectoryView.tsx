import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Search,
  Send,
  Star,
  Stethoscope,
  X
} from 'lucide-react';
import { DoctorProfile, MedicalAnalysis } from '../types';

interface Props {
  doctors: DoctorProfile[];
  analyses: MedicalAnalysis[];
}

export const DoctorsDirectoryView: React.FC<Props> = ({ doctors, analyses }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState(analyses[0]?.id || '');
  const [consultSuccess, setConsultSuccess] = useState(false);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = specialtyFilter === 'all' || doc.specialty.toLowerCase().includes(specialtyFilter.toLowerCase());

    return matchesSearch && matchesSpecialty;
  });

  const handleBookConsult = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultSuccess(true);
    setTimeout(() => {
      setConsultSuccess(false);
      setConsultModalOpen(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center gap-2 text-cyan-700 text-xs font-bold uppercase tracking-wider">
          <Stethoscope className="w-4 h-4" /> Physician Network Directory
        </div>
        <h1 className="text-2xl font-black text-slate-900 mt-1">
          Find a Doctor & Second Opinion
        </h1>
        <p className="text-xs text-slate-500">
          Connect with certified board radiologists, pulmonologists, and neurologists to review your AI screening reports.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by doctor name, specialty, hospital, or city..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Specialties</option>
            <option value="radiolog">Radiology</option>
            <option value="pulmonolog">Pulmonology</option>
            <option value="neurolog">Neurology</option>
            <option value="dermatolog">Dermatology</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 hover:border-cyan-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={doc.avatarUrl}
                  alt={doc.name}
                  className="w-14 h-14 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{doc.name}</h3>
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" title="Board Certified" />
                  </div>
                  <div className="text-xs font-bold text-cyan-700">{doc.specialty}</div>
                  <div className="text-[11px] text-slate-500 truncate">{doc.hospital}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-[11px]">
                <div>
                  <span className="text-slate-400 block">Experience</span>
                  <span className="font-semibold text-slate-800">{doc.yearsOfExperience} years</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Rating</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {doc.rating} ({doc.reviewsCount})
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {doc.bio}
              </p>

              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{doc.city}, {doc.country}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-slate-800">
                {doc.consultationFee}
              </span>
              <button
                onClick={() => {
                  setSelectedDoctor(doc);
                  setConsultModalOpen(true);
                }}
                className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Request Review
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking / Scan Share Modal */}
      {consultModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Request Clinical Review
              </h3>
              <button
                onClick={() => setConsultModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {consultSuccess ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Consultation Queued!</h4>
                <p className="text-xs text-slate-500">
                  {selectedDoctor.name} has received your scan and clinical notes. Expect formal review sign-off within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookConsult} className="space-y-4 text-xs">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <img
                    src={selectedDoctor.avatarUrl}
                    alt={selectedDoctor.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{selectedDoctor.name}</div>
                    <div className="text-[11px] text-cyan-700">{selectedDoctor.specialty}</div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Scan to Share for Second Opinion:
                  </label>
                  <select
                    value={selectedAnalysisId}
                    onChange={(e) => setSelectedAnalysisId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
                  >
                    {analyses.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.id} - {a.prediction.condition} ({a.modality.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Notes for the Attending Doctor:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe any current symptoms, fever, cough, or prior medical history..."
                    defaultValue="Patient requesting secondary opinion regarding AI-detected alveolar consolidation."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setConsultModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
