import { Module } from "@nestjs/common";
import { ProducersController } from "./producers.controller";
import { ProduceEventA2Service, ProduceEventAService, ProduceEventBService } from "./producers.service";
import { KafkaModule } from "src/kafka/kafka.module";

@Module({
  imports: [
    KafkaModule,
  ],
  providers: [
    ProduceEventAService,
    ProduceEventA2Service,
    ProduceEventBService,
  ],
  controllers: [
    ProducersController,
  ],
})
export class ProducersModule {}
