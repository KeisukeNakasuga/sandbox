import { Controller, Get, Inject } from "@nestjs/common";
import { ProduceEvent, ProduceEventAService } from "./producers.service";

@Controller('produce')
export class ProducersController {
  @Inject(ProduceEventAService)
  private readonly produceEventAService: ProduceEvent;

  @Get('event-a')
  public produceEventA() {
    return this.produceEventAService.produce();
  }
}
