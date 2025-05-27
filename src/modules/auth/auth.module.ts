import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TokenExpiration } from '../../utils/tokens/tokens-experation-time';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    SessionModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: TokenExpiration.ACCESS_TOKEN },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}