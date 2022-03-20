import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EUserStatus } from 'src/enums';

export class UpdateUserStatusDTO {
  @IsEnum(EUserStatus)
  @ApiProperty({ enum: EUserStatus })
  status: EUserStatus;
}
