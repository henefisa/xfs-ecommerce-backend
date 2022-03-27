import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EOrderPaymentType } from 'src/enums/order.enum';
import Stripe from 'stripe';

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

  async charge(
    amount: number,
    paymentType: EOrderPaymentType,
    customerId: string,
  ) {
    return this.stripe.paymentIntents.create({
      amount,
      customer: customerId,
      currency: 'VND',
      confirm: true,
      payment_method: paymentType,
    });
  }
}
