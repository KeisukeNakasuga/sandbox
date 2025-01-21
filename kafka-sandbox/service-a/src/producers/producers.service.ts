import { Inject, Injectable } from "@nestjs/common";
import { KafkaService } from "src/kafka/kafka.service";
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';
import { partition } from "rxjs";

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
      const serviceName = process.env.SERVICE_NAME;

      const res = await this.kafkaService
        .getClient()
        .emit('event-a', {
          messages: {
            key: uuid,
            value: JSON.stringify({
              message: `event-a test message by ${serviceName}.`,
              createdAt: now,
            }),
          },
        })
        .toPromise();

      return res;
    } catch (err) {
      console.log(err);
    }
  } 
}

export class ProduceEventA2Service implements ProduceEvent {
  @Inject(KafkaService)
  private readonly kafkaService: KafkaService;

  public async produce() {
    try {
      const uuid = uuidv4();
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const serviceName = process.env.SERVICE_NAME;

      const res = await this.kafkaService
        .getClient()
        .send('event-a', {
          key: uuid,
          value: `event-a test message by ${serviceName}.(partition指定)`,
          partition: 0,
        })
        .toPromise();

      return res;
    } catch (err) {
      console.log(err);
    }
  }
}

@Injectable()
export class ProduceEventBService implements ProduceEvent {
  @Inject(KafkaService)
  private readonly kafkaService: KafkaService;

  public async produce() {
    try {
      const uuid = uuidv4();
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const serviceName = process.env.SERVICE_NAME;

      const res = await this.kafkaService
        .getClient()
        .send('event-b', {
          messages: {
            key: uuid,
            value: JSON.stringify({
              message: `event-b test message by ${serviceName}.`,
              createdAt: now,
            }),
          },
        })
        .toPromise();

      return res;
    } catch (err) {
      console.log(err);
    }
  }
}
