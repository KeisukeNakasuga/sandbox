import { Module } from "@nestjs/common";
import { DiServiceA } from "./di.service_a";
import { DiController } from "./di.controller";

@Module({
  providers: [
    DiServiceA,
  ],
  controllers: [
    DiController,
  ],
})
export class DiModule {}
