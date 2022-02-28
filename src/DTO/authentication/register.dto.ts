import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  @ApiProperty()
  username: string;

  @IsEmail()
  @IsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  phoneNumber: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  birthday: Date;

  @IsString()
  @MinLength(4)
  @ApiProperty()
  password: string;
}
