import { Module } from "@nestjs/common";
import { GuardsController } from "./guards.controller";
import { GuardsService } from "./guards.service";

@Module({
  providers: [
    GuardsService,
  ],
  controllers: [
    GuardsController,
  ],
})
export class GuardsModule {} 
