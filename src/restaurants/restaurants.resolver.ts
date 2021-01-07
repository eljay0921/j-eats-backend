import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
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
    @Args() createRestaurantInput: CreateRestaurantDto,
  ): boolean {
    console.log(createRestaurantInput);
    return true;
  }
}
