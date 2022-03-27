import { Module } from '@nestjs/common';

import { StripeService } from 'src/services';

@Module({ exports: [StripeService], providers: [StripeService] })
export class StripeModule {}
