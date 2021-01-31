import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';

@Module({})
@Global()
export class JwtModule {
  // forRoot가 아니라, 다른 이름으로 사용해도 된다.
  static forRoot(): DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService],
      providers: [JwtService],
    };
  }
}
