import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException({
        error: 'User Does not exist',
      });
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException({
        error: 'Password Does not match !',
      });
    }

    const payload = { id: user._id, username: user.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
