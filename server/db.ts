import { DoctorProfile, MedicalAnalysis, SystemStats, User, VaultAccessLog } from '../src/types';

// In-memory persistent database store for MediScanAI
export const USERS: User[] = [
  {
    id: 'user-patient-1',
    name: 'Sarah Jenkins',
    email: 'sarah@mediscan.ai',
    role: 'patient',
    dob: '1990-04-14',
    gender: 'Female',
    phone: '+1 (555) 234-8901',
    medicalRecordNumber: 'MRN-884920',
    accessPin: '1234',
    bloodType: 'A+',
    allergies: ['Penicillin (Moderate rash)'],
    emergencyContact: {
      name: 'Robert Jenkins',
      phone: '+1 (555) 234-8902',
      relationship: 'Spouse'
    },
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'user-doctor-1',
    name: 'Dr. Elena Vance, MD, FACR',
    email: 'dr.vance@mediscan.ai',
    role: 'doctor',
    specialty: 'Diagnostic Thoracic & Neuroradiology',
    hospital: 'Metropolitan University Medical Center',
    licenseNumber: 'MD-NY-772910',
    phone: '+1 (555) 892-3341',
    accessPin: '1234',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-11-20T08:30:00Z'
  },
  {
    id: 'user-admin-1',
    name: 'Dr. Marcus Chen, Chief Medical Officer',
    email: 'admin@mediscan.ai',
    role: 'admin',
    specialty: 'Clinical Informatics & Healthcare Operations',
    hospital: 'MediScanAI Health Network',
    phone: '+1 (555) 440-9922',
    accessPin: '1234',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-10-01T09:00:00Z'
  }
];

export const VAULT_AUDIT_LOGS: VaultAccessLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-08T08:15:22.000Z',
    action: 'unlock_vault',
    actorName: 'Sarah Jenkins',
    actorRole: 'patient',
    ipAddress: '192.168.1.42 (Encrypted TLS)',
    details: 'Verified with 4-digit patient security PIN for MRN-884920'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-08T08:17:10.000Z',
    action: 'view_scan',
    actorName: 'Sarah Jenkins',
    actorRole: 'patient',
    ipAddress: '192.168.1.42 (Encrypted TLS)',
    details: 'Accessed scan MED-2026-1042 (Chest X-ray consolidation study)'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-07T14:30:00.000Z',
    action: 'unlock_vault',
    actorName: 'Dr. Elena Vance, MD, FACR',
    actorRole: 'doctor',
    ipAddress: '10.200.4.12 (Hospital Intranet)',
    details: 'Authorized physician review session for radiology worklist'
  }
];

export const DOCTORS: DoctorProfile[] = [
  {
    id: 'doc-1',
    name: 'Dr. Elena Vance, MD, FACR',
    title: 'Senior Clinical Radiologist',
    specialty: 'Thoracic & Diagnostic Radiology',
    hospital: 'Metropolitan University Medical Center',
    location: 'Boston, MA (Tele-consult available)',
    experienceYears: 16,
    rating: 4.9,
    reviewCount: 142,
    availability: 'Available Today',
    consultFee: '$120 / Review',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
    bio: 'Board-certified radiologist with fellowship training in thoracic imaging and artificial intelligence computer-aided triage.',
    phone: '+1 (555) 892-3341',
    email: 'dr.vance@mediscan.ai'
  },
  {
    id: 'doc-2',
    name: 'Dr. Julian Thorne, MD, PhD',
    title: 'Director of Pulmonary Medicine',
    specialty: 'Pulmonology & Respiratory Critical Care',
    hospital: 'Saint Jude Memorial Hospital',
    location: 'Cambridge, MA',
    experienceYears: 19,
    rating: 4.8,
    reviewCount: 98,
    availability: 'Next 24 Hours',
    consultFee: '$140 / Review',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    bio: 'Specializing in infectious pulmonary consolidations, interstitial lung diseases, and high-resolution computed tomography reading.',
    phone: '+1 (555) 901-2244',
    email: 'jthorne@saintjudehealth.org'
  },
  {
    id: 'doc-3',
    name: 'Dr. Priya Nambiar, MD',
    title: 'Assistant Professor of Neurosurgery',
    specialty: 'Neurosurgery & Neuro-Oncology',
    hospital: 'Brigham Brain & Spine Institute',
    location: 'Boston, MA',
    experienceYears: 12,
    rating: 5.0,
    reviewCount: 77,
    availability: 'This Week',
    consultFee: '$180 / Review',
    imageUrl: 'https://images.unsplash.com/photo-1594824813581-22e7a08b98b9?w=200&auto=format&fit=crop&q=80',
    bio: 'Expert in cranial neoplasm localization, functional MRI interpretation, stereotactic radiotherapy, and minimally invasive resection.',
    phone: '+1 (555) 345-6677',
    email: 'pnambiar@brighambrain.org'
  },
  {
    id: 'doc-4',
    name: 'Dr. Carlos Mendoza, MD, FAAD',
    title: 'Clinical Dermatologist & Dermoscopist',
    specialty: 'Dermatology & Cutaneous Oncology',
    hospital: 'New England Skin & Melanoma Center',
    location: 'Brookline, MA',
    experienceYears: 14,
    rating: 4.9,
    reviewCount: 165,
    availability: 'Available Today',
    consultFee: '$110 / Review',
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
    bio: 'Specialist in early pigmented lesion surveillance, digital dermoscopy, and Mohs micrographic surgery.',
    phone: '+1 (555) 877-1199',
    email: 'cmendoza@neskincenter.com'
  }
];

