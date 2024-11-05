import { Controller, Inject, Post, Body, Logger, HttpCode, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
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
    const response = await lastValueFrom(this.natsClient.send('createPayment', createPaymentDto));
    this.logger.debug('Payment created successfully', response);
    const {error} = response;
    if (error !== undefined) {
      this.logger.error('Error creating payment', error);
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return response; 
  }

  @Get('/:id')
  async getPaymentsForUser(@Param('id') id: string) {
    this.logger.log('Listing all existing payments for user ' + id);
    const listOfPaymentsForUser = await lastValueFrom(this.natsClient.send({cmd: "getUserPayments"}, {userId: id}));
    this.logger.debug('List of payments founded ' + listOfPaymentsForUser);
    return listOfPaymentsForUser;
  }

  @Get()
  @HttpCode(200)
  async listPayment() {
    this.logger.log('Listing all existing payments');
    const listOfPayments = await lastValueFrom(this.natsClient.send({cmd: "getAllPayments"}, {}));
    return listOfPayments;
  }
}