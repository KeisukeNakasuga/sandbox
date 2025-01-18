import { Controller, Get, Inject } from "@nestjs/common";
import { ProduceEvent, ProduceEventAService, ProduceEventBService } from "./producers.service";

@Controller('produce')
export class ProducersController {
  @Inject(ProduceEventAService)
  private readonly produceEventAService: ProduceEvent;
  @Inject(ProduceEventBService)
  private readonly produceEventBService: ProduceEvent;

  @Get('event-a')
  public produceEventA() {
    return this.produceEventAService.produce();
  }

  @Get('event-b')
  public produceEventB() {
    return this.produceEventBService.produce();
  }
}
