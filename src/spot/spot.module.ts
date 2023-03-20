import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SpotService } from './spot.service';
import { SpotController } from './spot.controller';

@Global()
@Module({
  imports: [HttpModule],
  providers: [SpotService],
  exports: [SpotService],
  controllers: [SpotController],
})
export class SpotModule {}
