import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class ReviewProductDTO {
  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiProperty()
  rating: number;

  @IsString()
  @ApiProperty()
  content: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: File[];
}
