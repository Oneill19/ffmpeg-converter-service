import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../common/providers/config.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  createJwtToken(username: string) {
    const secret = this.configService.get('jwtSecret');
    return this.jwtService.sign({ username }, { secret });
  }

  decodeJwt(bearerToken: string) {
    const secret = this.configService.get('jwtSecret');
    return this.jwtService.verify(bearerToken, { secret });
  }
}
