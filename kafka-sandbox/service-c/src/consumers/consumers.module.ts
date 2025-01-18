import { Module } from "@nestjs/common";
import { KafkaModule } from "src/kafka/kafka.module";
import { ConsumersController } from "./consumers.controller";

@Module({
  imports: [
    KafkaModule,
  ],
  controllers: [
    ConsumersController,
  ],
})
export class ConsumersModule {}
