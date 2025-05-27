import { Injectable } from '@nestjs/common';
import { AbstractSessionRepository } from './abstractions/session-repository.abstraction';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SessionRepository implements AbstractSessionRepository {
  constructor (private prisma: PrismaService) {}

  async create (userId: string, token: string, expiresAt: Date): Promise<void> {
    await this.prisma.session.create({
      data: { userId, refreshToken: token, expiresAt },
    });
  }

  async findByToken (token: string): Promise<any | null> {
    return this.prisma.session.findUnique({ where: { refreshToken: token } });
  }

  async deleteById (id: string): Promise<void> {
    await this.prisma.session.delete({ where: { id } });
  }

  async deleteByToken (token: string): Promise<void> {
    await this.prisma.session.delete({ where: { refreshToken: token } });
  }
}