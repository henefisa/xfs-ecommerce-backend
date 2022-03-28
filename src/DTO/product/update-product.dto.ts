import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumberString, IsOptional, IsString, Min } from 'class-validator';

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
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: File[];

  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ type: 'array', items: { type: 'string' }, required: false })
  categories: string[];
}
