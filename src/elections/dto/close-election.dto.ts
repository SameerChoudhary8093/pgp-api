import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CloseElectionDto {
  @IsString()
  @MaxLength(500)
  @MinLength(3)
  reason!: string; // mandatory audit reason

  @IsInt()
  @Type(() => Number)
  actorUserId!: number; // MVP: pass actor explicitly
}
