import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  Camera,
  Check,
  ChevronRight,
  FileText,
  FileUp,
  Image as ImageIcon,
  Info,
  Layers,
  Sparkles,
  UploadCloud,
  X
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { BodyPart, ImageModality, User } from '../types';
import { optimizeImageForAnalysis } from '../utils/imageOptimizer';

interface Props {
  user: User;
  onStartAnalysis: (scanPayload: {
    imageData: string;
    imageName: string;
    fileSize: string;
    fileFormat: string;
    modality: ImageModality;
    bodyPart: BodyPart;
  }) => void;
  onNavigate: (view: string) => void;
}

const SAMPLE_PRESETS = [
  {
    title: 'Chest X-ray (Pneumonia Infiltration)',
    modality: 'chest_xray' as ImageModality,
    bodyPart: 'Chest / Lungs' as BodyPart,
    format: 'DICOM / Radiograph JPEG',
    size: '2.4 MB',
    fileName: 'cxr_acute_middle_lobe_consolidation.jpg',
    url: '/samples/chest_xray_sample.jpg',
    description: 'Posteroanterior chest radiograph demonstrating right middle lobe alveolar consolidation and bronchograms.'
  },
  {
    title: 'Brain MRI (Axial T1 Contrast)',
    modality: 'brain_mri' as ImageModality,
    bodyPart: 'Brain / Head' as BodyPart,
    format: 'DICOM / Cranial MRI',
    size: '3.6 MB',
    fileName: 'mri_brain_t1_axial_convexity_mass.jpg',
    url: '/samples/brain_mri_sample.jpg',
    description: 'T1-weighted axial contrast study showing well-circumscribed extra-axial enhancement along left dural margin.'
  },
  {
    title: 'Skin Lesion Dermoscopy',
    modality: 'skin_image' as ImageModality,
    bodyPart: 'Skin / Derm' as BodyPart,
    format: 'High-Res Dermoscopic JPEG',
    size: '1.8 MB',
    fileName: 'dermoscopy_atypical_pigmented_lesion.jpg',
    url: '/samples/dermoscopy_sample.jpg',
    description: 'High-magnification polarized dermoscopic view with pigment network disruption and border notch.'
  },
  {
    title: 'Chest CT Scan (Thoracic Axial)',
    modality: 'ct_scan' as ImageModality,
    bodyPart: 'Abdomen / Torso' as BodyPart,
    format: 'DICOM Slice CT',
    size: '4.1 MB',
    fileName: 'ct_thorax_axial_parenchyma.jpg',
    url: '/samples/ct_scan_sample.jpg',
    description: 'High-resolution thoracic axial CT window highlighting peripheral solitary pulmonary nodule.'
  }
];

