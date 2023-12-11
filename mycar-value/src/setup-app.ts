import cookieSession from "cookie-session"; // 소문자로 이렇게 import 해야 함
import { ValidationPipe } from "@nestjs/common";

// auth signup test를 위해 미들웨어를 test app module에 적용해주기 위해 만든 임시 setup app
export const setupApp = (app: any) => {
  app.use(
    cookieSession({
      keys: ["salttext"], // dev 환경이라 일단 이렇게 넘어감
    }),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
};
