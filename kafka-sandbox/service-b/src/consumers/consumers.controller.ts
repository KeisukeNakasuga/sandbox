import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, KafkaContext, Payload } from "@nestjs/microservices";

@Controller()
export class ConsumersController {
  @EventPattern('event-a')
  public consumeEventA(
    @Payload() message: any,
    @Ctx() context: KafkaContext,
  ) {
    console.log('service-b consume event-a.');
  }
}
