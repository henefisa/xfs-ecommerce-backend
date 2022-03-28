import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { EOrderPaymentType } from 'src/enums/order.enum';

export class OrderProductDTO {
  @IsString()
  @ApiProperty()
  productId: string;

  @IsNumber()
  @ApiProperty()
  @Min(1)
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
  @IsPhoneNumber('VN')
  phoneNumber: string;

  @IsEnum(EOrderPaymentType)
  @ApiProperty({ enum: EOrderPaymentType })
  paymentType: EOrderPaymentType;

  @ApiProperty({ type: [OrderProductDTO] })
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDTO)
  @IsArray()
  products: OrderProductDTO[];
}
