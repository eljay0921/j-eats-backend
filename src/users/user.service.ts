import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { VerifyEmailOutput } from './dtos/verify-email.dto';
import { MailService } from 'src/mail/mail.service';

export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      // 존재하는지 체크
      const exists = await this.users.findOne({ email }); // { email: email }
      if (exists) {
        return { ok: false, error: 'This email already exists.' };
      }

      // account 생성 및 저장
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );

      // verification 생성 및 저장
      const verification = await this.verifications.save(
        this.verifications.create({ user }),
      );

      // email 인증 요구
      await this.mailService.sendVerificationEmail(
        user.email,
        verification.code,
      );

      return { ok: true };
    } catch (err) {
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
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
      );
      if (user) {
        const passwordCorrect = await user.checkPassword(password);
        if (passwordCorrect) {
          const token = this.jwtService.sign(user.id);
          return {
            ok: true,
            token,
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

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneOrFail({ id });
      return {
        ok: true,
        user,
      };
    } catch (error) {
      // console.log(error.message);
      return {
        ok: false,
        error: 'User not found.',
      };
    }
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne(userId);
      if (email) {
        user.email = email;
        user.verified = false;
        const verification = await this.verifications.save(
          this.verifications.create({ user }),
        );
        this.mailService.sendVerificationEmail(user.email, verification.code);
      }
      if (password) {
        user.password = password;
      }
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne(
        { code },
        { relations: ['user'] },
      );
      if (verification) {
        verification.user.verified = true;
        await this.users.save(verification.user);
        await this.verifications.delete(verification.id);
        return {
          ok: true,
        };
      }

      return {
        ok: false,
        error: 'Verification not found.',
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
