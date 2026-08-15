export type VaultCode =
  | 'TORONTO_YORKVILLE'
  | 'VANCOUVER_PACIFIC'
  | 'LONDON_MAYFAIR'
  | 'DUBAI_DIFC'
  | 'ZURICH_FREEPORT';

export type ArmoredCarrier =
  | 'BRINKS_GLOBAL_SERVICES'
  | 'MALCA_AMIT_SECURITY'
  | 'FERRARI_GROUP_ARMORED';

export type ArmoredTransferStatus =
  | 'DISPATCH_SCHEDULED'
  | 'ARMORED_TRANSIT'
  | 'CUSTOMS_PORT_INSPECTION'
  | 'ARRIVED_SECURE'
  | 'CANCELLED';

export interface LuxuryVaultDto {
  id: string;
  name: string;
  code: VaultCode;
  city: string;
  country: string;
  currencyCode: string;
  totalAssetValueCad: number;
  goldBullionKg: number;
  looseDiamondCarats: number;
  securityLevel: string;
  isMasterVault: boolean;
  address: string;
  activeTransfersCount: number;
}

export interface ArmoredTransferDto {
  id: string;
  manifestNumber: string;
  originVaultId: string;
  originVaultName: string;
  destinationVaultId: string;
  destinationVaultName: string;
  carrierName: ArmoredCarrier;
  courierBadgeId: string;
  insuredValueCad: number;
  insurancePolicyNumber: string;
  transferStatus: ArmoredTransferStatus;
  itemsCount: number;
  itemsSummary: string;
  currentWaypoint: string;
  dispatchedAt: string;
  estimatedArrivalAt: string;
  completedAt?: string;
  notes?: string;
}

export interface CreateArmoredTransferDto {
  originVaultId: string;
  destinationVaultId: string;
  carrierName: ArmoredCarrier;
  courierBadgeId?: string;
  insuredValueCad: number;
  itemsCount: number;
  itemsSummary: string;
  notes?: string;
}

export interface UpdateTransferStatusDto {
  transferStatus: ArmoredTransferStatus;
  currentWaypoint?: string;
}
