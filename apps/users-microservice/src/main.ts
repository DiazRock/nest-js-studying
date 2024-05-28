import { NestFactory } from '@nestjs/core';
import { UsersMicroserviceModule } from './users-microservice.module';

async function bootstrap() {
  const app = await NestFactory.create(UsersMicroserviceModule);
  await app.listen(3000);
}
bootstrap();
