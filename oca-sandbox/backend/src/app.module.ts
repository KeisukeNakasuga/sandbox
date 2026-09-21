import { Module } from "@nestjs/common";
import { HealthcheckController } from "./healthcheck/healthcheck.controller";
import { VideosController } from "./videos/videos.controller";

@Module({
  controllers: [
    HealthcheckController,
    VideosController
  ],
})
export class AppModule {}
