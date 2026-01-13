import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  role: string;

  @IsInt()
  @Min(1)
  actorUserId: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
