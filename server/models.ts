import { ModelInfo } from '../src/types';

export const AI_MODELS: ModelInfo[] = [
  {
    id: 'cxr-densenet-v2',
    name: 'ChexNet-DenseNet121',
    architecture: 'DenseNet-121 with Multi-label BCE Transfer Learning',
    version: 'v2.4.1',
    modality: 'chest_xray',
    supportedConditions: [
      'Pneumonia',
      'Tuberculosis (TB)',
      'Cardiomegaly',
      'Pleural Effusion',
      'Atelectasis',
      'Pneumothorax',
      'Normal Findings'
    ],
    accuracy: 94.8,
    sensitivity: 93.4,
    specificity: 95.7,
    dataset: 'NIH ChestX-ray14 (112,120 scans) & Stanford CheXpert',
    lastUpdated: '2026-06-15',
    status: 'active'
  },
  {
    id: 'mri-efficientnet-b4',
    name: 'NeuroScan-EfficientNetB4',
    architecture: 'EfficientNet-B4 + Axial Attention Feature Extractor',
    version: 'v3.1.0',
    modality: 'brain_mri',
    supportedConditions: [
      'Glioma',
      'Meningioma',
      'Pituitary Tumor',
      'Vascular Abnormality',
      'Normal Brain MRI'
    ],
    accuracy: 96.2,
    sensitivity: 95.8,
    specificity: 96.9,
    dataset: 'BraTS 2023 & Figshare Brain Tumor Dataset',
    lastUpdated: '2026-07-20',
    status: 'active'
  },
  {
    id: 'derm-mobilenet-v3',
    name: 'DermaVision-MobileNetV3',
    architecture: 'MobileNetV3-Large + Squeeze-and-Excitation Layers',
    version: 'v1.9.2',
    modality: 'skin_image',
    supportedConditions: [
      'Melanoma (Malignant)',
      'Basal Cell Carcinoma',
      'Benign Melanocytic Nevus',
      'Actinic Keratosis',
      'Seborrheic Keratosis',
      'Normal Dermatological Tissue'
    ],
    accuracy: 93.6,
    sensitivity: 92.1,
    specificity: 94.8,
    dataset: 'ISIC Archive 2024 & HAM10000 Dataset',
    lastUpdated: '2026-08-01',
    status: 'active'
  },
  {
    id: 'ct-densenet3d-v1',
    name: 'PulmoCT-3DNet',
    architecture: '3D-DenseNet + Volumetric Feature Pooling',
    version: 'v2.0.4',
    modality: 'ct_scan',
    supportedConditions: [
      'Pulmonary Solitary Nodule',
      'Centrilobular Emphysema',
      'Ground-Glass Opacity',
      'Pleural Thickening',
      'Normal CT Scan'
    ],
    accuracy: 95.1,
    sensitivity: 94.2,
    specificity: 95.9,
    dataset: 'LIDC-IDRI (1,018 thoracic CT cases) & NLST',
    lastUpdated: '2026-05-30',
    status: 'active'
  }
];

export function getModelForModality(modality: string): ModelInfo {
  const model = AI_MODELS.find(m => m.modality === modality);
  return model || AI_MODELS[0];
}
