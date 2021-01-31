import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';

export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    console.log(this.configService.get('TOKEN_SECRET'));
    this.jwtService.hello();
  }

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      console.log(email);
      // Checking new user (email)
      const exists = await this.users.findOne({ email }); // { email: email }
      console.log(exists);
      if (exists) {
        // already exist email
        return { ok: false, error: 'This email already exists.' };
      }
      // Creating account (with hashing password)
      await this.users.save(this.users.create({ email, password, role }));
      return { ok: true };
    } catch (err) {
      console.log(err);
      return { ok: false, error: "Couldn't create account." };
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      // 1. find user with email
      // 2. check password
      // 3. make JWT token & give it to user
      const user = await this.users.findOne({ email });
      if (user) {
        const passwordCorrect = await user.checkPassword(password);
        if (passwordCorrect) {
          const genToken = jwt.sign(
            { id: user.id },
            this.configService.get('TOKEN_SECRET'),
          );

          return {
            ok: true,
            token: genToken,
          };
        } else {
          return {
            ok: false,
            error: 'Wrong Password.',
          };
        }
      } else {
        return {
          ok: false,
          error: 'User not found.',
        };
      }
    } catch (error) {
      return { ok: false, error };
    }
  }
}
