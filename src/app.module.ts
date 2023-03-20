import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpotModule } from './spot/spot.module';

@Module({
  imports: [SpotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
