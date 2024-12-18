import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { SampleIntercepter } from "./sample.intercepter";

@Controller('/intercepter')
export class IntercepterController {
  public constructor() {}

  @Get()
  @UseInterceptors(SampleIntercepter)
  public intercepter() {
    console.log('run IntercepterController.run()');
    return;
  }
}
