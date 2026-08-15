import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  VipMemberDto,
  SecretVaultDropDto,
  VipChatMessageDto,
  SendVipMessageDto,
  ReplyVipMessageDto,
  ReserveVaultDropDto,
  VipTier,
  VaultAllocationStatus,
  AuditEventType,
} from '@theblinghaven/shared';

@Injectable()
export class VipService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async authenticateVip(invitationKey: string): Promise<VipMemberDto> {
    const member = await this.prisma.vipMember.findUnique({
      where: { invitationKey: invitationKey.trim().toUpperCase() },
    });

    if (!member || !member.isActive) {
      throw new UnauthorizedException('Invalid or expired VIP Invitation Key.');
    }

    await this.auditService.log({
      eventType: AuditEventType.AUTH_LOGIN_SUCCESS,
      userEmail: member.email,
      resourceType: 'VipLoungeGate',
      resourceId: member.id,
      metadata: { tier: member.tier, salon: member.preferredSalon },
    });

    return this.mapMember(member);
  }

  async deleteMember(id: string): Promise<{ success: boolean; message: string }> {
    const existing = await this.prisma.vipMember.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('VIP Member not found.');
    await this.prisma.vipMember.delete({ where: { id } });
    return { success: true, message: `VIP Member ${existing.name} removed.` };
  }

  async deleteSecretDrop(id: string): Promise<{ success: boolean; message: string }> {
    const existing = await this.prisma.secretVaultDrop.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Secret Drop not found.');
    await this.prisma.secretVaultDrop.delete({ where: { id } });
    return { success: true, message: `Secret Drop ${existing.title} removed.` };
  }

  async findSecretDrops(tier?: string): Promise<SecretVaultDropDto[]> {
    const drops = await this.prisma.secretVaultDrop.findMany({
      orderBy: { priceCad: 'desc' },
    });

    return drops.map((d) => ({
      id: d.id,
      sku: d.sku,
      title: d.title,
      tagline: d.tagline,
      description: d.description,
      gemstoneDetails: d.gemstoneDetails,
      metalDetails: d.metalDetails,
      priceCad: d.priceCad,
      vaultLocation: d.vaultLocation,
      allocationStatus: d.allocationStatus as VaultAllocationStatus,
      accessTierRequired: d.accessTierRequired as VipTier,
      dropEndTimestamp: d.dropEndTimestamp.toISOString(),
      primaryImageUrl: d.primaryImageUrl,
      galleryImages: JSON.parse(d.galleryImages || '[]'),
    }));
  }

  async reserveVaultDrop(dto: ReserveVaultDropDto): Promise<SecretVaultDropDto> {
    const drop = await this.prisma.secretVaultDrop.findUnique({ where: { id: dto.dropId } });
    if (!drop) {
      throw new NotFoundException('Secret Vault Creation not found.');
    }

    const updated = await this.prisma.secretVaultDrop.update({
      where: { id: dto.dropId },
      data: { allocationStatus: 'RESERVED_ON_HOLD' },
    });

    // Auto-create chat message to the director
    await this.prisma.vipChatMessage.create({
      data: {
        clientEmail: dto.clientEmail,
        clientName: dto.clientName,
        senderRole: 'CLIENT',
        senderName: dto.clientName,
        message: `[VAULT ACQUISITION REQUEST] I would like to place an acquisition hold on "${drop.title}" (${drop.sku}) for private viewing at ${dto.preferredSalon}.`,
        salonLocation: dto.preferredSalon,
        isRead: false,
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.ORDER_STATUS_CHANGED,
      userEmail: dto.clientEmail,
      resourceType: 'SecretVaultDrop',
      resourceId: drop.id,
      metadata: { sku: drop.sku, clientName: dto.clientName, priceCad: drop.priceCad },
    });

    return {
      id: updated.id,
      sku: updated.sku,
      title: updated.title,
      tagline: updated.tagline,
      description: updated.description,
      gemstoneDetails: updated.gemstoneDetails,
      metalDetails: updated.metalDetails,
      priceCad: updated.priceCad,
      vaultLocation: updated.vaultLocation,
      allocationStatus: updated.allocationStatus as VaultAllocationStatus,
      accessTierRequired: updated.accessTierRequired as VipTier,
      dropEndTimestamp: updated.dropEndTimestamp.toISOString(),
      primaryImageUrl: updated.primaryImageUrl,
      galleryImages: JSON.parse(updated.galleryImages || '[]'),
    };
  }

  async getChatHistory(clientEmail: string): Promise<VipChatMessageDto[]> {
    const messages = await this.prisma.vipChatMessage.findMany({
      where: { clientEmail },
      orderBy: { timestamp: 'asc' },
    });

    return messages.map((m) => ({
      id: m.id,
      clientEmail: m.clientEmail,
      clientName: m.clientName,
      senderRole: m.senderRole as any,
      senderName: m.senderName,
      message: m.message,
      salonLocation: m.salonLocation,
      timestamp: m.timestamp.toISOString(),
      isRead: m.isRead,
    }));
  }

  async sendClientMessage(dto: SendVipMessageDto): Promise<VipChatMessageDto> {
    const msg = await this.prisma.vipChatMessage.create({
      data: {
        clientEmail: dto.clientEmail,
        clientName: dto.clientName,
        senderRole: 'CLIENT',
        senderName: dto.clientName,
        message: dto.message,
        salonLocation: dto.salonLocation || 'Toronto Yorkville Haute Salon (100 Bloor St W)',
        isRead: false,
      },
    });

    return {
      id: msg.id,
      clientEmail: msg.clientEmail,
      clientName: msg.clientName,
      senderRole: 'CLIENT',
      senderName: msg.senderName,
      message: msg.message,
      salonLocation: msg.salonLocation,
      timestamp: msg.timestamp.toISOString(),
      isRead: msg.isRead,
    };
  }

  async sendAdvisorReply(dto: ReplyVipMessageDto): Promise<VipChatMessageDto> {
    const lastMsg = await this.prisma.vipChatMessage.findFirst({
      where: { clientEmail: dto.clientEmail },
      orderBy: { timestamp: 'desc' },
    });

    const msg = await this.prisma.vipChatMessage.create({
      data: {
        clientEmail: dto.clientEmail,
        clientName: lastMsg?.clientName || 'VIP Patron',
        senderRole: 'ADVISOR',
        senderName: dto.advisorName,
        message: dto.message,
        salonLocation: lastMsg?.salonLocation || 'Toronto Yorkville Haute Salon (100 Bloor St W)',
        isRead: true,
      },
    });

    return {
      id: msg.id,
      clientEmail: msg.clientEmail,
      clientName: msg.clientName,
      senderRole: 'ADVISOR',
      senderName: msg.senderName,
      message: msg.message,
      salonLocation: msg.salonLocation,
      timestamp: msg.timestamp.toISOString(),
      isRead: msg.isRead,
    };
  }

  async findAllMembers(): Promise<VipMemberDto[]> {
    const members = await this.prisma.vipMember.findMany({
      orderBy: { totalSpendCad: 'desc' },
    });
    return members.map((m) => this.mapMember(m));
  }

  async mintSecretDrop(dto: any): Promise<SecretVaultDropDto> {
    const end = new Date();
    end.setDate(end.getDate() + (dto.durationDays || 7));

    const drop = await this.prisma.secretVaultDrop.create({
      data: {
        sku: dto.sku,
        title: dto.title,
        tagline: dto.tagline || '1-OF-1 MAISON RESERVE VAULT PIECE',
        description: dto.description,
        gemstoneDetails: dto.gemstoneDetails,
        metalDetails: dto.metalDetails,
        priceCad: dto.priceCad,
        vaultLocation: dto.vaultLocation || 'Toronto Reserve Vault',
        allocationStatus: 'AVAILABLE',
        accessTierRequired: dto.accessTierRequired || 'ROYAL_TIER',
        dropEndTimestamp: end,
        primaryImageUrl: dto.primaryImageUrl,
        galleryImages: JSON.stringify(dto.galleryImages || []),
      },
    });

    return {
      id: drop.id,
      sku: drop.sku,
      title: drop.title,
      tagline: drop.tagline,
      description: drop.description,
      gemstoneDetails: drop.gemstoneDetails,
      metalDetails: drop.metalDetails,
      priceCad: drop.priceCad,
      vaultLocation: drop.vaultLocation,
      allocationStatus: drop.allocationStatus as any,
      accessTierRequired: drop.accessTierRequired as any,
      dropEndTimestamp: drop.dropEndTimestamp.toISOString(),
      primaryImageUrl: drop.primaryImageUrl,
      galleryImages: JSON.parse(drop.galleryImages || '[]'),
    };
  }

  private mapMember(m: any): VipMemberDto {
    return {
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone || undefined,
      invitationKey: m.invitationKey,
      tier: m.tier as VipTier,
      assignedAdvisor: m.assignedAdvisor,
      preferredSalon: m.preferredSalon,
      totalSpendCad: m.totalSpendCad,
      joinedAt: m.joinedAt.toISOString(),
    };
  }
}
