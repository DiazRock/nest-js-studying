import { Controller, Inject, Post, Body, Logger, HttpCode } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePaymentDto } from './dto/CreatePayment.dto';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post()
  @HttpCode(204)
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    this.logger.log('Creating a payment', createPaymentDto);
    await this.natsClient.emit('createPayment', createPaymentDto);
    return 'Payment created successfully';
  }
}