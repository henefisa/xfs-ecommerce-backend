import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

// enum
import { EOrderPaymentType } from 'src/enums/order.enum';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: null,
    });
  }

  async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      email,
      name,
    });
  }

  async charge(amount: number, customerId: string) {
    return this.stripe.paymentIntents.create({
      amount,
      customer: customerId,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }
}
