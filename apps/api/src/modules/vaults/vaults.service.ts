import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  LuxuryVaultDto,
  ArmoredTransferDto,
  CreateArmoredTransferDto,
  UpdateTransferStatusDto,
  VaultCode,
  ArmoredCarrier,
  ArmoredTransferStatus,
  AuditEventType,
} from '@theblinghaven/shared';

@Injectable()
export class VaultsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAllVaults(): Promise<LuxuryVaultDto[]> {
    const vaults = await this.prisma.luxuryVault.findMany({
      include: {
        outgoingTransfers: { where: { transferStatus: { in: ['DISPATCH_SCHEDULED', 'ARMORED_TRANSIT', 'CUSTOMS_PORT_INSPECTION'] } } },
        incomingTransfers: { where: { transferStatus: { in: ['DISPATCH_SCHEDULED', 'ARMORED_TRANSIT', 'CUSTOMS_PORT_INSPECTION'] } } },
      },
      orderBy: { isMasterVault: 'desc' },
    });

    return vaults.map((v) => ({
      id: v.id,
      name: v.name,
      code: v.code as VaultCode,
      city: v.city,
      country: v.country,
      currencyCode: v.currencyCode,
      totalAssetValueCad: v.totalAssetValueCad,
      goldBullionKg: v.goldBullionKg,
      looseDiamondCarats: v.looseDiamondCarats,
      securityLevel: v.securityLevel,
      isMasterVault: v.isMasterVault,
      address: v.address,
      activeTransfersCount: v.outgoingTransfers.length + v.incomingTransfers.length,
    }));
  }

  async findTransfers(): Promise<ArmoredTransferDto[]> {
    const transfers = await this.prisma.armoredTransfer.findMany({
      include: {
        originVault: true,
        destinationVault: true,
      },
      orderBy: { dispatchedAt: 'desc' },
    });

    return transfers.map((t) => this.mapTransfer(t));
  }

  async createTransfer(dto: CreateArmoredTransferDto): Promise<ArmoredTransferDto> {
    const origin = await this.prisma.luxuryVault.findUnique({ where: { id: dto.originVaultId } });
    const dest = await this.prisma.luxuryVault.findUnique({ where: { id: dto.destinationVaultId } });

    if (!origin || !dest) {
      throw new NotFoundException('Origin or destination vault not found.');
    }

    const manifestSeq = Math.floor(1000 + Math.random() * 9000);
    const manifestNumber = `TBH-ARM-2026-${manifestSeq}`;
    const estArrival = new Date();
    estArrival.setHours(estArrival.getHours() + 18);

    const transfer = await this.prisma.armoredTransfer.create({
      data: {
        manifestNumber,
        originVaultId: dto.originVaultId,
        destinationVaultId: dto.destinationVaultId,
        carrierName: dto.carrierName,
        courierBadgeId: dto.courierBadgeId || `${dto.carrierName.split('_')[0]}-ESCORT-${manifestSeq}`,
        insuredValueCad: dto.insuredValueCad,
        insurancePolicyNumber: `LLOYDS-LONDON-VAL-${manifestSeq + 100}`,
        transferStatus: 'DISPATCH_SCHEDULED',
        itemsCount: dto.itemsCount,
        itemsSummary: dto.itemsSummary,
        currentWaypoint: `${origin.city} Armored Logistics Staging Bay`,
        dispatchedAt: new Date(),
        estimatedArrivalAt: estArrival,
        notes: dto.notes || 'Inter-vault bullion and high-jewelry allocation rebalance.',
      },
      include: {
        originVault: true,
        destinationVault: true,
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.ORDER_STATUS_CHANGED,
      userEmail: 'admin@theblinghaven.shop',
      resourceType: 'ArmoredTransfer',
      resourceId: transfer.id,
      metadata: {
        manifestNumber: transfer.manifestNumber,
        origin: origin.name,
        destination: dest.name,
        insuredValueCad: dto.insuredValueCad,
      },
    });

    return this.mapTransfer(transfer);
  }

  async updateTransferStatus(id: string, dto: UpdateTransferStatusDto): Promise<ArmoredTransferDto> {
    const existing = await this.prisma.armoredTransfer.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Armored transfer manifest not found.');
    }

    const updated = await this.prisma.armoredTransfer.update({
      where: { id },
      data: {
        transferStatus: dto.transferStatus,
        currentWaypoint: dto.currentWaypoint || existing.currentWaypoint,
        completedAt: dto.transferStatus === 'ARRIVED_SECURE' ? new Date() : undefined,
      },
      include: {
        originVault: true,
        destinationVault: true,
      },
    });

    return this.mapTransfer(updated);
  }

  async deleteTransfer(id: string): Promise<{ success: boolean; message: string }> {
    const existing = await this.prisma.armoredTransfer.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Armored transfer not found.');
    await this.prisma.armoredTransfer.delete({ where: { id } });
    return { success: true, message: `Armored transfer manifest #${existing.manifestNumber} removed.` };
  }

  private mapTransfer(t: any): ArmoredTransferDto {
    return {
      id: t.id,
      manifestNumber: t.manifestNumber,
      originVaultId: t.originVaultId,
      originVaultName: t.originVault?.name || 'Origin Vault',
      destinationVaultId: t.destinationVaultId,
      destinationVaultName: t.destinationVault?.name || 'Destination Vault',
      carrierName: t.carrierName as ArmoredCarrier,
      courierBadgeId: t.courierBadgeId,
      insuredValueCad: t.insuredValueCad,
      insurancePolicyNumber: t.insurancePolicyNumber,
      transferStatus: t.transferStatus as ArmoredTransferStatus,
      itemsCount: t.itemsCount,
      itemsSummary: t.itemsSummary,
      currentWaypoint: t.currentWaypoint,
      dispatchedAt: t.dispatchedAt.toISOString(),
      estimatedArrivalAt: t.estimatedArrivalAt.toISOString(),
      completedAt: t.completedAt ? t.completedAt.toISOString() : undefined,
      notes: t.notes || undefined,
    };
  }
}
