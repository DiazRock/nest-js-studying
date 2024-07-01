import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async addUser(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, password: hashedPassword });
    return await user.save();
  }

  async verifyLogin(username: string, password: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = await this.userModel.findOne({username: username});
    return user !== null && user.password == hashedPassword;
  }

  async isUserRegistered(username: string): Promise<boolean> {
    this.logger.log("Inside the users service ", username);
    return await this.userModel.findOne({username: username}).then(result => result !== null);
  }
}
