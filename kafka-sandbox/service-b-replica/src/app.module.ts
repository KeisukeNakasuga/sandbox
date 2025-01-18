import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsumersModule } from './consumers/consumers.module';
import { HealthCheckModule } from './healthcheck/healthcheck.module';

@Module({
  imports: [
    ConsumersModule,
    HealthCheckModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
