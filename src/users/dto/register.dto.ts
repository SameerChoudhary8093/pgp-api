import { IsEmail, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(160)
  email?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  phone!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(240)
  address!: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  gpId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  wardId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  localUnitId?: number;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  referralCode?: string;

  // Supabase user id (auth) to link this app user with Supabase Auth
  @IsOptional()
  @IsString()
  @MaxLength(64)
  authUserId?: string;
}
