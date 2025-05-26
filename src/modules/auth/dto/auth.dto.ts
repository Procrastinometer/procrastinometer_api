import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { REG_EXPS } from '../../../utils/regExps';

export class AuthDto {
  @IsEmail()
    email: string;

  @IsString()
  @MinLength(8)
  @Matches(REG_EXPS.PASSWORD, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
    password: string;
}