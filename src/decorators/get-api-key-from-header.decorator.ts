import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ApiKey = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const apiKey = request.headers['api-key'];
    if (!apiKey) throw new BadRequestException('Missing API key in headers');

    return apiKey;
  },
);