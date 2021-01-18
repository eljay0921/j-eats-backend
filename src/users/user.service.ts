import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { User } from './entities/user.entity';

export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({ email, password, role }: CreateAccountInput) {
    try {
      // Checking new user (email)
      const exists = this.users.findOne({ email }); // { email: email }
      if (exists) {
        // already exist email
        return;
      }
      // Creating account (with hashing password)
      await this.users.save(this.users.create({ email, password, role }));
      // return results
      return true;
    } catch (err) {
      console.log(err);
      return;
    }
  }
}
