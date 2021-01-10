import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'dev' ? './envs/.env.dev' : './envs/.env.test',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'imjin',
      password: 'wls0921', // 사실 localhost로 연결할 때는 비말번호를 묻지 않기 때문에 입력하지 않아도 됨
      database: 'j-eats',
      synchronize: true, // DB에 연결할 때, DB를 현재 모듈의 상태로 마이그레이션
      logging: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    RestaurantsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
