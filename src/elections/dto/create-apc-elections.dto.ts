import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateApcElectionsDto {
  @IsInt()
  @Type(() => Number)
  vidhansabhaId!: number;

  @IsString()
  @MaxLength(500)
  @MinLength(3)
  reason!: string;

  @IsInt()
  @Type(() => Number)
  actorUserId!: number;
}
