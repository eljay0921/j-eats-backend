import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { User } from './entities/user.entity';

export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<string | undefined> {
    try {
      console.log(email);
      // Checking new user (email)
      const exists = await this.users.findOne({ email }); // { email: email }
      console.log(exists);
      if (exists) {
        // already exist email
        return 'This email already exists.';
      }
      // Creating account (with hashing password)
      await this.users.save(this.users.create({ email, password, role }));
    } catch (err) {
      console.log(err);
      return "Couldn't create account.";
    }
  }
}
