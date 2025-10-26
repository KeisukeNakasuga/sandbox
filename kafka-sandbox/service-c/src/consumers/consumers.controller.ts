import { Controller, UseInterceptors } from "@nestjs/common";
import { EventPattern, KafkaContext, Payload, Ctx, MessagePattern } from "@nestjs/microservices";
import { ConsumerService } from "./consumers.service";
import { ConsumerRunInterceptor } from "./consumer-run.intercepter";
import { ConsumerException } from "./consumer-exception.interceptor";

@UseInterceptors(
  ConsumerException,
  ConsumerRunInterceptor
)
@Controller()
export class ConsumersController {
  constructor (
    private readonly service: ConsumerService,
  ) {}

  @MessagePattern('event-a')
  public async consumeEventA(
    @Payload() payload: any,
    @Ctx() context: KafkaContext,
  ) {
    const message = `service-c consume event-a ${JSON.stringify(payload)}.`
    console.log(message);

    this.service.execute();
    throw new Error('error');
    
    return { message: message };
  }
}
