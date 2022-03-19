import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty()
  stock: number;

  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty()
  price: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @Type(() => Object)
  @ApiProperty()
  details: Record<string, string>;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: File[];

  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ type: 'array', items: { type: 'string' }, required: false })
  categories: string[];
}
