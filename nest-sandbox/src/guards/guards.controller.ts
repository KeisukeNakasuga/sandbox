import { Controller, Get, UseGuards } from '@nestjs/common';
import { GuardsService } from './guards.service';
import { SampleGuard } from './guards.guards';

@Controller()
export class GuardsController {
  public constructor(private readonly service: GuardsService) {}

  @Get('/guards/run')
  @UseGuards(SampleGuard)
  public run(): string {
    console.log('run GuardsController.run()');
    this.service.run();
    return 'hello guards';
  }
}
