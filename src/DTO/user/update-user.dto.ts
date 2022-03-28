import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateUserDTO {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @ApiProperty({ required: false })
  email?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
  firstName?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  @IsPhoneNumber('VN')
  phoneNumber?: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  birthday?: Date;
}
