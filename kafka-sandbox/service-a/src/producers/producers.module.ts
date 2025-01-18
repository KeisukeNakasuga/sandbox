import { Module } from "@nestjs/common";
import { ProducersController } from "./producers.controller";
import { ProduceEventAService, ProduceEventBService } from "./producers.service";
import { KafkaModule } from "src/kafka/kafka.module";

@Module({
  imports: [
    KafkaModule,
  ],
  providers: [
    ProduceEventAService,
    ProduceEventBService,
  ],
  controllers: [
    ProducersController,
  ],
})
export class ProducersModule {}
