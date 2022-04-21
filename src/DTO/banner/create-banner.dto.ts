import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { EBannerType } from 'src/entities';
import { File } from 'src/interfaces';

export class CreateBannerDTO {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: File;

  @IsEnum(EBannerType)
  @ApiProperty({ enum: EBannerType })
  type: EBannerType;
}
