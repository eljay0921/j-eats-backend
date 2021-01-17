import { Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './user.service';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(returns => Boolean)
  Hi(): boolean {
    return true;
  }
}
