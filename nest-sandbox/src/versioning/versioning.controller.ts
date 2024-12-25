import { Controller, Get, Version } from "@nestjs/common";

@Controller('versioning')
export class VersioningController {
  @Get()
  @Version('1')
  public v1() {
    console.log('run VersioningController.v1()');
    return;
  }

  @Get()
  @Version('1.1')
  public v1_1() {
    console.log('run VersioningController.v1.1()');
    return;
  }

  @Get()
  @Version('2')
  public v2() {
    console.log('run VersioningController.v2()');
    return;
  }
}
