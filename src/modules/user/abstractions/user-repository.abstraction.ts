import { User } from '@prisma/client';

export abstract class AbstractionUserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(email: string, password: string, apiKey: string): Promise<User>;
  abstract updateApiKey(id: string, apiKey: string): Promise<User>;
}