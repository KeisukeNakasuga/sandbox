import { Module } from "@nestjs/common";
import { KafkaModule } from "src/kafka/kafka.module";
import { ConsumersController } from "./consumers.controller";
import { ConsumerService } from "./consumers.service";

@Module({
  imports: [
    KafkaModule,
  ],
  controllers: [
    ConsumersController,
  ],
  providers: [
    ConsumerService
  ]
})
export class ConsumersModule {}
