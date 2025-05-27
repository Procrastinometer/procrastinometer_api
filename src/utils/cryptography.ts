import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiration } from './tokens/tokens-experation-time';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateUUID = (): string => crypto.randomUUID();

export const generateAccessToken = (jwt: JwtService, userId: string): string => {
  return jwt.sign({ sub: userId }, { expiresIn: TokenExpiration.ACCESS_TOKEN });
};

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const generateRefreshToken = (length = 64): string => {
  return crypto.randomBytes(length).toString('hex');
};