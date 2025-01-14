import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  @Inject('KAFKA_CLIENT')
  private readonly client: ClientKafka;

  public async onModuleInit() {
    // TODO ここでこのサービスが購読するtopic名を設定
    await this.client.connect();
  }

  public async onModuleDestroy() {
    await this.client.close();
  }

  public getClient(): ClientKafka {
    return this.client;
  }
}