export const UploadView: React.FC<Props> = ({ user, onStartAnalysis, onNavigate }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    dataUrl: string;
    name: string;
    size: string;
    format: string;
    uploadDate: string;
  } | null>(null);

  const [modality, setModality] = useState<ImageModality>('chest_xray');
  const [bodyPart, setBodyPart] = useState<BodyPart>('Chest / Lungs');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // File processing
  const handleFile = async (file: File) => {
    if (!file) return;

    // Validate type
    const isImage = file.type.startsWith('image/') || file.name.endsWith('.dcm');

    if (!isImage) {
      alert('Please upload a supported medical image format (JPEG, PNG, or DICOM).');
      return;
    }

    try {
      const { dataUrl, sizeFormatted } = await optimizeImageForAnalysis(file, 1600, 0.85);

      setSelectedFile({
        dataUrl,
        name: file.name,
        size: sizeFormatted,
        format: file.type || 'DICOM / Raw Image',
        uploadDate: new Date().toLocaleString()
      });

      // Auto-suggest modality based on filename
      const fn = file.name.toLowerCase();
      if (fn.includes('mri') || fn.includes('brain')) {
        setModality('brain_mri');
        setBodyPart('Brain / Head');
      } else if (fn.includes('ct') || fn.includes('computed')) {
        setModality('ct_scan');
        setBodyPart('Abdomen / Torso');
      } else if (fn.includes('skin') || fn.includes('derm') || fn.includes('mole')) {
        setModality('skin_image');
        setBodyPart('Skin / Derm');
      } else {
        setModality('chest_xray');
        setBodyPart('Chest / Lungs');
      }
    } catch (err) {
      console.error('File optimization error:', err);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Camera capture
  const startCamera = async () => {
    setCameraError(null);
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access camera. Please check camera permissions or upload an image file.');
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const rawDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const { dataUrl, sizeFormatted } = await optimizeImageForAnalysis(rawDataUrl, 1600, 0.85);
      setSelectedFile({
        dataUrl,
        name: `camera_scan_${Date.now()}.jpg`,
        size: sizeFormatted,
        format: 'JPEG (Device Optical Camera)',
        uploadDate: new Date().toLocaleString()
      });
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handlePresetSelect = async (preset: typeof SAMPLE_PRESETS[0]) => {
    setModality(preset.modality);
    setBodyPart(preset.bodyPart);

    try {
      const res = await fetch(preset.url);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedFile({
          dataUrl: (e.target?.result as string) || preset.url,
          name: preset.fileName,
          size: preset.size,
          format: preset.format,
          uploadDate: new Date().toLocaleString()
        });
      };
      reader.readAsDataURL(blob);
    } catch {
      setSelectedFile({
        dataUrl: preset.url,
        name: preset.fileName,
        size: preset.size,
        format: preset.format,
        uploadDate: new Date().toLocaleString()
      });
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) return;
    onStartAnalysis({
      imageData: selectedFile.dataUrl,
      imageName: selectedFile.name,
      fileSize: selectedFile.size,
      fileFormat: selectedFile.format,
      modality,
      bodyPart
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-cyan-700 text-xs font-bold uppercase tracking-wider">
          <UploadCloud className="w-4 h-4" /> Diagnostic Ingestion Module
        </div>
        <h1 className="text-2xl font-black text-slate-900 mt-1">
          Upload & Configure Medical Scan
        </h1>
        <p className="text-xs text-slate-500">
          Upload radiographs, DICOM scans, or clinical photographs for automated deep learning disease screening.
        </p>
      </div>

      {/* Strict Medical Domain Notice */}
      <div className="bg-cyan-50/80 border border-cyan-200/90 rounded-2xl p-4 flex items-start gap-3 text-xs">
        <div className="p-2 bg-cyan-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <span className="font-bold text-cyan-950 uppercase tracking-wider text-[11px] block">
            Strict Medical Diagnostic Scope
          </span>
          <p className="text-cyan-900 leading-relaxed">
            MediScanAI is calibrated <strong>exclusively for authentic medical diagnostic imagery</strong> (Chest & Skeletal X-rays, Cranial/Body MRIs, Thoracic/Abdominal CT scans, and Polarized Dermoscopy). Non-medical images (such as pets, vehicles, selfies, food, landscapes, or documents) are automatically detected and rejected to protect patient safety.
          </p>
        </div>
      </div>

      <DisclaimerBanner variant="compact" onLearnMore={() => onNavigate('disclaimer')} />

      {/* Camera modal view if active */}
      {cameraActive && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-xl rounded-2xl overflow-hidden border border-slate-700 shadow-2xl p-4 space-y-4">
            <div className="flex items-center justify-between text-white">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" /> Medical Image Capture
              </h3>
              <button onClick={stopCamera} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {cameraError ? (
              <div className="p-4 bg-red-900/40 border border-red-700 text-red-200 text-xs rounded-xl">
                {cameraError}
              </div>
            ) : (
              <div className="relative aspect-4/3 bg-black rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                {/* Aiming crosshair for document / lesion */}
                <div className="absolute inset-8 border-2 border-cyan-500/50 rounded-lg pointer-events-none flex items-center justify-center">
                  <span className="text-[11px] text-cyan-300 bg-slate-900/80 px-2 py-0.5 rounded">
                    Center radiograph or lesion in frame
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={stopCamera}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              {!cameraError && (
                <button
                  onClick={capturePhoto}
                  className="flex items-center gap-2 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  <Camera className="w-4 h-4" /> Capture Photo
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Drag-and-Drop / Upload Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        {!selectedFile ? (
          <div>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-cyan-500 bg-cyan-50/50 scale-[0.99]'
                  : 'border-slate-300 hover:border-cyan-400 bg-slate-50/50 hover:bg-cyan-50/20'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,.dcm"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-cyan-100 text-cyan-700 mx-auto flex items-center justify-center mb-4 shadow-xs">
                <FileUp className="w-8 h-8" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">
                Drag and drop your medical image here
              </h3>
              <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
                Supports standard formats: <strong>JPG, JPEG, PNG</strong>, and converted <strong>DICOM (.dcm)</strong> slices up to 25 MB.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Browse Files
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    startCamera();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" /> Capture / Scan Image
                </button>
              </div>
            </div>

            {/* Clinical Sample Presets */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Or select a verified clinical test scan:
                </span>
                <span className="text-[11px] text-slate-400">1-click demo evaluation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className="flex items-center gap-3 p-3 text-left rounded-xl border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/40 transition-all group cursor-pointer"
                  >
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-900 shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 group-hover:text-cyan-800 truncate">
                        {preset.title}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {preset.description}
                      </div>
                      <div className="text-[10px] font-mono text-cyan-700 font-semibold mt-0.5">
                        {preset.modality.toUpperCase()} • {preset.size}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* File Preview & Metadata Configuration */
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900">Medical Image Loaded</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Replace Scan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Preview Box */}
              <div className="space-y-2">
                <div className="relative aspect-square bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-slate-300 shadow-inner">
                  <img
                    src={selectedFile.dataUrl}
                    alt="Scan Preview"
                    className="max-h-full max-w-full object-contain rounded"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] p-2 rounded-lg truncate">
                    {selectedFile.name}
                  </div>
                </div>

                {/* Metadata tags */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">File Format</span>
                    <span className="font-semibold text-slate-700 truncate block">{selectedFile.format}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">File Size</span>
                    <span className="font-semibold text-slate-700">{selectedFile.size}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Loaded Timestamp</span>
                    <span className="font-mono text-slate-600 text-[11px]">{selectedFile.uploadDate}</span>
                  </div>
                </div>
              </div>

              {/* Modality & Body Part Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Medical Modality <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Determines which neural network architecture will be automatically loaded (DenseNet, EfficientNet, MobileNet).
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'chest_xray', label: 'Chest X-ray (CXR)', model: 'DenseNet-121' },
                      { id: 'brain_mri', label: 'Brain MRI', model: 'EfficientNet-B4' },
                      { id: 'skin_image', label: 'Skin / Dermoscopy', model: 'MobileNetV3' },
                      { id: 'ct_scan', label: 'CT Scan (Thorax)', model: '3D-DenseNet' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setModality(item.id as ImageModality);
                          if (item.id === 'chest_xray') setBodyPart('Chest / Lungs');
                          if (item.id === 'brain_mri') setBodyPart('Brain / Head');
                          if (item.id === 'skin_image') setBodyPart('Skin / Derm');
                          if (item.id === 'ct_scan') setBodyPart('Abdomen / Torso');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          modality === item.id
                            ? 'border-cyan-600 bg-cyan-50/70 text-cyan-950 font-bold shadow-xs ring-2 ring-cyan-500/20'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                        }`}
                      >
                        <div className="text-xs">{item.label}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Model: {item.model}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Target Anatomical Body Part <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bodyPart}
                    onChange={(e) => setBodyPart(e.target.value as BodyPart)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-hidden focus:border-cyan-500"
                  >
                    <option value="Chest / Lungs">Chest / Lungs (Thoracic Cavity)</option>
                    <option value="Brain / Head">Brain / Head (Cranial Neuropathy)</option>
                    <option value="Skin / Derm">Skin / Derm (Cutaneous Tissue)</option>
                    <option value="Abdomen / Torso">Abdomen / Torso (Thoracoabdominal)</option>
                    <option value="Spine / Musculoskeletal">Spine / Musculoskeletal</option>
                  </select>
                </div>

                {/* Preprocessing checklist summary */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1.5 text-xs text-slate-600">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-cyan-700" /> Deep Learning Preprocessing Pipeline:
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600" /> Spatial resize & bi-cubic pixel interpolation
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600" /> Z-score radiopaque normalization & windowing
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600" /> Deep layer Grad-CAM gradient accumulation
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-3 bg-gradient-to-r from-cyan-700 to-teal-600 hover:from-cyan-600 hover:to-teal-500 text-white font-black text-sm rounded-xl shadow-lg shadow-cyan-900/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> Initiate AI Disease Analysis
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
