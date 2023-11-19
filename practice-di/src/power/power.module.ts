import { Module } from "@nestjs/common";
import { PowerService } from "./power.service";

@Module({
  providers: [PowerService],
  // private을 다른 모듈에서 사용할 수 있도록 해줌
  // 여기 추가하지 않으면 내부에서만 사용 가능
  exports: [PowerService],
})
export class PowerModule {}
