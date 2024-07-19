import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../typeorm/entities/User';
import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UserPermissions } from 'src/enums/user.permissions';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create({...createUserDto, role: 'user', permissions: ''});
    this.logger.log('Creating user ', createUserDto);
    return this.usersRepository.save(newUser);
  }

  createAdmin(createUserDto: CreateUserDto) {
    const newAdmin = this.usersRepository.create(
      {
        ...createUserDto,
        role: 'admin',
        permissions: [
          UserPermissions.READ.toString(),
          UserPermissions.WRITE.toString()
        ].join(",")
      }
    )

    return this.usersRepository.save(newAdmin);

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

  findByUsername(username: string): Promise<User[]> {
    this.logger.log(`Finding user by username ${username}`)
    return this.usersRepository.find({
      where: {
        username: username
      }
    });
  }

  async getUserPermissions(id: string): Promise<string> {
    this.logger.log(`Finding permissions for user ${id}`);
    const list = await this.usersRepository.find({
      where: {
        id: id
      }
    });
    if (list.length > 0){
      this.logger.log('User is admin');
      return list[0].permissions;
    }
    this.logger.log('User is not an admin');
    return '';
  }

}
