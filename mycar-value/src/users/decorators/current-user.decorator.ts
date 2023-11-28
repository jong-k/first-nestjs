import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// data가 절대 쓰이지 않을 것이라면 never
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log(request.session.userId);
    return;
  },
);
