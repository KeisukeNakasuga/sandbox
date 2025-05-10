import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GuardsModule } from './guards/guards.module';
import { HealthCheckModule } from './healthcheck/healthcheck.module';
import { IntercepterModule } from './intercepter/intercepter.module';
import { VersioningModule } from './versioning/versioning.module';
import { DiModule } from './di/di.module';
import { LogModule } from './log/log.module';
import { RequestLoggingMidleware, ResponseLoggingMidleware } from './log/log.middleware';

@Module({
  imports: [
    GuardsModule, 
    HealthCheckModule, 
    IntercepterModule,
    VersioningModule,
    DiModule,
    LogModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMidleware).forRoutes('*');
    consumer.apply(ResponseLoggingMidleware).forRoutes('*');  
  }
}
