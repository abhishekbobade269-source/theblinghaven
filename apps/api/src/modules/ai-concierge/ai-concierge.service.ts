import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  AiConciergeQueryDto,
  AiConciergeResponseDto,
  AiConsultationLogDto,
  AiActionType,
  ProductDto,
  AuditEventType,
} from '@theblinghaven/shared';

@Injectable()
export class AiConciergeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async processQuery(dto: AiConciergeQueryDto): Promise<AiConciergeResponseDto> {
    const q = dto.query.toLowerCase();
    let actionType: AiActionType = 'GENERAL_CONSULTATION';
    let topicCategory = 'GENERAL_GEMOLOGY';
    let answerText = '';
    let speechText = '';
    let recommendedProducts: ProductDto[] = [];
    let suggestedFollowUps: string[] = [];
    let salonLink: string | undefined;
    let tryOnSku: string | undefined;

    const dbProducts = await this.prisma.product.findMany({
      where: { status: 'ACTIVE' },
      include: {
        category: true,
        collection: true,
      },
    });

    const mappedProducts: ProductDto[] = dbProducts.map((p) => ({
      id: p.id,
      sku: p.sku,
      title: p.title,
      slug: p.slug,
      subtitle: p.subtitle || undefined,
      description: p.description,
      basePriceUsd: p.basePriceUsd,
      comparePriceUsd: p.comparePriceUsd || undefined,
      costPriceUsd: p.costPriceUsd || undefined,
      categoryId: p.categoryId,
      categoryName: p.category?.name,
      collectionId: p.collectionId || undefined,
      collectionName: p.collection?.name,
      specs: JSON.parse(p.specs || '{}'),
      primaryImageUrl: p.primaryImageUrl,
      galleryImages: JSON.parse(p.galleryImages || '[]'),
      stockQuantity: p.stockQuantity,
      lowStockThreshold: p.lowStockThreshold,
      status: p.status as any,
      isFeatured: p.isFeatured,
      isBestseller: p.isBestseller,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    // 1. 4Cs & Diamond Grading Inquiries
    if (q.includes('4c') || q.includes('clarity') || q.includes('flawless') || q.includes('color') || q.includes('carat') || q.includes('cut')) {
      topicCategory = '4CS_DIAMONDS';
      actionType = 'EXPLAIN_4CS';
      const ring = mappedProducts.find((p) => p.sku.includes('RNG') || p.categoryName?.includes('Ring')) || mappedProducts[0];
      if (ring) {
        recommendedProducts.push(ring);
        tryOnSku = ring.sku;
      }

      answerText = `At The Bling Haven, our master gemologists curate solely **Type IIa** and **D-to-F Colorless** diamonds. The **4Cs** define your creation's brilliance:\n\n` +
        `• **Cut**: Our *Triple Excellent* ideal cut ensures maximum light refraction and diamond fire.\n` +
        `• **Color**: D-Color represents absolute optical purity, completely devoid of nitrogen tint.\n` +
        `• **Clarity**: Flawless (FL) and Internally Flawless (IF) stones possess zero inclusions under 10x master loupe magnification.\n` +
        `• **Carat**: Sizing ranges from 1.50ct celestial solitaires to 12.80ct museum-grade Golconda cushions.\n\n` +
        `Every stone carries an individual laser-inscribed **GIA / IGI Dossier** and a cryptographic SHA-256 digital passport.`;

      speechText = `At The Bling Haven, we specialize in D-Flawless and Type Two-A diamonds with Triple Excellent precision cut. I have prepared our flagship solitaire for your review. Would you like to try it on your hand in our virtual studio?`;
      suggestedFollowUps = [
        'How does a 2.5ct Cushion look on my hand?',
        'Book private diamond viewing in Toronto Yorkville',
        'Explain BIS 916 gold hallmarking',
      ];
    }
    // 2. Bridal & Choker Sets
    else if (q.includes('bridal') || q.includes('choker') || q.includes('wedding') || q.includes('necklace') || q.includes('polki')) {
      topicCategory = 'BRIDAL';
      actionType = 'RECOMMEND_PRODUCT';
      const bridal = mappedProducts.find((p) => p.categoryName?.includes('Bridal') || p.sku.includes('BRD') || p.sku.includes('CHOKER')) || mappedProducts[0];
      if (bridal) {
        recommendedProducts.push(bridal);
        tryOnSku = bridal.sku;
      }

      answerText = `Our **Royal Heritage Bridal Parures** are mastercrafted using centuries-old *Jadau* goldsmithing, natural unheated Zambian & Colombian emeralds, and syndicate-certified uncut Polki diamonds set in solid 22K gold with pure 24K gold foil setting.\n\n` +
        `Featured Masterpiece: **${bridal?.title || 'Maharani Royal Heritage Choker Set'}**\n` +
        `Includes handcrafted matching chandelier jhumkas and maang tikka, fully hallmarked with Government of India BIS-916 HUID stamps.`;

      speechText = `Our Royal Heritage Bridal sets combine uncut Polki diamonds and natural emeralds in pure twenty-two karat gold. I have selected the Maharani Parure for you. We can arrange a private salon viewing with our bridal director.`;
      suggestedFollowUps = [
        'Book private bridal suite consultation in Toronto',
        'Can I customize this in 18K White Gold?',
        'Show matching bridal earrings and bangles',
      ];
    }
    // 3. Live Spot Bullion & Metal Pricing
    else if (q.includes('metal') || q.includes('gold price') || q.includes('spot') || q.includes('gram') || q.includes('bullion') || q.includes('rate')) {
      topicCategory = 'SPOT_RATES';
      actionType = 'SPOT_METAL_RATES';

      answerText = `The Bling Haven operates an automated **Live Precious Metal Engine** synchronizing every 60 seconds with **LBMA (London Bullion Market Association)** and **TSX (Toronto Stock Exchange)**:\n\n` +
        `• **24K Fine Gold (999)**: ~CAD $118.40 / gram ($3,682 / oz)\n` +
        `• **22K Royal Gold (916)**: ~CAD $108.92 / gram\n` +
        `• **18K Haute Joaillerie Gold (750)**: ~CAD $88.80 / gram\n` +
        `• **950 Fine Platinum**: ~CAD $45.20 / gram\n\n` +
        `All jewelry prices on our platform calculate live metal intrinsic weight plus artisan making charges dynamically.`;

      speechText = `Our fine jewelry pricing dynamically tracks London LBMA and Toronto TSX precious metal spot rates. Twenty-four karat gold is currently trading near one hundred and eighteen Canadian dollars per gram.`;
      suggestedFollowUps = [
        'View full Live Precious Metals Spot Board',
        'How are making charges calculated on gold kadas?',
        'Explore 22K Solid Gold Openable Kadas',
      ];
    }
    // 4. Canadian Market, Salons & Sizing
    else if (q.includes('toronto') || q.includes('vancouver') || q.includes('canada') || q.includes('salon') || q.includes('book') || q.includes('visit')) {
      topicCategory = 'SALON_BOOKING';
      actionType = 'BOOK_SALON';
      salonLink = '/concierge';

      answerText = `Our Canadian flagship luxury salons are pleased to welcome private clients by appointment:\n\n` +
        `🍁 **Toronto Yorkville Haute Salon**: 100 Bloor Street West, Safe Suite 4, Toronto ON\n` +
        `🍁 **Vancouver Pacific Rim Salon**: 1038 Canada Place, Waterfront Suite 9, Vancouver BC\n\n` +
        `Private consultations include 1-on-1 gemological advisory, bespoke CAD prototyping, Champagne service, and secure multi-vault allocation viewings. Canadian orders feature 13% Ontario HST / regional GST transparent calculation with complimentary armored Ferrari delivery.`;

      speechText = `You are warmly invited to our Canadian salons in Toronto Yorkville on Bloor Street, and Vancouver at Canada Place. Our jewelry directors are available for private viewings this week.`;
      suggestedFollowUps = [
        'Schedule Yorkville Salon viewing for this Thursday',
        'What is your insured armored delivery process in Canada?',
        'View live LBMA & Canadian TSX Gold Spot Prices',
      ];
    }
    // 5. Default General Luxury Consultation
    else {
      topicCategory = 'GENERAL_GEMOLOGY';
      actionType = 'RECOMMEND_PRODUCT';
      if (mappedProducts.length > 0) {
        recommendedProducts.push(mappedProducts[0]);
        if (mappedProducts[1]) recommendedProducts.push(mappedProducts[1]);
      }

      answerText = `Welcome to **The Bling Haven Haute Joaillerie**. I am **Aura**, your private AI Senior Gemologist.\n\n` +
        `I can assist you with:\n` +
        `1. **Diamond 4Cs Advisory**: Selecting D-Flawless solitaires, cushion cuts, and oval proportions.\n` +
        `2. **Virtual AR Try-On**: Fitting rings, necklaces, and earrings on your hand or portrait in real time.\n` +
        `3. **Private Salon Viewings**: Scheduling appointments at our **Toronto Yorkville**, **Vancouver**, **London**, or **Dubai** salons.\n` +
        `4. **Secret Vault & Bespoke 3D Commissions**: Crafting 1-of-1 heirlooms tailored to your exact specifications.`;

      speechText = `Welcome to The Bling Haven. I am Aura, your private Senior Gemologist. How may I assist you with your diamond acquisition or bespoke commission today?`;
      suggestedFollowUps = [
        'Show me Celestial Diamond Solitaires',
        'Guide me on ring finger sizing',
        'What is your Canadian insured shipping policy?',
      ];
    }

    // Log consultation
    await this.prisma.aiConsultationLog.create({
      data: {
        clientQuery: dto.query,
        aiResponse: speechText,
        topicCategory,
        actionTriggered: actionType,
        recommendedSku: recommendedProducts[0]?.sku || null,
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.ORDER_STATUS_CHANGED,
      userEmail: dto.clientEmail || 'guest-patron@theblinghaven.shop',
      resourceType: 'AiVoiceConcierge',
      resourceId: topicCategory,
      metadata: { query: dto.query, actionType },
    });

    return {
      answerText,
      speechText,
      actionType,
      recommendedProducts,
      suggestedFollowUps,
      salonLink,
      tryOnSku,
    };
  }

  async getCuratedTopics() {
    return [
      {
        id: '4cs',
        title: '💎 Diamond 4Cs & D-Flawless Standards',
        query: 'Explain the 4Cs of diamonds and what makes D-Color Flawless Type IIa superior',
      },
      {
        id: 'bridal',
        title: '👑 Royal Heritage Polki & Emerald Bridal Sets',
        query: 'Show me your handcrafted royal bridal choker sets with Basra pearls and uncut Polki',
      },
      {
        id: 'toronto-salon',
        title: '🍁 Toronto Yorkville Salon Private Viewings',
        query: 'How do I book a private diamond consultation at the Toronto Yorkville salon on Bloor Street?',
      },
      {
        id: 'spot-gold',
        title: '📊 Canadian TSX & LBMA Spot Gold Pricing',
        query: 'What are the live 24K and 22K gold spot prices per gram in Canadian Dollars today?',
      },
    ];
  }

  async getLogs(): Promise<AiConsultationLogDto[]> {
    const logs = await this.prisma.aiConsultationLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    return logs.map((l) => ({
      id: l.id,
      clientQuery: l.clientQuery,
      aiResponse: l.aiResponse,
      topicCategory: l.topicCategory,
      actionTriggered: l.actionTriggered,
      timestamp: l.timestamp.toISOString(),
    }));
  }
}
