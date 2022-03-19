import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  @ApiProperty()
  name: string;
}
