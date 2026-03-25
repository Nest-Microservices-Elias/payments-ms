import { Injectable, RawBody } from '@nestjs/common'
import { envs } from 'src/config'
import Stripe from 'stripe'
import { PaymentsSessionDto } from './dto/payment-session.dto'
import { Request, Response } from 'express'

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret)

  async createPaymentSession(paymentsSessionDto: PaymentsSessionDto) {
    const { currency, items, orderId } = paymentsSessionDto

    const lineItems = items.map((item) => {
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), //lo redondea
        },
        quantity: item.quantity,
      }
    })
    const session = await this.stripe.checkout.sessions.create({
      //colocar aquí el id de mi Orden
      payment_intent_data: {
        metadata: {
          orderId,
        },
      },

      line_items: lineItems,
      mode: 'payment',
      success_url: envs.stripeSuccessUrl,
      cancel_url: envs.stripeCancelUrl,
    })

    return session
  }

  async stripeWebhook(req: Request, res: Response) {
    let event: Stripe.Event = req.body

    const signature = req.headers['stripe-signature']!
    const endpointSecret = envs.stripeEndpointSecret
    if (endpointSecret) {
      try {
        event = this.stripe.webhooks.constructEvent(
          req['rawBody'],
          signature,
          endpointSecret,
        )
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message)
        return res.sendStatus(400)
      }
    }
    // HANDLE THE EVENT
    switch (event.type) {
      case 'charge.succeeded':
        const chargeSuccessed = event.data.object
        console.log({
          metadata: chargeSuccessed.metadata,
          orderId: chargeSuccessed.metadata.orderId,
        })
        break
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`)
    }

    return res.status(200).json({ signature })
  }
}
