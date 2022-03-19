import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserAddressDTO {
  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  province: string;

  @ApiProperty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsString()
  village: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;
}
