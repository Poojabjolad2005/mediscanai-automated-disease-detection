export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  phone?: string;
  medicalRecordNumber?: string;
  specialty?: string; // for doctors
  hospital?: string; // for doctors
  licenseNumber?: string; // for doctors
  accessPin?: string; // 4-digit security PIN to protect and unlock medical scan history
  bloodType?: string;
  allergies?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: string;
}

export interface PatientRegistrationData {
  name: string;
  email: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  phone: string;
  bloodType?: string;
  allergies?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  accessPin: string;
  consentAgreed: boolean;
}

export interface VaultAccessLog {
  id: string;
  timestamp: string;
  action: 'unlock_vault' | 'lock_vault' | 'view_scan' | 'export_record' | 'delete_scan';
  actorName: string;
  actorRole: UserRole;
  ipAddress?: string;
  details: string;
}

export type ImageModality = 'chest_xray' | 'brain_mri' | 'ct_scan' | 'skin_image' | 'ultrasound';

export type BodyPart = 'Chest / Lungs' | 'Brain / Head' | 'Abdomen / Torso' | 'Skin / Derm' | 'Spine / Musculoskeletal';

export type RiskLevel = 'Low Risk / Normal' | 'Requires Medical Review' | 'Elevated / Moderate' | 'High Attention / Critical';

export interface GradCamCoordinate {
  x: number; // 0-100%
  y: number; // 0-100%
  radius: number; // 0-100
  intensity: number; // 0-1
  label?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  architecture: string;
  version: string;
  modality: ImageModality;
  supportedConditions: string[];
  accuracy: number;
  sensitivity: number;
  specificity: number;
  dataset: string;
  lastUpdated: string;
  status: 'active' | 'evaluating' | 'maintenance';
}

export interface DoctorReview {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  hospital: string;
  reviewedAt: string;
  clinicalNotes: string;
  agreedWithAI: boolean;
  recommendations: string[];
  signature: string;
  status: 'pending' | 'reviewed' | 'escalated';
}

export interface MedicalAnalysis {
  id: string;
  userId: string;
  patientName: string;
  patientDob?: string;
  patientGender?: string;
  imageName: string;
  imageUrl: string;
  modality: ImageModality;
  bodyPart: BodyPart;
  fileSize: string;
  fileFormat: string;
  createdAt: string;
  modelUsed: {
    id: string;
    name: string;
    architecture: string;
    version: string;
  };
  prediction: {
    condition: string;
    secondaryConditions?: { name: string; probability: number }[];
    confidence: number; // e.g. 94.2
    riskLevel: RiskLevel;
    findings: string[];
    whatThisMeans: string;
    recommendedNextSteps: string[];
    seekUrgentCareWhen: string[];
    gradCamCoordinates: GradCamCoordinate[];
    aiAttentionExplanation: string;
  };
  validationInfo?: MedicalValidationInfo;
  doctorReview?: DoctorReview;
  status: AnalysisStatus;
  tags?: string[];
}

export interface MedicalValidationInfo {
  isMedicalImage: boolean;
  detectedSubject?: string;
  rejectionReason?: string;
  identifiedModality?: string;
  identifiedAnatomy?: string;
  viewOrProjection?: string;
  qualityAssessment?: 'Diagnostic Quality' | 'Sub-optimal' | 'Non-diagnostic';
  modalityMismatchWarning?: string;
  guidance?: string;
}

export interface NonMedicalRejection {
  isMedicalImage: false;
  imageName: string;
  imageUrl: string;
  detectedSubject: string;
  rejectionReason: string;
  guidance: string;
  timestamp: string;
}

export type AnalysisStatus = 'completed' | 'under_review' | 'verified' | 'pending_doctor_review';

export interface AIModelMeta {
  id: string;
  name: string;
  architecture: string;
  version: string;
  dataset: string;
  targetModality: ImageModality;
  supportedConditions: string[];
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  isActive: boolean;
  lastTrained: string;
}

export interface DoctorProfile {
  id: string;
  name: string;
  title?: string;
  specialty: string;
  hospital: string;
  location?: string;
  city?: string;
  country?: string;
  experienceYears?: number;
  yearsOfExperience?: number;
  rating: number;
  reviewCount?: number;
  reviewsCount?: number;
  availability?: 'Available Today' | 'Next 24 Hours' | 'This Week' | 'On Leave';
  consultFee?: string;
  consultationFee?: string;
  imageUrl?: string;
  avatarUrl?: string;
  bio: string;
  phone?: string;
  email?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isEmergencyAlert?: boolean;
  relatedTopic?: string;
}

export interface SystemStats {
  totalScans: number;
  totalPatients: number;
  totalDoctors: number;
  averageConfidence: number;
  accuracyRate: number;
  scansByModality: { [key: string]: number };
  recentActivity: {
    id: string;
    type: 'scan' | 'doctor_review' | 'user_register' | 'model_update';
    title: string;
    timestamp: string;
    detail: string;
  }[];
}
