import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AbstractUserService } from '../../user/abstractions/user-service.abstraction';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor (
    private readonly userService: AbstractUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate (payload: JwtPayload) {
    if (!payload.sub) throw new UnauthorizedException('Missing subject');

    const user = await this.userService.findById(payload.sub);
    if (!user) throw new UnauthorizedException();

    return user;
  }
}