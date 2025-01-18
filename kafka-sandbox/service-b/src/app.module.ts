import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckModule } from './healthcheck/healthcheck.module';
import { ConsumersModule } from './consumers/consumers.module';

@Module({
  imports: [
    ConsumersModule,
    HealthCheckModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
