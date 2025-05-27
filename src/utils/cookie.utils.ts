import { Response } from 'express';
import { Request } from 'express';
import { CONSTANTS } from './constants';

export const setRefreshTokenCookie = (res: Response, token: string): void => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/auth/refresh',
    maxAge: CONSTANTS.ONE_WEEK_MS,
  });
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie('refresh_token', { path: '/auth/refresh' });
};

export const getRefreshTokenFromCookie = (req: Request): string => {
  return req.cookies['refresh_token'];
};