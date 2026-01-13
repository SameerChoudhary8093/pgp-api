import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class AddCandidateDto {
  @IsInt()
  @Type(() => Number)
  userId!: number;

  @IsString()
  @MaxLength(500)
  @MinLength(3)
  reason!: string; // mandatory audit reason

  @IsInt()
  @Type(() => Number)
  actorUserId!: number; // MVP: pass actor explicitly
}
