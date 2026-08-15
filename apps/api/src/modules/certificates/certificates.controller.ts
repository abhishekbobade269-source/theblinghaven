import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions, CurrentUser, Public } from '../../common/decorators';
import {
  Permission,
  CreateCertificateDto,
  TransferCertificateOwnershipDto,
} from '@theblinghaven/shared';

@ApiTags('Cryptographic Certificates & Provenance Ledger')
@Controller()
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  // -------------------------------------------------------------
  // PUBLIC DIGITAL PASSPORT VERIFICATION
  // -------------------------------------------------------------
  @Public()
  @Get('certificates/verify/:certNumber')
  @ApiOperation({ summary: 'Verify high-jewelry certificate of authenticity with cryptographic hash validation' })
  async verifyCertificate(@Param('certNumber') certNumber: string) {
    return this.certificatesService.verifyCertificate(certNumber);
  }

  // -------------------------------------------------------------
  // ADMIN CERTIFICATE STUDIO & PROVENANCE LEDGER
  // -------------------------------------------------------------
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/certificates')
  @RequirePermissions(Permission.CATALOG_READ)
  @ApiOperation({ summary: 'List all certificates in the Maison Provenance Vault' })
  async getAdminCertificates(@Query('q') q?: string) {
    return this.certificatesService.findAll(q);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/certificates/:id')
  @RequirePermissions(Permission.CATALOG_READ)
  @ApiOperation({ summary: 'Get certificate details by ID' })
  async getAdminCertificateById(@Param('id') id: string) {
    return this.certificatesService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('admin/certificates')
  @RequirePermissions(Permission.CATALOG_WRITE)
  @ApiOperation({ summary: 'Mint a new cryptographic Certificate of Authenticity' })
  async createCertificate(
    @Body() dto: CreateCertificateDto,
    @CurrentUser('id') actorId: string,
    @CurrentUser('email') actorEmail: string,
  ) {
    return this.certificatesService.createCertificate(dto, actorId, actorEmail);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('admin/certificates/:id/transfer')
  @RequirePermissions(Permission.CUSTOMERS_WRITE)
  @ApiOperation({ summary: 'Transfer certificate ownership to a VIP client' })
  async transferOwnership(
    @Param('id') id: string,
    @Body() dto: TransferCertificateOwnershipDto,
    @CurrentUser('id') actorId: string,
    @CurrentUser('email') actorEmail: string,
  ) {
    return this.certificatesService.transferOwnership(id, dto, actorId, actorEmail);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('admin/certificates/:id')
  @RequirePermissions(Permission.CATALOG_WRITE)
  @ApiOperation({ summary: 'Permanently delete or revoke a certificate' })
  async deleteCertificate(@Param('id') id: string) {
    return this.certificatesService.deleteCertificate(id);
  }
}
