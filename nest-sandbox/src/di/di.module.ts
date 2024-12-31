import { Module } from "@nestjs/common";
import { DiServiceA } from "./di.service_a";
import { DiController } from "./di.controller";
import { DiServiceB } from "./di.service_b";
import { DiServiceC } from "./di.service_c";

@Module({
  providers: [
    DiServiceA,
    DiServiceB,
    {
      provide: 'DiServiceInterface',
      useClass: DiServiceC,
    }
  ],
  controllers: [
    DiController,
  ],
})
export class DiModule {}
