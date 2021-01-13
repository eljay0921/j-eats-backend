import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
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
  @IsString()
  @Length(5, 10)
  name: string;

  @Field(type => Boolean, { nullable: true })
  @Column()
  @IsBoolean()
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
