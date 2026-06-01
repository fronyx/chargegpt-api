import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqTokenDecorator = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});