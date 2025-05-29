import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { AbstractUserService } from './abstractions/user-service.abstraction';
import { GetUserFromReq } from '../../decorators/get-user.decorator';
import { User } from '@prisma/client';
import { GetUserInfoResponse } from './responses/get-user-info.response';

@Controller('user')
export class UserController {
  constructor (private readonly userService: AbstractUserService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-user-info')
  async getUserInfo (@GetUserFromReq() user: User): Promise<GetUserInfoResponse> {
    const foundUser = await this.userService.findById(user.id);
    return {
      id: foundUser.id,
      email: foundUser.email,
      apiKey: foundUser.apiKey,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-api-key')
  async refreshApiKey (@GetUserFromReq() user: User): Promise<{ apiKey: string }> {
    const newKey = await this.userService.refreshApiKey(user.id);
    return { apiKey: newKey };
  }

  @Get('check-api-key/:apiKey')
  async checkApiKey (@Param('apiKey') apiKey: string) {
    const exists = await this.userService.existsByApiKey(apiKey);
    return { exists };
  }
}