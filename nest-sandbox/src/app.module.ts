import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GuardsModule } from './guards/guards.module';
import { HealthCheckModule } from './healthcheck/healthcheck.module';
import { IntercepterModule } from './intercepter/intercepter.module';

@Module({
  imports: [GuardsModule, HealthCheckModule, IntercepterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
