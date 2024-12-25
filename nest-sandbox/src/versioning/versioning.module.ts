import { Module } from "@nestjs/common";
import { VersioningController } from "./versioning.controller";

@Module({
  controllers: [
    VersioningController,
  ],
})
export class VersioningModule {}
