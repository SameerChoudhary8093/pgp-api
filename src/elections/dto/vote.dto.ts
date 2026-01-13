import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class VoteDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(21)
  @ArrayUnique()
  @IsInt({ each: true })
  @Type(() => Number)
  candidateUserIds!: number[];
}
