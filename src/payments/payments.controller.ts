import { Controller, Get, Post, Req, Res } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { PaymentsService } from './payments.service'
import { PaymentsSessionDto } from './dto/payment-session.dto'
import { Request, Response } from 'express'

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // @Post('create-payment-session')
  @MessagePattern('create.payment.session')
  createPaymentSession(@Payload() paymentsSessionDto: PaymentsSessionDto) {
    return this.paymentsService.createPaymentSession(paymentsSessionDto)
  }

  @Get('success')
  success() {
    return {
      ok: true,
      message: 'payment succcessful',
    }
  }

  @Get('cancel')
  cancel() {
    return {
      ok: false,
      message: 'payment cancelled',
    }
  }
  @Post('webhook')
  async stripeWebhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentsService.stripeWebhook(req, res)
  }
}
