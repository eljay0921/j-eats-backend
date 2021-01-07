import { Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurants.entity';

@Resolver(of => Restaurant)
export class RestaurantsResolver {
  @Query(() => Restaurant)
  myRestaurant() {
    return true;
  }
}
