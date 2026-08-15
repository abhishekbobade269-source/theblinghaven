export type TicketCategory =
  | 'PRODUCT_INQUIRY'
  | 'ORDER_SHIPMENT'
  | 'GEMOLOGY_CERTIFICATE'
  | 'BESPOKE_CUSTOM'
  | 'SALON_APPOINTMENT'
  | 'VAULT_STORAGE'
  | 'OTHER';

export type TicketPriority = 'STANDARD' | 'PRIORITY' | 'URGENT_VIP';

export type TicketStatus =
  | 'OPEN'
  | 'IN_REVIEW'
  | 'WAITING_CLIENT'
  | 'RESOLVED'
  | 'CLOSED';

export interface TicketResponseDto {
  id: string;
  ticketId: string;
  senderRole: 'CLIENT' | 'SUPPORT_AGENT';
  senderName: string;
  message: string;
  isInternalNote: boolean;
  timestamp: string;
}

export interface SupportTicketDto {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  description: string;
  relatedOrderNumber?: string;
  relatedProductSku?: string;
  assignedAgent?: string;
  staffNotes?: string;
  responses: TicketResponseDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketDto {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  category: TicketCategory;
  priority?: TicketPriority;
  subject: string;
  description: string;
  relatedOrderNumber?: string;
  relatedProductSku?: string;
}

export interface AddTicketResponseDto {
  senderRole: 'CLIENT' | 'SUPPORT_AGENT';
  senderName: string;
  message: string;
  isInternalNote?: boolean;
  statusUpdate?: TicketStatus;
}

export interface UpdateTicketStatusDto {
  status: TicketStatus;
  assignedAgent?: string;
  staffNotes?: string;
}
