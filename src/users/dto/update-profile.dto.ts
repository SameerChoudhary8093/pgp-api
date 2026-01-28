import { IsOptional, IsString, MaxLength, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @IsUrl()
  @MaxLength(500)
  photoUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(6)
  pin?: string;
}
