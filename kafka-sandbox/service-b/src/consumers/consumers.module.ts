import { KafkaModule } from "src/kafka/kafka.module";
import { ConsumersController } from "./consumers.controller";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    KafkaModule,
  ],
  controllers: [
    ConsumersController,
  ],
})
export class ConsumersModule {}
