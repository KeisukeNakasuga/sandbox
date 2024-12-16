import { Module } from "@nestjs/common";
import { HealthCheckController } from "./healthcheck.controller";
import { HealthCheckService, TerminusModule } from "@nestjs/terminus";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    TerminusModule,
    HttpModule,
  ],
  providers: [],
  controllers: [
    HealthCheckController
  ],
})
export class HealthCheckModule {}
