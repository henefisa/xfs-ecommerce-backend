import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProductDTO {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty()
  stock: number;

  @IsOptional()
  @IsNumberString()
  @ApiProperty()
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
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: File[];

  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ type: 'array', items: { type: 'string' }, required: false })
  categories: string[];
}
