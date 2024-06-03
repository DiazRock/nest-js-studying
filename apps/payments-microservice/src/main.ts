import { NestFactory } from '@nestjs/core';
import { PaymentsMicroserviceModule } from './payments-microservice.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsMicroserviceModule);
  await app.listen(3000);
}
bootstrap();
