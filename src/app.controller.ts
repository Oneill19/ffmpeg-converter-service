import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from './common/providers/config.service';

@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}

  @Get('ping')
  @ApiOperation({ summary: 'Test Service connection' })
  @ApiResponse({ status: 200, description: 'Service working' })
  ping() {
    const name = this.configService.get('name');
    const port = this.configService.get('port');
    const version = this.configService.get('version');
    return { name, port, version };
  }
}
