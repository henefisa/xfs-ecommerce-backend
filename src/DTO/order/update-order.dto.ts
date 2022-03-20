import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

// enums
import { EOrderStatus } from 'src/enums/order.enum';

export class UpdateOrderDTO {
  @IsEnum(EOrderStatus)
  @ApiProperty({ enum: EOrderStatus })
  status: EOrderStatus;
}
