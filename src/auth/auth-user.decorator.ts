import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// createParamDecorator 인자에는 factory function이 필요하고,
// factory function에는 항상 unknown value인 data와 context가 있다.
export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    // auth guard에서 작성한 것과 동일
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext['user'];
    return user;
  },
);
