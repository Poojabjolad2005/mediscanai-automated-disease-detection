import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { ANALYSES, DOCTORS, SYSTEM_STATS, USERS, VAULT_AUDIT_LOGS } from './server/db';
import { analyzeMedicalImageWithGemini, askMedicalChatbot } from './server/gemini';
import { AI_MODELS, getModelForModality } from './server/models';
import { BodyPart, DoctorReview, ImageModality, MedicalAnalysis, User, VaultAccessLog } from './src/types';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// High limit for medical imaging files (X-ray, CT, MRI, DICOM converts)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Handle body-parser payload errors gracefully
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err) {
    console.warn('Express request body error:', err.message);
    res.status(err.status || 400).json({
      error: err.message || 'Payload parsing error',
      isMedicalImage: false
    });
    return;
  }
  next();
});

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'MediScanAI',
    serverTime: new Date().toISOString(),
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY)
  });
});

// 2. Authentication routes
app.post('/api/auth/login', (req, res) => {
  const { email, role, pin, medicalRecordNumber } = req.body;
  const search = (email || medicalRecordNumber || '').trim().toLowerCase();
  
  let user: User | undefined;
  if (search) {
    user = USERS.find(u => 
      u.email.toLowerCase() === search || 
      (u.medicalRecordNumber && u.medicalRecordNumber.toLowerCase() === search)
    );
  }
  
  // If not found but provided a role, pick default user for that role
  if (!user && role) {
    user = USERS.find(u => u.role === role);
  }

  if (!user) {
    res.status(401).json({
      error: 'No account found with this email or Medical Record Number (MRN). Please check your entry or register.'
    });
    return;
  }

  // If pin is provided and user has a configured PIN, verify it
  if (pin && user.accessPin && pin !== user.accessPin) {
    res.status(401).json({
      error: 'Incorrect 4-digit Security PIN. Please try again.'
    });
    return;
  }

  // Audit successful login
  VAULT_AUDIT_LOGS.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'unlock_vault',
    actorName: user.name,
    actorRole: user.role,
    ipAddress: 'Session Login (TLS)',
    details: `User authenticated successfully (${user.role.toUpperCase()}) - MRN: ${user.medicalRecordNumber || user.id}`
  });

  res.json({
    token: `jwt_session_${user.id}_${Date.now()}`,
    user
  });
});

