import { Test } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";

// test 제목
describe("AuthService", () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // auth service에 user service 의존성 주입을 위해 만든 fake class
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module = await Test.createTestingModule({
      // testing DI 컨테이너에 등록할 것들
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  // test 소제목
  it("can create an instance of auth service", async () => {
    expect(service).toBeDefined();
  });

  it("creates a new user with a salted and hashed password", async () => {
    const user = await service.signup("testing@testing.com", "testing");
    expect(user.password).not.toEqual("testing");
    const [salt, hash] = user.password.split(".");
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it("throws an error if user signs up with email that is in use", async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: "a", password: 1 } as unknown as User]); // 에러 해결을 위해 일단 unknown 타입 할당
    // BadRequestException 에러가 발생할 거라고 테스트
    await expect(
      service.signup("testing@testing.com", "testing"),
    ).rejects.toThrow(BadRequestException);
  });
});
