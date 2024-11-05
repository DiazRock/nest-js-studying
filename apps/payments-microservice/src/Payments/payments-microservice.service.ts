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
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {

    if (createPaymentDto.amount < 0) {
      this.logger.error('Payment amount cannot be negative');
      return null;
    }

    const user: User = await this.userRepository.findOne({
      where: { id: createPaymentDto.userId },
      relations: ['payments'],
    });
    if (!user) {
      this.logger.error('User associated to the payment not found');
      return null;
    }
    
    if (user.balance < createPaymentDto.amount) {
      this.logger.error('User does not have sufficient balance');
      return null;
    }

    this.logger.log('User associated with the payment ', user);
    user.balance -= createPaymentDto.amount;
    await this.userRepository.save(user);
    this.logger.log('User balance updated based on the input amount');

    const newPayment: Payment = this.paymentsRepository.create({
      ...createPaymentDto,
      user
    });

    this.logger.debug('Payment to be saved', JSON.stringify(newPayment));
    
    const resultedPayment = await this.paymentsRepository.save(newPayment);
    
    return resultedPayment;
  
  }

  findByUserId(user_id){
    return this.paymentsRepository.find({where: {
      user: {
        id: user_id
      }
    },
      relations: ['user']});

  }
  findAll(){
    return this.paymentsRepository.find({relations: ['user']});
  }
}
