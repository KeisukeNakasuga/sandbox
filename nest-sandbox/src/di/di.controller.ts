import { Controller, Get } from "@nestjs/common";
import { DiServiceA } from "./di.service_a";

@Controller('di')
export class DiController {
  public constructor(private readonly service_a: DiServiceA) {}

  @Get('di_1')
  public di_1() {
    console.log('run DiController.di_a()');
    this.service_a.run();
    return;
  }
}
