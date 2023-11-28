import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Patch,
  Query,
  NotFoundException,
  Session,
  UseInterceptors,
} from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UsersService } from "./users.service";
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { CurrentUserInterceptor } from "./interceptors/current-user.interceptor";
import { User } from "./user.entity";

@Controller("auth")
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  // 쿠키 세션 테스트를 위한 임시 req handler
  // /colors/red 이렇게 요청보내면 Set-Cookie에 red 설정
  @Get("/colors/:color")
  setColor(@Param("color") color: string, @Session() session: any) {
    session.color = color;
  }
  // 쿠키 세션 테스트를 위한 임시 req handler
  // 위에서 설정한 color가 응답 body로 반환됨
  @Get("/colors")
  getColor(@Session() session: any) {
    return session.color;
  }

  // @Get("/whoami")
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userId); // 쿠키가 세션이 있기 때문에 포스트맨에서 안없어짐
  // }

  @Get("whoami")
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post("/signup")
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id; // 세션에 userId 등록해서 응답
    return user;
  }

  @Post("/signin")
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id; // 세션에 userId 등록해서 응답
    return user;
  }

  @Post("/signout")
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get("/:id")
  async findUser(@Param("id") id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) throw new NotFoundException("user not found");
    return user;
  }

  @Get()
  findAllUsers(@Query("email") email: string) {
    return this.usersService.find(email);
  }

  @Delete("/:id")
  removeUser(@Param("id") id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch("/:id")
  updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
