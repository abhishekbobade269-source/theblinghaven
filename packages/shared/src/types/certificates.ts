export type GemstoneLaboratory =
  | 'GIA_GEMOLOGICAL_INSTITUTE_OF_AMERICA'
  | 'IGI_INTERNATIONAL_GEMOLOGICAL_INSTITUTE'
  | 'HRD_ANTWERP'
  | 'AGS_AMERICAN_GEM_SOCIETY'
  | 'BIS_GOVERNMENT_OF_INDIA';

export interface OwnershipTransferRecord {
  timestamp: string;
  fromOwner: string;
  toOwner: string;
  transferReason: string;
  actorEmail: string;
  transactionHash?: string;
}

export interface CertificateDto {
  id: string;
  certificateNumber: string; // e.g. TBH-CERT-2026-9042
  productId?: string;
  orderId?: string;
  sku: string;
  productTitle: string;
  gemstoneReportNumber: string; // GIA dossier number
  gemstoneLaboratory: GemstoneLaboratory;
  caratWeight: number;
  colorGrade: string; // D, E, F, G, Fancy Vivid Yellow
  clarityGrade: string; // FL, IF, VVS1, VVS2, VS1
  cutGrade: string; // Triple Excellent, Ideal Hearts & Arrows
  polishGrade: string;
  symmetryGrade: string;
  fluorescence: string; // None, Faint, Medium Blue
  metalType: string; // 18K White Gold, Platinum Pt950, 22K Solid Gold
  metalPurity: string; // AU 750, PT 950, AU 916
  grossWeightGrams: number;
  netGoldWeightGrams: number;
  bisHallmarkStamp: string; // BIS 916 HUID-882910
  cryptographicHash: string; // SHA-256 tamper-proof hash
  qrVerificationUrl: string;
  issuedAt: string;
  ownerName: string;
  transferHistory: OwnershipTransferRecord[];
  isRevoked: boolean;
  notes?: string;
}

export interface CreateCertificateDto {
  productId?: string;
  orderId?: string;
  sku: string;
  productTitle: string;
  gemstoneReportNumber: string;
  gemstoneLaboratory: GemstoneLaboratory;
  caratWeight: number;
  colorGrade: string;
  clarityGrade: string;
  cutGrade: string;
  polishGrade?: string;
  symmetryGrade?: string;
  fluorescence?: string;
  metalType: string;
  metalPurity: string;
  grossWeightGrams: number;
  netGoldWeightGrams: number;
  bisHallmarkStamp: string;
  ownerName?: string;
  notes?: string;
}

export interface TransferCertificateOwnershipDto {
  newOwnerName: string;
  newOwnerEmail?: string;
  transferReason: string;
}

export interface CertificateVerificationResultDto {
  isValid: boolean;
  isTamperEvidentMatch: boolean;
  certificate: CertificateDto;
  verificationMessage: string;
  verifiedAt: string;
}
