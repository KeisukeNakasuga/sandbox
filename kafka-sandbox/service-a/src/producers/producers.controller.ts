import { Controller, Get, Inject } from "@nestjs/common";
import { ProduceEvent, ProduceEventA2Service, ProduceEventAService, ProduceEventBService } from "./producers.service";

@Controller('produce')
export class ProducersController {
  @Inject(ProduceEventAService)
  private readonly produceEventAService: ProduceEvent;
  @Inject(ProduceEventA2Service)
  private readonly produceEventA2Service: ProduceEvent;
  @Inject(ProduceEventBService)
  private readonly produceEventBService: ProduceEvent;

  @Get('event-a')
  public produceEventA() {
    return this.produceEventAService.produce();
  }

  @Get('event-a-2')
  public produceEventA2() {
    return this.produceEventA2Service.produce();
  }

  @Get('event-b')
  public produceEventB() {
    return this.produceEventBService.produce();
  }
}
