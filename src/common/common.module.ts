import { Global, Module } from '@nestjs/common';
import { ConfigService } from './providers/config.service';

@Global()
@Module({
  imports: [],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class CommonModule {}
