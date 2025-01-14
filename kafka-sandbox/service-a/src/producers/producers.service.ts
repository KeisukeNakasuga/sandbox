import { Inject, Injectable } from "@nestjs/common";
import { KafkaService } from "src/kafka/kafka.service";
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';

export interface ProduceEvent {
  produce();
}

@Injectable()
export class ProduceEventAService implements ProduceEvent {
  @Inject(KafkaService)
  private readonly kafkaService: KafkaService;

  public async produce() {
    try {
      const uuid = uuidv4();
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss'); 

      const res = await this.kafkaService
        .getClient()
        .emit('event-a', {
          messages: {
            key: uuid,
            value: JSON.stringify({
              message: 'event-a test message.',
              createdAt: now,
            }),
          },
        })
        .toPromise();

      return res;
    } catch (error) {
      console.log(error);
    }
  } 
}
