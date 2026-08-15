export type InquiryType =
  | 'BESPOKE_CUSTOM_CREATION'
  | 'PRIVATE_SALON_APPOINTMENT'
  | 'GEMSTONE_SOURCING_INQUIRY'
  | 'APPRAISAL_CERTIFICATION_REQUEST'
  | 'GENERAL_CONCIERGE';

export type InquiryStatus =
  | 'NEW'
  | 'IN_REVIEW_BY_GEMOLOGIST'
  | 'APPOINTMENT_SCHEDULED'
  | 'QUOTATION_DISPATCHED'
  | 'RESOLVED'
  | 'CLOSED';

export interface ConciergeInquiryDto {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  vipTier?: string;
  type: InquiryType;
  status: InquiryStatus;
  subject: string;
  message: string;
  preferredSalonLocation?: string; // London Mayfair, Dubai Flagship, Virtual
  preferredAppointmentDate?: string;
  assignedAdvisor?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInquiryDto {
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  type: InquiryType;
  subject: string;
  message: string;
  preferredSalonLocation?: string;
  preferredAppointmentDate?: string;
}

export interface UpdateInquiryDto {
  status?: InquiryStatus;
  assignedAdvisor?: string;
  internalNotes?: string;
  preferredAppointmentDate?: string;
}
