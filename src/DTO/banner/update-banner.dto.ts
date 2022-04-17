import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { File } from 'src/interfaces';

export class UpdateBannerDTO {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image: File;
}
