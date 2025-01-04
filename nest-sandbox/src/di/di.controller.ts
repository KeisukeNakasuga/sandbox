import { Controller, Get, Inject } from "@nestjs/common";
import { DiServiceA } from "./di.service_a";
import { DiServiceB } from "./di.service_b";
import { DiServiceD } from "./di.serice_d";
import { DiServiceC, DiServiceInterface } from "./di.service_c";

@Controller('di')
export class DiController {
  public constructor(
    private readonly service_a: DiServiceA,
    @Inject('DiServiceInterface') private readonly service_c: DiServiceInterface
  ) {}

  @Inject(DiServiceB)
  private readonly service_b: DiServiceB;

  @Inject(DiServiceD)
  private readonly service_d: DiServiceInterface;

  @Get('di_a')
  public di_a() {
    console.log('run DiController.di_a()');
    this.service_a.run();
    return;
  }

  @Get('di_b')
  public di_b() {
    console.log('run DiController.di_b()');
    this.service_b.run();
    return;
  }

  @Get('di_c')
  public di_c() {
    console.log('run DiController.di_c()');
    this.service_c.run();
    return;
  }

  @Get('di_d')
  public di_d() {
    console.log('run DiController.di_d()');
    this.service_d.run();
    return;
  }
}
