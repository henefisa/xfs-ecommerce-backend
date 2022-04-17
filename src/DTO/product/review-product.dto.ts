import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, Max, Min } from 'class-validator';
import { File } from 'src/interfaces';

export class ReviewProductDTO {
  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiProperty()
  @Type(() => Number)
  rating: number;

  @IsString()
  @ApiProperty()
  content: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  images: File[];
}
