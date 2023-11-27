import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto"; // node 내장 라이브러리
import { promisify } from "util"; // node 내장 라이브러리

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length)
      throw new BadRequestException("이미 사용중인 이메일입니다");

    const salt = randomBytes(8).toString("hex"); // 8byte의 2진수를 16진수 문자열로 변환
    const hash = (await scrypt(password, salt, 32)) as Buffer; // password와 salt를 합쳐 32자의 문자 hash 반환
    // 결과 3f1415e012475090.de22ce3fabf18eb1fd79de1f6691520f368c7df39c5dce3184702b762a5ec2cb
    const result = salt + "." + hash.toString("hex");
    const user = await this.usersService.create(email, result);
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) throw new NotFoundException("등록되지 않은 이메일입니다");

    // DB에 저장된 salt를
    const [salt, storedHash] = user.password.split(".");
    // 입력받은 비밀번호와 함께 암호화
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString("hex"))
      throw new BadRequestException("잘못된 비밀번호입니다");
    return user;
  }
}
