import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto"; // node 내장 라이브러리
import { promisify } from "util"; // node 내장 라이브러리

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length) throw new BadRequestException("email in use");
    const salt = randomBytes(8).toString("hex"); // 8byte의 2진수를 16진수 문자열로 변환
    const hash = (await scrypt(password, salt, 32)) as Buffer; // password와 salt를 합쳐 32자의 문자 hash 반환
    const result = salt + "." + hash.toString("hex");
    const user = await this.usersService.create(email, result);
    return user;
  }

  signin() {}
}
