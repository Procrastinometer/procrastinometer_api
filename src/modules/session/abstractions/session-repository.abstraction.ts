export abstract class AbstractSessionRepository {
  abstract create(userId: string, token: string, expiresAt: Date): Promise<void>;
  abstract findByToken(token: string): Promise<any | null>;
  abstract deleteById(id: string): Promise<void>;
  abstract deleteByToken(token: string): Promise<void>;
}