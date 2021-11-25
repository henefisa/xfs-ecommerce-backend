import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from 'src/decorators';

export class RegisterDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  username: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsDateString()
  @IsNotEmpty()
  birthday: Date;

  @IsString()
  @MinLength(4)
  password: string;

  @IsString()
  @MinLength(4)
  @Match('password')
  passwordConfirm: string;
}
