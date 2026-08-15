export type StockChangeType =
  | 'INITIAL_STOCK'
  | 'RESTOCK'
  | 'AUDIT_RECOUNT'
  | 'RESERVATION'
  | 'SALE_DEDUCTION'
  | 'RETURN_RESTOCK'
  | 'DAMAGE_WRITE_OFF';

export interface InventoryItemDto {
  productId: string;
  sku: string;
  title: string;
  primaryImageUrl: string;
  categoryName?: string;
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  vaultLocation: string;
  isLowStock: boolean;
  status: string;
  updatedAt: string;
}

export interface InventoryLogDto {
  id: string;
  productId: string;
  sku: string;
  productTitle: string;
  changeType: StockChangeType;
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  actorId?: string;
  actorEmail?: string;
  createdAt: string;
}

export interface AdjustStockDto {
  productId: string;
  changeType: StockChangeType;
  newQuantity: number;
  reason: string;
  vaultLocation?: string;
}
