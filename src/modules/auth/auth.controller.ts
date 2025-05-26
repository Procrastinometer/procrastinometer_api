import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import {
  clearRefreshTokenCookie,
  getRefreshTokenFromCookie,
  setRefreshTokenCookie,
} from '../../utils/cookie.utils';

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @Post('register')
  async register (@Body() dto: AuthDto) {
    const user = await this.authService.register(dto);

    return {
      id: user.id,
      email: user.email,
      apiKey: user.apiKey,
    };
  }

  @Post('login')
  async login (@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(dto);
    setRefreshTokenCookie(res, refreshToken);

    return { accessToken };
  }

  @Post('refresh')
  async refresh (@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = getRefreshTokenFromCookie(req);
    const { accessToken, refreshToken } = await this.authService.rotateSession(token);
    setRefreshTokenCookie(res, refreshToken);
    
    return { accessToken };
  }

  @Post('logout')
  async logout (@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<{ message: string }> {
    const token = getRefreshTokenFromCookie(req);
    if (token) await this.authService.revokeSession(token);
    clearRefreshTokenCookie(res);

    return { message: 'Logged out' };
  }
}