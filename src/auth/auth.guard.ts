import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    //console.log(request.headers['authorization'] )
    const authorizationHeader = request.headers['authorization'];

    if (authorizationHeader) {
      const [type, token] = authorizationHeader.split(' ');
      return type === 'Bearer' ? token : undefined;
    }
    return undefined;
  }
}
