import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurants.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurant: Repository<Restaurant>,
  ) {}

  getAll(): Promise<Restaurant[]> {
    return this.restaurant.find();
  }

  createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    // 이 newRestaurant 객체는 메모리에만 생성되어 있는 것이다.
    const newRestaurant = this.restaurant.create(createRestaurantDto);

    // 이후 실제로 DB에 저장하기 위해서 save() 메서드를 사용하자.
    return this.restaurant.save(newRestaurant);
  }
}
