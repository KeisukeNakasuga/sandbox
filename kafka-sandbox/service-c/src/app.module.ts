import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckModule } from './healthcheck/healthcheck.module';
import { ConsumersModule } from './consumers/consumers.module';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    ConsumersModule,
    HealthCheckModule,
    ClsModule.forRoot({
      global: true
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
