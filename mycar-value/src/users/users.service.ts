import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  // private 키워드를 사용하여 프로퍼티 할당을 생략 가능
  // InjectRepository 를 활용하여 의존성 주입
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    // typeorm의 save API: 주어진 엔터티를 데이터베이스에 저장
    // 엔터티가 DB에 없으면 삽입, 있으면 업데이트
    return this.repo.save(user);
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  update() {}

  remove() {}
}
