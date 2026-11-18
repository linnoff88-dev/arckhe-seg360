import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  RegisterInput,
  LoginInput,
  RefreshInput,
} from '@seg360/shared';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @UsePipes(new ZodValidationPipe(registerSchema))
  @ApiOperation({ summary: 'Registrar novo usuario' })
  async register(@Body() data: RegisterInput) {
    return this.authService.register(data);
  }

  @Post('login')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 900000 } })
  @UsePipes(new ZodValidationPipe(loginSchema))
  @ApiOperation({ summary: 'Login de usuario' })
  async login(@Body() data: LoginInput) {
    return this.authService.login(data);
  }

  @Post('refresh')
  @Public()
  @UsePipes(new ZodValidationPipe(refreshSchema))
  @ApiOperation({ summary: 'Renovar tokens' })
  async refresh(@Body() data: RefreshInput) {
    return this.authService.refresh(data.refreshToken);
  }
}