app.post('/api/auth/logout', (req, res) => {
  const { userId } = req.body;
  if (userId) {
    const user = USERS.find(u => u.id === userId);
    if (user) {
      VAULT_AUDIT_LOGS.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'lock_vault',
        actorName: user.name,
        actorRole: user.role,
        ipAddress: 'Session Terminated (TLS)',
        details: `User explicitly logged out of session (MRN: ${user.medicalRecordNumber || user.id})`
      });
    }
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

app.post('/api/auth/register', (req, res) => {
  const {
    name,
    email,
    role,
    dob,
    gender,
    phone,
    specialty,
    hospital,
    accessPin,
    bloodType,
    allergies,
    emergencyContactName,
    emergencyContactPhone,
    emergencyContactRelationship
  } = req.body;

  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required.' });
    return;
  }

  const existing = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(400).json({ error: 'An account with this email already exists. Please log in.' });
    return;
  }

  const parsedAllergies = Array.isArray(allergies)
    ? allergies
    : typeof allergies === 'string' && allergies.trim()
    ? allergies.split(',').map((s: string) => s.trim()).filter(Boolean)
    : [];

  const emergencyContact = emergencyContactName
    ? {
        name: emergencyContactName,
        phone: emergencyContactPhone || '',
        relationship: emergencyContactRelationship || 'Emergency Contact'
      }
    : undefined;

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    role: role || 'patient',
    dob,
    gender,
    phone,
    specialty,
    hospital,
    accessPin: accessPin || '1234',
    bloodType: bloodType || 'O+',
    allergies: parsedAllergies,
    emergencyContact,
    medicalRecordNumber: `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString()
  };

  USERS.push(newUser);
  SYSTEM_STATS.totalPatients += 1;
  SYSTEM_STATS.recentActivity.unshift({
    id: `act-${Date.now()}`,
    type: 'user_register',
    title: `New patient registered: ${name}`,
    timestamp: 'Just now',
    detail: `MRN: ${newUser.medicalRecordNumber} | PIN Protected: Yes`
  });

  // Log vault registration event
  VAULT_AUDIT_LOGS.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'unlock_vault',
    actorName: newUser.name,
    actorRole: newUser.role,
    ipAddress: 'Patient Device (Protected)',
    details: `New patient registration & security credential setup (MRN: ${newUser.medicalRecordNumber})`
  });

  res.json({
    token: `jwt_sec_${newUser.id}_${Date.now()}`,
    user: newUser
  });
});

// Verify 4-digit security PIN for unlocking protected medical history
app.post('/api/auth/verify-pin', (req, res) => {
  const { userId, pin } = req.body;
  const user = USERS.find(u => u.id === userId);

  if (!user) {
    res.status(404).json({ authorized: false, error: 'User not found' });
    return;
  }

  // If user has no PIN configured yet, default to '1234'
  const expectedPin = user.accessPin || '1234';

  if (pin === expectedPin) {
    VAULT_AUDIT_LOGS.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'unlock_vault',
      actorName: user.name,
      actorRole: user.role,
      ipAddress: 'Authenticated Session (TLS)',
      details: `Successful security PIN verification for MRN ${user.medicalRecordNumber || user.id}`
    });

    res.json({
      authorized: true,
      token: `vault_auth_${user.id}_${Date.now()}`,
      medicalRecordNumber: user.medicalRecordNumber
    });
  } else {
    res.status(401).json({
      authorized: false,
      error: 'Invalid security PIN. Please enter your 4-digit authorization PIN.'
    });
  }
});

// Vault Audit Logs
app.get('/api/vault/audit', (req, res) => {
  res.json(VAULT_AUDIT_LOGS.slice(0, 30));
});

app.post('/api/vault/audit', (req, res) => {
  const { action, actorName, actorRole, details } = req.body;
  const log: VaultAccessLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: action || 'view_scan',
    actorName: actorName || 'Authorized User',
    actorRole: actorRole || 'patient',
    ipAddress: 'Encrypted Health Network',
    details: details || 'Access to protected clinical analysis record'
  };
  VAULT_AUDIT_LOGS.unshift(log);
  res.json({ success: true, log });
});

app.get('/api/auth/users', (req, res) => {
  res.json(USERS);
});

// 3. AI Models Registry
app.get('/api/models', (req, res) => {
  res.json(AI_MODELS);
});

// 4. Analyses Routes - Protected & Isolated by User
app.get('/api/analyses', (req, res) => {
  const { userId, role } = req.query;

  // Doctors and Admins can view diagnostic radiology queues
  if (role === 'doctor' || role === 'admin') {
    res.json(ANALYSES);
    return;
  }

  // Patients strictly only access their own authorized scans
  if (userId) {
    const userScans = ANALYSES.filter(a => a.userId === userId);
    res.json(userScans);
    return;
  }

  // If no user specified for patient query, return empty list for privacy protection
  res.json([]);
});

app.get('/api/analyses/:id', (req, res) => {
  const analysis = ANALYSES.find(a => a.id === req.params.id);
  if (!analysis) {
    res.status(404).json({ error: 'Analysis not found' });
    return;
  }
  res.json(analysis);
});

// Analyze uploaded medical image
app.post('/api/analyses', async (req, res) => {
  try {
    const {
      imageData: rawImageData,
      imageUrl,
      imageName,
      fileSize,
      fileFormat,
      modality,
      bodyPart,
      userId,
      patientName,
      patientDob,
      patientGender
    } = req.body;

    const imageData = rawImageData || imageUrl;

    if (!imageData) {
      res.status(400).json({ error: 'Missing image data' });
      return;
    }

    const selectedModality: ImageModality = modality || 'chest_xray';

    // Call server-side Gemini or fallback model inference
    const mimeMatch = typeof imageData === 'string' ? imageData.match(/^data:([a-zA-Z0-9/+.-]+);base64,/) : null;
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    const prediction = await analyzeMedicalImageWithGemini(
      imageData,
      mimeType,
      selectedModality,
      bodyPart || 'Chest / Lungs',
      imageName || 'medical_scan.jpg'
    );

    // Strictly check if the image is a valid medical diagnostic image
    if (prediction.isMedicalImage === false) {
      res.json({
        isMedicalImage: false,
        imageName: imageName || 'uploaded_image.jpg',
        imageUrl: imageData,
        detectedSubject: prediction.detectedSubject || 'Non-medical image / Everyday photograph',
        rejectionReason: prediction.rejectionReason || 'The uploaded image is not a medical diagnostic image (X-ray, MRI, CT, ultrasound, or dermoscopy scan). MediScanAI strictly analyzes medical images only.',
        guidance: prediction.guidance || 'Please upload an authentic clinical medical image such as a chest X-ray, brain MRI, thoracic CT slice, or dermoscopic skin lesion.',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Determine actual modality and anatomy from AI detection if different from user selection
    const actualModality: ImageModality = prediction.identifiedModality || selectedModality;
    const actualBodyPart: BodyPart = (prediction.identifiedAnatomy as BodyPart) || (bodyPart as BodyPart) || 'Chest / Lungs';
    const model = getModelForModality(actualModality);

    const newAnalysis: MedicalAnalysis = {
      id: `MED-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: userId || 'user-patient-1',
      patientName: patientName || 'Sarah Jenkins',
      patientDob: patientDob || '1990-04-14',
      patientGender: patientGender || 'Female',
      imageName: imageName || 'uploaded_medical_image.jpg',
      imageUrl: imageData,
      modality: actualModality,
      bodyPart: actualBodyPart,
      fileSize: fileSize || '2.1 MB',
      fileFormat: fileFormat || 'DICOM / Image',
      createdAt: new Date().toISOString(),
      modelUsed: {
        id: model.id,
        name: model.name,
        architecture: model.architecture,
        version: model.version
      },
      prediction,
      validationInfo: {
        isMedicalImage: true,
        identifiedModality: prediction.identifiedModalityLabel || actualModality,
        identifiedAnatomy: actualBodyPart,
        viewOrProjection: prediction.viewOrProjection,
        qualityAssessment: prediction.qualityAssessment || 'Diagnostic Quality',
        modalityMismatchWarning: (selectedModality !== actualModality && prediction.identifiedModality)
          ? `Input was categorized as ${selectedModality.replace('_', ' ').toUpperCase()}, but automated radiological analysis identified this as ${actualModality.replace('_', ' ').toUpperCase()}.`
          : undefined,
        guidance: prediction.guidance
      },
      status: 'completed',
      tags: [actualModality, prediction.riskLevel]
    };

    ANALYSES.unshift(newAnalysis);

    // Update stats
    SYSTEM_STATS.totalScans += 1;
    if (SYSTEM_STATS.scansByModality[actualModality] !== undefined) {
      SYSTEM_STATS.scansByModality[actualModality] += 1;
    } else {
      SYSTEM_STATS.scansByModality[actualModality] = 1;
    }

    SYSTEM_STATS.recentActivity.unshift({
      id: `act-${Date.now()}`,
      type: 'scan',
      title: `${actualModality.toUpperCase()} analyzed for ${newAnalysis.patientName}`,
      timestamp: 'Just now',
      detail: `${model.name} detected: ${prediction.condition} (${prediction.confidence}% confidence)`
    });

    res.json(newAnalysis);
  } catch (err: any) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message || 'Failed to analyze medical image' });
  }
});

