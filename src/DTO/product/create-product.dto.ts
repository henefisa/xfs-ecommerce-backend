import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiProperty()
  stock: number;

  @IsNotEmpty()
  @ApiProperty()
  @Min(1)
  @IsNumber()
  @Type(() => Number)
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

  @IsOptional()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  @ValidateIf((_, value) => {
    return value !== '';
  })
  @ApiProperty({ type: 'array', items: { type: 'string' }, required: false })
  categories?: string[];
}
