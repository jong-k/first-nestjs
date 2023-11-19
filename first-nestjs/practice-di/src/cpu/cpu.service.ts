import { Injectable } from "@nestjs/common";
import { PowerService } from "../power/power.service";

@Injectable()
export class CpuService {
  constructor(private powerService: PowerService) {}

  compute(a: number, b: number) {
    console.log("Power Service 에서 10 와트 파워 사용");
    this.powerService.supplyPower(10);
    return a + b;
  }
}