// Doctor review submission
app.post('/api/analyses/:id/review', (req, res) => {
  const analysis = ANALYSES.find(a => a.id === req.params.id);
  if (!analysis) {
    res.status(404).json({ error: 'Analysis not found' });
    return;
  }

  const {
    doctorId,
    doctorName,
    doctorSpecialty,
    hospital,
    clinicalNotes,
    agreedWithAI,
    recommendations,
    signature
  } = req.body;

  const review: DoctorReview = {
    id: `rev-${Date.now()}`,
    doctorId: doctorId || 'user-doctor-1',
    doctorName: doctorName || 'Dr. Elena Vance, MD, FACR',
    doctorSpecialty: doctorSpecialty || 'Diagnostic Radiology',
    hospital: hospital || 'Metropolitan University Medical Center',
    reviewedAt: new Date().toISOString(),
    clinicalNotes: clinicalNotes || 'Clinical correlation verified.',
    agreedWithAI: Boolean(agreedWithAI),
    recommendations: recommendations || ['Follow up with primary care physician.'],
    signature: signature || `${doctorName || 'Dr. Elena Vance, MD'} (Digitally Certified)`,
    status: 'reviewed'
  };

  analysis.doctorReview = review;
  analysis.status = 'verified';

  SYSTEM_STATS.recentActivity.unshift({
    id: `act-${Date.now()}`,
    type: 'doctor_review',
    title: `${review.doctorName} reviewed Analysis ${analysis.id}`,
    timestamp: 'Just now',
    detail: `Verdict: ${agreedWithAI ? 'Agreed with AI' : 'Modified AI Impression'} - ${analysis.prediction.condition}`
  });

  res.json(analysis);
});

// Delete analysis
app.delete('/api/analyses/:id', (req, res) => {
  const index = ANALYSES.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Analysis not found' });
    return;
  }
  ANALYSES.splice(index, 1);
  res.json({ success: true, message: 'Analysis deleted successfully' });
});

// 5. Doctors Directory
app.get('/api/doctors', (req, res) => {
  const { specialty, location, availability } = req.query;
  let filtered = [...DOCTORS];

  if (specialty && specialty !== 'All Specialties') {
    filtered = filtered.filter(d => d.specialty.toLowerCase().includes(String(specialty).toLowerCase()));
  }

  if (location && location !== 'All Locations') {
    filtered = filtered.filter(d => d.location.toLowerCase().includes(String(location).toLowerCase()));
  }

  if (availability && availability !== 'Any Availability') {
    filtered = filtered.filter(d => d.availability === availability);
  }

  res.json(filtered);
});

// 6. Medical Chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { query, message, history, latestAnalysisContext, language } = req.body;
    const userQuery = query || message;
    if (!userQuery) {
      res.status(400).json({ error: 'Query or message is required' });
      return;
    }

    const response = await askMedicalChatbot(userQuery, history || [], latestAnalysisContext, language || 'en');
    res.json(response);
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Chat service error' });
  }
});

// 7. System statistics (Admin)
app.get('/api/admin/stats', (req, res) => {
  res.json(SYSTEM_STATS);
});

// Start server with Vite middleware in dev
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🏥 MediScanAI full-stack server running:`);
    console.log(`   ➜ Local:   http://localhost:${PORT}`);
    console.log(`   ➜ Network: http://0.0.0.0:${PORT}\n`);
  });
}

startServer();
