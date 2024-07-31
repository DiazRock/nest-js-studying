import { Controller, Inject, Post, Body, Logger, HttpCode, Get, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePaymentDto } from './dto/CreatePayment.dto';
import { lastValueFrom } from 'rxjs';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post()
  @HttpCode(201)
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    this.logger.log('Creating a payment', createPaymentDto);
    await lastValueFrom(this.natsClient.emit('createPayment', createPaymentDto));
    return 'Payment created successfully';
  }

  @Get('/:id')
  async getPaymentsForUser(@Param('id') id: string) {
    this.logger.log('Listing all existing payments for user ' + id);
    const listOfPaymentsForUser = await lastValueFrom(this.natsClient.send({cmd: "getUserPayments"}, {userId: id}));
    this.logger.debug('List of payments founded ' + listOfPaymentsForUser);
    return listOfPaymentsForUser;
  }

  @Get()
  @HttpCode(201)
  async listPayment() {
    this.logger.log('Listing all existing payments');
    const listOfPayments = await lastValueFrom(this.natsClient.send({cmd: "getAllPayments"}, {}));
    return listOfPayments;
  }
}