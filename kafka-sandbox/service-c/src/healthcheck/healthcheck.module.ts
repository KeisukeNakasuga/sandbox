import { HttpModule } from "@nestjs/axios";
import { TerminusModule } from "@nestjs/terminus";
import { HealthCheckController } from "./healthcheck.controller";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    TerminusModule,
    HttpModule,
  ],
  providers: [],
  controllers: [
    HealthCheckController,
  ],
})
export class HealthCheckModule {}
