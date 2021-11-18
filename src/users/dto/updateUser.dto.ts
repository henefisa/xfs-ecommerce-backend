import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email?: string;

  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber?: string;

  @IsDate()
  @IsNotEmpty()
  birthday?: Date;
}
