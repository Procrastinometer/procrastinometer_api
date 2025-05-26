export abstract class AbstractSessionService {
  abstract create(userId: string): Promise<string>;
  abstract rotate(oldToken: string): Promise<{ userId: string; refreshToken: string }>;
  abstract revoke(token: string): Promise<void>;
}