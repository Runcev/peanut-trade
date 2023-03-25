import { Module } from '@nestjs/common';
import { SpotModule } from './spot/spot.module';

@Module({
  imports: [SpotModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
