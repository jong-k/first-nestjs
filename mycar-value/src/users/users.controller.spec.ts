import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";

const TEST_EMAIL = "test@test.com";
const TEST_PASSWORD = "";

describe("UsersController", () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne(id: number) {
        return Promise.resolve({
          id,
          email: "test@test.com",
          password: "testtest",
        } as User);
      },
      find(email: string) {
        return Promise.resolve([
          { id: 1, email, password: "testtest" } as User,
        ]);
      },
      // async remove(id: number): Promise<User> {},
      // async update(id: number, attrs: Partial<User>): Promise<User> {},
    };
    fakeAuthService = {
      signup(email: string, password: string) {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      signin(email: string, password: string) {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    // DI 컨테이너
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("findAllUsers 가 주어진 이메일의 유저 리스트를 반환", async () => {
    const users = await controller.findAllUsers("test@test.com");
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual("test@test.com");
  });

  it("findUser 가 주어진 아이디의 유저를 반환", async () => {
    const user = await controller.findUser("1");
    expect(user).toBeDefined();
  });

  it("올바르지 않은 아이디가 주어지면, findUser 가 에러를 반환", async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser("1")).rejects.toThrow(NotFoundException);
  });

  it("signin 이 session 객체를 업데이트하고 유저를 반환", async () => {
    const session = { userId: 0 };
    const user = await controller.signin(
      {
        email: "test@test.com",
        password: "testtest",
      },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  it("createUser가 session 객체를 업데이트하고 유저를 반환", async () => {
    const session = { userId: 0 };
    const user = await controller.createUser(
      {
        email: "test@test.com",
        password: "testtest",
      },
      session,
    );
    expect(user).toBeDefined();
    expect(session.userId).toEqual(1);
  });
});
