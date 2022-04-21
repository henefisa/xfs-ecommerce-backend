import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum EBannerType {
  Big = 'big',
  Small = 'small',
}

@Entity()
export class Banner extends BaseEntity {
  @Column()
  image: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ enum: EBannerType, default: EBannerType.Small })
  type: EBannerType;
}
