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
} from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UsersService } from "./users.service";
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
@Serialize(UserDto)
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

  @Post("/signup")
  createUser(@Body() body: CreateUserDto) {
    // this.usersService.create(body.email, body.password);
    return this.authService.signup(body.email, body.password);
  }

  @Post("/signin")
  signin(@Body() body: CreateUserDto) {
    return this.authService.signin(body.email, body.password);
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
