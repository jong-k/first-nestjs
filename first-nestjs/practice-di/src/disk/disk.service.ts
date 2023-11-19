import { Injectable } from "@nestjs/common";
import { PowerService } from "../power/power.service";

@Injectable()
export class DiskService {
  constructor(private powerService: PowerService) {}

  getData() {
    console.log("PowerService에서 20와트 사용");
    this.powerService.supplyPower(20);
    return "data!";
  }
}
