import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurants.entity';

@Resolver(of => Restaurant)
export class RestaurantsResolver {
  @Query(() => [Restaurant])
  restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    console.log(veganOnly);
    return [];
  }
  @Mutation(() => Boolean)
  createRestaurant(
    @Args('name') name: boolean,
    @Args('isVegan') isVegan: boolean,
    @Args('address') address: boolean,
    @Args('ownerName') ownerName: boolean,
  ): boolean {
    return true;
  }
}
