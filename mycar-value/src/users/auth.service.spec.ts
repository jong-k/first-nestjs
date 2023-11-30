import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";

// test 제목
describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    // auth service에 user service 의존성 주입을 위해 만든 fake class
    const faksUsersService: Partial<UsersService> = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module = await Test.createTestingModule({
      // testing DI 컨테이너에 등록할 것들
      providers: [
        AuthService,
        { provide: UsersService, useValue: faksUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  // test 소제목
  it("can create an instance of auth service", async () => {
    expect(service).toBeDefined();
  });
});
