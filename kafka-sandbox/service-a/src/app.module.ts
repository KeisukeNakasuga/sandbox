import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckModule } from './healthcheck/healthcheck.module';
import { ProducersModule } from './producers/producers.module';

@Module({
  imports: [
    ProducersModule,
    HealthCheckModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
