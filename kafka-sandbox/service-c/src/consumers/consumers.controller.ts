import { Controller } from "@nestjs/common";
import { EventPattern, KafkaContext, Payload, Ctx } from "@nestjs/microservices";

@Controller()
export class ConsumersController {
  @EventPattern('event-a')
  public consumeEventA(
    @Payload() message: any,
    @Ctx() context: KafkaContext
  ) {
    console.log('service-c consume event-a.');
  }
} 
