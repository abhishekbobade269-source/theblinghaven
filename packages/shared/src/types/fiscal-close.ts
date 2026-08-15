export type FiscalCloseStatus =
  | 'DRAFT_PENDING_AUDIT'
  | 'RECONCILED'
  | 'EXECUTIVE_CERTIFIED'
  | 'DISCREPANCY_FLAGGED';

export interface FiscalCloseRecordDto {
  id: string;
  fiscalDate: string; // YYYY-MM-DD
  status: FiscalCloseStatus;
  grossSalesCad: number;
  netRevenueCad: number;
  ordersCount: number;
  taxesCollectedCad: number;
  ontarioHstCad: number;
  internationalTaxCad: number;
  vaultInventoryValuationCad: number;
  goldBullionKgStock: number;
  diamondCaratsStock: number;
  armoredTransitValueCad: number;
  discrepancyAmountCad: number;
  certifiedByAuditor?: string;
  certifiedAt?: string;
  auditNotes?: string;
  cryptoLedgerHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface CertifyFiscalCloseDto {
  auditorEmail: string;
  auditorNotes?: string;
  signatureCode?: string;
}

export interface GenerateFiscalCloseDto {
  fiscalDate?: string;
}
