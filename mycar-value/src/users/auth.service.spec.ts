import { Test } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";

// test 수행 후 5초 뒤 아무 결과가 없으면 jest가 fail로 처리
// test 제목
describe("AuthService", () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    // auth service에 user service 의존성 주입을 위해 만든 fake class
    fakeUsersService = {
      // find: () => Promise.resolve([]),
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      // create: (email: string, password: string) =>
      //   Promise.resolve({ id: 1, email, password } as User),
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
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

  it("이미 가입된 이메일로 회원가입하려고 하면 에러 발생", async () => {
    // 먼저 find 실행하는 이유
    // 일단 AuthService가 UsersService를 필요로 하므로, UsersService 의존성이 AuthService에 주입됨
    // find 메서드를 어떤 더미 유저를 찾는 메서드로 고정시켜줌
    // 그리고 signup 테스트 시 먼저 찾아져야 할 유저가 fake find에서 고정된 유저로 할당됨
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: "a@a.com", password: 1 } as unknown as User,
      ]); // 에러 해결을 위해 일단 unknown 타입 할당
    // BadRequestException 에러가 발생할 거라고 테스트
    await expect(
      // find 에서 무조건 { id: 1, email: "a", password: 1 } 가 반환되기 때문에
      // 에러 발생
      // 원래는 find 했을 때 빈배열 나와야 함
      service.signup("testing@testing.com", "testing"),
    ).rejects.toThrow(BadRequestException);
  });

  it("존재하지 않는 이메일로 로그인하면 에러 발생", async () => {
    await expect(
      service.signin("neverUsed@neverUsed.com", "never"),
    ).rejects.toThrow(NotFoundException);
  });

  it("잘못된 비밀번호를 입력하면 에러 발생", async () => {
    // 비밀번호 pass
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: "a@a.com", password: "pass" } as unknown as User,
      ]);
    await expect(service.signin("a@a.com", "word")).rejects.toThrow(
      BadRequestException,
    );
  });

  it("올바른 비밀번호로 로그인 시 성공", async () => {
    // singup 실행한 뒤 console.log() 로 얻은 salt.hash 문자열로 fake find 재할당하여 바로 로그인해보는 극단적으로 원시적인 방법도 있음
    await service.signup("test@test.com", "mypassword");

    const user = await service.signin("test@test.com", "mypassword");
    expect(user).toBeDefined();
  });
});
