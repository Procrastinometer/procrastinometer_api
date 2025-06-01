import { ForbiddenException, Injectable } from '@nestjs/common';
import { AbstractSessionService } from './abstractions/session-service.abstraction';
import { AbstractSessionRepository } from './abstractions/session-repository.abstraction';
import { generateRefreshToken, hashToken } from '../../utils/cryptography';
import { DATE_CONSTANTS } from '../../utils/date/date-constants';

@Injectable()
export class SessionService implements AbstractSessionService {
  constructor (
    private sessionRepository: AbstractSessionRepository,
  ) {}

  async create (userId: string): Promise<string> {
    const rawToken = generateRefreshToken();
    const hashedToken = hashToken(rawToken);

    const expiresAt = new Date(Date.now() + DATE_CONSTANTS.ONE_WEEK_MS);
    await this.sessionRepository.create(userId, hashedToken, expiresAt);

    return rawToken;
  }

  async rotate (oldToken: string): Promise<{ userId: string; refreshToken: string }> {
    const hashed = hashToken(oldToken);
    const session = await this.sessionRepository.findByToken(hashed);
    if (!session || session.expiresAt < new Date()) throw new ForbiddenException('Invalid or expired refresh token');

    await this.sessionRepository.deleteById(session.id);
    const refreshToken = await this.create(session.userId);

    return { userId: session.userId, refreshToken };
  }

  async revoke (token: string): Promise<void> {
    const hashed = hashToken(token);
    await this.sessionRepository.deleteByToken(hashed);
  }
}