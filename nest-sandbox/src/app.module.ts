import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GuardsModule } from './guards/guards.module';
import { HealthCheckModule } from './healthcheck/healthcheck.module';
import { IntercepterModule } from './intercepter/intercepter.module';
import { ApiModule } from './api/api.module';
import { VersioningModule } from './versioning/versioning.module';
import { DiModule } from './di/di.module';

@Module({
  imports: [
    GuardsModule, 
    HealthCheckModule, 
    IntercepterModule,
    ApiModule,
    VersioningModule,
    DiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
