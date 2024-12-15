import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GuardsModule } from './guards/guards.module';

@Module({
  imports: [GuardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
