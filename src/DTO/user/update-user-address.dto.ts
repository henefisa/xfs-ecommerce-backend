import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserAddressDTO {
  @ApiProperty({ required: false })
  @IsString()
  address: string;

  @ApiProperty({ required: false })
  @IsString()
  province: string;

  @ApiProperty({ required: false })
  @IsString()
  district: string;

  @ApiProperty({ required: false })
  @IsString()
  village: string;

  @ApiProperty({ required: false })
  @IsString()
  phoneNumber: string;
}
