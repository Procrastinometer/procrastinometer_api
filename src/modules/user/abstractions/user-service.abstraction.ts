import { User } from '@prisma/client';

export abstract class AbstractUserService {
  abstract findById(id: string): Promise<User>;
  abstract findByEmail(email: string): Promise<User>;
  abstract create(email: string, password: string, apiKey: string): Promise<User>;
  abstract refreshApiKey(userId: string): Promise<string>;
  abstract existsByApiKey(apiKey: string): Promise<boolean>;
}