import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType() // GraphQL을 위한 Decorator
@Entity() // TypeORM을 위한 Decorator
export class Restaurant {
  @Field(type => Number)
  @PrimaryGeneratedColumn() // TypeORM Decorator로, PK(auto_increment)와 같다고 생각하면 될듯
  id: number;

  @Field(type => String) // GraphQL을 위한 Decorator
  @Column() // TypeORM을 위한 Decorator
  name: string;

  @Field(type => Boolean, { nullable: true })
  @Column()
  isVegan?: boolean;

  @Field(type => String)
  @Column()
  address: string;

  @Field(type => String)
  @Column()
  ownerName: string;

  @Field(type => String)
  @Column()
  categoryName: string;
}
