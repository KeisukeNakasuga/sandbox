import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GuardsModule } from './guards/guards.module';
import { HealthCheckModule } from './healthcheck/healthcheck.module';

@Module({
  imports: [GuardsModule, HealthCheckModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
