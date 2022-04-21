import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { EBannerType } from 'src/entities';
import { File } from 'src/interfaces';

export class UpdateBannerDTO {
  @IsString()
  @ApiProperty({ required: false })
  title?: string;

  @IsString()
  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image: File;

  @IsEnum(EBannerType)
  @ApiProperty({ enum: EBannerType, required: false })
  type?: EBannerType;
}
