import { ProductDto } from './catalog';

export type AiActionType =
  | 'RECOMMEND_PRODUCT'
  | 'EXPLAIN_4CS'
  | 'BOOK_SALON'
  | 'VIRTUAL_TRY_ON'
  | 'SPOT_METAL_RATES'
  | 'GENERAL_CONSULTATION';

export interface AiConciergeQueryDto {
  query: string;
  clientEmail?: string;
  preferredCurrency?: string;
  clientCity?: string;
}

export interface AiConciergeResponseDto {
  answerText: string;
  speechText: string;
  actionType: AiActionType;
  recommendedProducts: ProductDto[];
  suggestedFollowUps: string[];
  salonLink?: string;
  tryOnSku?: string;
}

export interface AiConsultationLogDto {
  id: string;
  clientQuery: string;
  aiResponse: string;
  topicCategory: string;
  actionTriggered: string;
  timestamp: string;
}
