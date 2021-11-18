import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
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
  @IsNotEmpty()
  phoneNumber: string;

  @IsDateString()
  @IsNotEmpty()
  birthday: Date;

  @IsString()
  @MinLength(4)
  @MaxLength(32)
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(32)
  passwordConfirm: string;
}
