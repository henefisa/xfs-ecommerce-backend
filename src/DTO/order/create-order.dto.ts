import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumberString, IsString, ValidateNested } from 'class-validator';

export class OrderProductDTO {
  @IsString()
  @ApiProperty()
  productId: string;

  @IsNumberString()
  @ApiProperty()
  quantity: number;
}

export class CreateOrderDTO {
  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  province: string;

  @IsString()
  @ApiProperty()
  district: string;

  @IsString()
  @ApiProperty()
  village: string;

  @IsString()
  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ type: [OrderProductDTO] })
  @ValidateNested({ each: true })
  @Type(() => OrderProductDTO)
  products: OrderProductDTO[];
}
