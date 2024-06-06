import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../typeorm/entities/Payments';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dtos/CreatePayment.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { User } from '../typeorm/entities/User';

@Injectable()
export class PaymentsService {
  private readonly logger: Logger = new Logger(PaymentsService.name);
  constructor(
    @InjectRepository(Payment) private paymentsRepository: Repository<Payment>,
    @Inject('NATS_SERVICE') private natsClient: ClientProxy,
  ) {}

  async createPayment({ userId, ...createPaymentDto }: CreatePaymentDto) {
    const user = await lastValueFrom<User>(
      this.natsClient.send({ cmd: 'getUserById' }, { userId }),
    );
    if (user) {
      this.logger.log('User associated with the payment ', user);
      const newPayment = this.paymentsRepository.create({
        ...createPaymentDto,
        user,
      });
      this.logger.log('Payment to be saved', newPayment);
      return this.paymentsRepository.save(newPayment);
    }
    return null;
  }
}
