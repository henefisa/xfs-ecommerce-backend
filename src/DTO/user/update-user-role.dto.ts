import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsEnum } from 'class-validator';
import { EUserRole } from 'src/enums';

export class UpdateUserRoleDTO {
  @IsEnum(EUserRole, { each: true })
  @ApiProperty({ enum: EUserRole, isArray: true })
  @ArrayUnique()
  roles: EUserRole[];
}
