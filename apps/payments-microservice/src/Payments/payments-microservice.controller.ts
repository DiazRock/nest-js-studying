import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePaymentDto } from './dtos/CreatePayment.dto';
import { PaymentsService } from './payments-microservice.service';

@Controller()
export class PaymentsMicroserviceController {
  private readonly logger: Logger = new Logger(PaymentsMicroserviceController.name);
  constructor(
    @Inject('NATS_SERVICE') private natsClient: ClientProxy,
    private paymentsService: PaymentsService,
  ) {}
  @EventPattern('createPayment')
  async createPayment(@Payload() createPaymentDto: CreatePaymentDto) {
    this.logger.debug('Payload for create the payment received ', createPaymentDto)
    const response =
      await this.paymentsService.createPayment(createPaymentDto);
    if (response) {
      this.logger.debug('Payment created successfully', response);
      this.natsClient.emit('paymentCreated', response);
      return response;
    }
    return { error: 'Error creating payment'};
  }

  @MessagePattern({"cmd":"getAllPayments"})
  getPayments(){
    return this.paymentsService.findAll();
  }

  @MessagePattern({"cmd":"getUserPayments"})
  async getPaymentsByUserId({userId}){
    const payments = await this.paymentsService.findByUserId(userId);
    this.logger.debug('Payments for user '+ userId +' are\n ', payments);
    return payments;
  }
}
