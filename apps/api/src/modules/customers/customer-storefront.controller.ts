import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Headers,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { Public } from '../../common/decorators';

@ApiTags('Storefront Customer Profile & Auth')
@Controller('storefront/customer')
export class CustomerStorefrontController {
  constructor(private readonly customersService: CustomersService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new storefront customer with email and password' })
  async register(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phone?: string;
      country?: string;
    },
  ) {
    return this.customersService.storefrontRegister(body);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login storefront customer with email and password' })
  async login(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    return this.customersService.storefrontLogin(body.email, body.password);
  }

  @Public()
  @Post('oauth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login or Register with Google or Microsoft OAuth' })
  async oauthLogin(
    @Body()
    body: {
      provider: 'google' | 'microsoft';
      email: string;
      name: string;
      avatarUrl?: string;
      providerId?: string;
    },
  ) {
    return this.customersService.storefrontOAuthLogin(body);
  }

  @Public()
  @Get('profile')
  @ApiOperation({ summary: 'Get storefront customer profile and account details' })
  async getProfile(@Headers('authorization') authHeader?: string, @Headers('x-customer-email') emailHeader?: string) {
    return this.customersService.getStorefrontProfile(authHeader, emailHeader);
  }

  @Public()
  @Put('profile')
  @ApiOperation({ summary: 'Update storefront customer profile' })
  async updateProfile(
    @Body()
    body: {
      email: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      country?: string;
      city?: string;
      preferredCurrency?: string;
      defaultAddress?: any;
    },
    @Headers('authorization') authHeader?: string,
  ) {
    return this.customersService.updateStorefrontProfile(body);
  }

  @Public()
  @Put('password')
  @ApiOperation({ summary: 'Change storefront customer password' })
  async changePassword(
    @Body()
    body: {
      email: string;
      currentPassword?: string;
      newPassword: string;
    },
  ) {
    return this.customersService.changeStorefrontPassword(body);
  }

  @Public()
  @Post('wishlist/toggle')
  @ApiOperation({ summary: 'Toggle product in customer wishlist' })
  async toggleWishlist(
    @Body()
    body: {
      email: string;
      productId: string;
    },
  ) {
    return this.customersService.toggleWishlist(body.email, body.productId);
  }

  @Public()
  @Get('orders')
  @ApiOperation({ summary: 'Get orders placed by customer' })
  async getCustomerOrders(@Headers('x-customer-email') email?: string) {
    return this.customersService.getCustomerOrders(email);
  }

  @Public()
  @Get('coupons')
  @ApiOperation({ summary: 'Get exclusive available coupons and vouchers for customer' })
  async getCustomerCoupons(@Headers('x-customer-email') email?: string) {
    return this.customersService.getCustomerCoupons(email);
  }
}
