import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../typeorm/entities/User';
import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUser.dto';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create(
      {
        ...createUserDto, 
        role: 'user', 
        canRead: false,
        canWrite: false,
      });
    this.logger.log('Creating user ', createUserDto);
    return this.usersRepository.save(newUser);
  }

  createAdmin(createUserDto: CreateUserDto) {
    const newAdmin = this.usersRepository.create(
      {
        ...createUserDto,
        role: 'admin',
        canRead: true,
        canWrite: true,
      }
    )

    this.logger.log('Admin user defined', JSON.stringify(newAdmin));
    return this.usersRepository.save(newAdmin);

  }

  getUserById(userId: string) {
    this.logger.log('Getting user by id ', userId);
    return this.usersRepository.findOne({
      where: { id: userId },
      relations: ['payments'],
    });
  }

  async getUsers(){
    this.logger.log('Getting all the users from the database')
    const users = await this.usersRepository.find({relations: ['payments']});
    //this.logger.debug('Users found:', users);
    return users;
  }

  findByUsername(username: string): Promise<User[]> {
    this.logger.log(`Finding user by username ${username}`)
    return this.usersRepository.find({
      where: {
        username: username
      }
    });
  }

  async getUserPermissions(id: string): Promise<{canRead: boolean, canWrite: boolean}> {
    this.logger.log(`Finding permissions for user ${id}`);
    const list = await this.usersRepository.find({
      where: {
        id: id
      }
    });
    if (list.length > 0){
      this.logger.log('User is admin');
      return {
        canRead: list[0].canRead,
        canWrite: list[0].canWrite,
      };
    }
    this.logger.log('User is not an admin');
    return {canRead: false, canWrite: false};
  }


  async updateUser(user: User): Promise<User> {
    this.logger.log(`Updating user ${user.id}`);
    return await this.usersRepository.save(user);
  }
}
