import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Perfil do usuario logado' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualizar perfil' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() data: { name?: string; phone?: string },
  ) {
    return this.userService.updateProfile(userId, data);
  }
}