// Sample Medical Analyses preloaded for instant comprehensive preview
export const ANALYSES: MedicalAnalysis[] = [
  {
    id: 'MED-2026-9901',
    userId: 'user-patient-1',
    patientName: 'Sarah Jenkins',
    patientDob: '1990-04-14',
    patientGender: 'Female',
    imageName: 'chest_pax_0049_right_consolidation.jpg',
    // Using a clear public domain medical Chest X-ray sample
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
    modality: 'chest_xray',
    bodyPart: 'Chest / Lungs',
    fileSize: '2.4 MB',
    fileFormat: 'JPEG (16-bit Grayscale)',
    createdAt: '2026-09-05T14:32:00Z',
    modelUsed: {
      id: 'cxr-densenet-v2',
      name: 'ChexNet-DenseNet121',
      architecture: 'DenseNet-121 with Multi-label BCE Transfer Learning',
      version: 'v2.4.1'
    },
    prediction: {
      condition: 'Possible Pneumonia (Right Middle Lobe Consolidation)',
      secondaryConditions: [
        { name: 'Viral Pneumonitis', probability: 18.5 },
        { name: 'Atelectasis (Partial Collapse)', probability: 12.2 },
        { name: 'Bronchitis with Mucus Plugs', probability: 6.4 }
      ],
      confidence: 94.2,
      riskLevel: 'Requires Medical Review',
      findings: [
        'Patchy airspace opacity and alveolar consolidation localized in the right middle/lower lung zone.',
        'Presence of subtle air bronchograms traversing the consolidation field.',
        'Cardiac silhouette and cardiothoracic ratio appear within normal range (< 0.50).',
        'No evidence of large pneumothorax or blunted costophrenic angles.'
      ],
      whatThisMeans: 'The deep learning classifier identified density patterns and consolidation consistent with localized fluid or inflammatory infiltrate in the lung alveoli, commonly observed in infectious pneumonia.',
      recommendedNextSteps: [
        'Schedule a clinical consultation with your primary physician or pulmonologist within 24–48 hours.',
        'Complete blood count (CBC), CRP, and pulse oximetry to assess inflammation and oxygenation.',
        'Follow-up chest radiograph in 4 to 6 weeks post-treatment to confirm complete radiological resolution.'
      ],
      seekUrgentCareWhen: [
        'Severe shortness of breath or inability to complete full sentences without panting.',
        'Resting oxygen saturation (SpO2) falling below 93%.',
        'Confusion, dizziness, persistent chest pain, or coughing up significant blood.'
      ],
      gradCamCoordinates: [
        { x: 68, y: 56, radius: 24, intensity: 0.96, label: 'Right Middle Lobe Alveolar Opacity' },
        { x: 62, y: 64, radius: 16, intensity: 0.78, label: 'Peribronchial Cuffing' },
        { x: 36, y: 52, radius: 14, intensity: 0.32, label: 'Left Lung Reference' }
      ],
      aiAttentionExplanation: 'The ResNet/DenseNet feature attribution identifies peak activation gradients surrounding the right paracardiac and middle lobe region corresponding to radiopaque consolidation.'
    },
    doctorReview: {
      id: 'rev-01',
      doctorId: 'user-doctor-1',
      doctorName: 'Dr. Elena Vance, MD, FACR',
      doctorSpecialty: 'Diagnostic Thoracic Radiology',
      hospital: 'Metropolitan University Medical Center',
      reviewedAt: '2026-09-06T09:15:00Z',
      clinicalNotes: 'Concur with AI screening findings. Right middle lobe consolidation is consistent with community-acquired bacterial pneumonia. Advised patient to commence prescribed antibiotic therapy under supervision.',
      agreedWithAI: true,
      recommendations: [
        'Initiate outpatient empiric therapy as indicated by clinical presentation.',
        'Check pulse oximetry twice daily at home.',
        'Follow-up in 7 days or sooner if high fevers persist.'
      ],
      signature: 'Elena Vance, MD (Digitally Signed & Certified)',
      status: 'reviewed'
    },
    status: 'verified',
    tags: ['Respiratory', 'Pneumonia', 'Doctor Verified']
  },
  {
    id: 'MED-2026-9884',
    userId: 'user-patient-1',
    patientName: 'Sarah Jenkins',
    patientDob: '1990-04-14',
    patientGender: 'Female',
    imageName: 'brain_t1_axial_contrast_mri.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format&fit=crop&q=80',
    modality: 'brain_mri',
    bodyPart: 'Brain / Head',
    fileSize: '3.8 MB',
    fileFormat: 'DICOM converted to PNG',
    createdAt: '2026-09-01T11:20:00Z',
    modelUsed: {
      id: 'mri-efficientnet-b4',
      name: 'NeuroScan-EfficientNetB4',
      architecture: 'EfficientNet-B4 + Axial Attention Feature Extractor',
      version: 'v3.1.0'
    },
    prediction: {
      condition: 'Suspected Meningioma / Extra-Axial Mass',
      secondaryConditions: [
        { name: 'High-Grade Glioma', probability: 16.4 },
        { name: 'Schwannoma', probability: 7.2 },
        { name: 'Benign Arachnoid Cyst', probability: 3.1 }
      ],
      confidence: 93.7,
      riskLevel: 'Requires Medical Review',
      findings: [
        'Well-circumscribed, extra-axial enhancing lesion along the left frontoparietal convexity.',
        'Surrounding vasogenic edema causing mild mass effect on adjacent sulci without midline shift.',
        'Distinct dural tail sign visible along the adjacent inner table of the calvarium.',
        'Ventricular system maintains symmetrical caliber without obstructive hydrocephalus.'
      ],
      whatThisMeans: 'The model observed an extra-axial tissue density with typical morphological features of a slow-growing meningeal lesion along the brain surface.',
      recommendedNextSteps: [
        'Urgent neurosurgical or neuro-oncology referral for formal contrast-enhanced 3T MRI evaluation.',
        'Neurological baseline examination to evaluate cranial nerves and motor reflexes.',
        'Discussion of surgical resection versus stereotactic radiosurgery options.'
      ],
      seekUrgentCareWhen: [
        'Sudden severe "thunderclap" headache unlike any previous headache.',
        'New onset seizure activity or loss of consciousness.',
        'Sudden motor weakness, hemiparesis, or acute speech difficulty (aphasia).'
      ],
      gradCamCoordinates: [
        { x: 34, y: 38, radius: 22, intensity: 0.95, label: 'Left Frontoparietal Mass' },
        { x: 42, y: 44, radius: 16, intensity: 0.65, label: 'Perilesional Vasogenic Edema' }
      ],
      aiAttentionExplanation: 'EfficientNet-B4 spatial feature map highlights maximum gradient activation at the left dural margin where hyperintense contrast enhancement and sulcal effacement occur.'
    },
    status: 'under_review',
    tags: ['Neurology', 'MRI', 'Brain Tumor Screening']
  }
];

export const SYSTEM_STATS: SystemStats = {
  totalScans: 1482,
  totalPatients: 894,
  totalDoctors: 48,
  averageConfidence: 94.6,
  accuracyRate: 96.2,
  scansByModality: {
    chest_xray: 712,
    brain_mri: 348,
    skin_image: 242,
    ct_scan: 180
  },
  recentActivity: [
    {
      id: 'act-1',
      type: 'scan',
      title: 'Chest X-ray analyzed for Sarah Jenkins',
      timestamp: '2 hours ago',
      detail: 'ChexNet-DenseNet121 - 94.2% confidence (Possible Pneumonia)'
    },
    {
      id: 'act-2',
      type: 'doctor_review',
      title: 'Dr. Elena Vance verified Analysis MED-2026-9901',
      timestamp: '5 hours ago',
      detail: 'Added clinical notes and antibiotic stewardship plan'
    },
    {
      id: 'act-3',
      type: 'model_update',
      title: 'ChexNet-DenseNet121 model deployed',
      timestamp: '1 day ago',
      detail: 'Trained on 112k verified scans with 94.8% test accuracy'
    }
  ]
};
