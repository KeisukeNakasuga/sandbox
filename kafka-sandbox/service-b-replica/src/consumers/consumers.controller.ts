import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, KafkaContext, MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class ConsumersController {
  @MessagePattern('event-a')
  public consumeEventA(
    @Payload() payload: any,
    @Ctx() context: KafkaContext,
  ) {
    const message = `service-b-replica consume event-a ${JSON.stringify(payload)}.`
    console.log(message);
    return { message: message };
  }
}
