import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType() // GraphQL을 위한 Decorator
@Entity() // TypeORM을 위한 Decorator
export class Restaurant {
  @Field(type => Number)
  @PrimaryGeneratedColumn() // TypeORM Decorator로, PK(auto_increment)와 같다고 생각하면 될듯
  id: number;

  @Field(type => String) // GraphQL을 위한 Decorator
  @Column() // TypeORM을 위한 Decorator
  @IsString() // dto를 위한 decorator
  @Length(5, 10) // dto를 위한 decorator
  name: string;

  @Field(type => Boolean, { nullable: true, defaultValue: true }) // GraphQL을 위한 Decorator
  @Column({ default: true }) // TypeORM을 위한 Decorator
  @IsOptional() // dto를 위한 decorator
  @IsBoolean() // dto를 위한 decorator
  isVegan?: boolean;

  @Field(type => String)
  @Column()
  @IsString()
  address: string;

  @Field(type => String)
  @Column()
  @IsString()
  ownerName: string;

  @Field(type => String)
  @Column()
  @IsString()
  categoryName: string;
}
