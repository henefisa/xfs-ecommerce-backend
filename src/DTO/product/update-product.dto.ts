import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';
import { File } from 'src/interfaces';

export class UpdateProductDTO {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty()
  @Min(1)
  stock: number;

  @IsOptional()
  @IsNumberString()
  @ApiProperty()
  @Min(1)
  price: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description: string;

  @Type(() => Object)
  @IsOptional()
  @ApiProperty()
  details: Record<string, string>;

  @IsOptional()
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  images: File[];

  @IsOptional()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  @ValidateIf((_, value) => {
    return value !== '';
  })
  @ApiProperty({ type: 'array', items: { type: 'string' }, required: false })
  categories: string[];
}
