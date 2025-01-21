import { Controller } from "@nestjs/common";
import { EventPattern, KafkaContext, Payload, Ctx, MessagePattern } from "@nestjs/microservices";

@Controller()
export class ConsumersController {
  @MessagePattern('event-a')
  public consumeEventA(
    @Payload() payload: any,
    @Ctx() context: KafkaContext,
  ) {
    const message = `service-c consume event-a ${JSON.stringify(payload)}.`
    console.log(message);
    return { message: message };
  }
}
