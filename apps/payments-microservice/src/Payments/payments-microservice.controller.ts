import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
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
    const newPayment =
      await this.paymentsService.createPayment(createPaymentDto);
    if (newPayment) {
      this.natsClient.emit('paymentCreated', newPayment);
      return true;
    }
    return false;
  }
}
