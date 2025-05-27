import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AbstractUserService } from '../user/abstractions/user-service.abstraction';
import {
  comparePasswords,
  generateAccessToken,
  generateUUID,
  hashPassword,
} from '../../utils/cryptography';
import { User } from '@prisma/client';
import { AbstractSessionService } from '../session/abstractions/session-service.abstraction';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor (
    private readonly userService: AbstractUserService,
    private readonly sessionService: AbstractSessionService,
    private readonly jwt: JwtService,
  ) {}

  async register (dto: AuthDto): Promise<User> {
    const { email, password } = dto;
    const apiKey = generateUUID();
    const hash = await hashPassword(password);

    return this.userService.create(email, hash, apiKey);
  }

  async login (dto: AuthDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = dto;
    const user = await this.userService.findByEmail(email);
    if (!await comparePasswords(password, user.password)) throw new UnauthorizedException('Invalid credentials');

    const accessToken = generateAccessToken(this.jwt, user.id);
    const refreshToken = await this.sessionService.create(user.id);

    return { accessToken, refreshToken };
  }

  async rotateSession (token: string): Promise<{ accessToken: string; refreshToken: string }> {
    const { userId, refreshToken } = await this.sessionService.rotate(token);
    const accessToken = generateAccessToken(this.jwt, userId);

    return { accessToken, refreshToken };
  }

  async revokeSession (token: string) {
    return this.sessionService.revoke(token);
  }
}
