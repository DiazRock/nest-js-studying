import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../typeorm/entities/user';
import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUser.dto';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create(createUserDto);
    this.logger.log('Creating user ', createUserDto);
    return this.usersRepository.save(newUser);
  }

  getUserById(userId: string) {
    this.logger.log('Getting user by id ', userId);
    return this.usersRepository.findOne({
      where: { id: userId },
      relations: ['payments'],
    });
  }

  getUsers(){
    this.logger.log('Getting all the users from the database')
    return this.usersRepository.find({relations: ['payments']});
  }
}
