import { Module } from '@nestjs/common';
import { PaymentsModule } from './Payments/payments-microservice.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
