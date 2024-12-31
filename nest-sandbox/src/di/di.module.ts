import { Module } from "@nestjs/common";
import { DiServiceA } from "./di.service_a";
import { DiController } from "./di.controller";
import { DiServiceB } from "./di.service_b";

@Module({
  providers: [
    DiServiceA,
    DiServiceB,
  ],
  controllers: [
    DiController,
  ],
})
export class DiModule {}
