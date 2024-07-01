import { Module } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { NatsClientModule } from '../nats-client/nats-client.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config();


const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017"
@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI, {

    }),
    UsersModule,
    NatsClientModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [ AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
