import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './Payments/payments-microservice.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  await app.listen(3000);
}
bootstrap();
