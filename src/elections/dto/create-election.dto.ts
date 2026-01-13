import { IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateElectionDto {
  @IsString()
  councilLevel!: string; // e.g. 'APC'

  @IsOptional()
  @IsString()
  @MaxLength(120)
  position?: string;

  @IsString()
  @MaxLength(500)
  @MinLength(3)
  reason!: string; // mandatory audit reason

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  actorUserId?: number; // for audit log; MVP without auth
}
