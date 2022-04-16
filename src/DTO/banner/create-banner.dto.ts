import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBannerDTO {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: File;
}
