import { Injectable } from "@nestjs/common";
import { ClsService } from "nestjs-cls";

@Injectable()
export class ConsumerService {
  constructor(
    private readonly cls: ClsService
  ) {}

  execute() {
    const clsValue = this.cls.get('sampleKey');
    console.log(`sampleKey: ${clsValue}`);
  }
}
