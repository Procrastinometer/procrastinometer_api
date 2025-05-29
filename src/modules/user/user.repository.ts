import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { User } from '@prisma/client';
import { AbstractionUserRepository } from './abstractions/user-repository.abstraction';

@Injectable()
export class UserRepository implements AbstractionUserRepository {
  constructor (private prisma: PrismaService) {}

  async findById (id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail (email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create (email: string, password: string, apiKey: string): Promise<User> {
    return this.prisma.user.create({
      data: { email, password, apiKey },
    });
  }

  async updateApiKey (id: string, apiKey: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { apiKey },
    });
  }

  async existsByApiKey (apiKey: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { apiKey },
      select: { id: true },
    });
    return !!user;
  }
}