import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";

it("can create an instance of auth service", async () => {
  // auth service에 user service 의존성 주입을 위해 만든 fake class
  const faksUsersService = {
    find: () => Promise.resolve([]),
    create: (email: string, password: string) =>
      Promise.resolve({ id: 1, email, password }),
  };

  const module = await Test.createTestingModule({
    // testing DI 컨테이너에 등록할 것들
    providers: [
      AuthService,
      { provide: UsersService, useValue: faksUsersService },
    ],
  }).compile();

  const service = module.get(AuthService);
  expect(service).toBeDefined();
});
