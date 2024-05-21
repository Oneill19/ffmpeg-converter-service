import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from './providers/config.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwtSecret'),
      }),
    }),
  ],
  providers: [ConfigService, JwtService],
  exports: [ConfigService, JwtService],
})
export class CommonModule {}
