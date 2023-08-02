import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDetailsDto } from 'src/users/dto/userDetails.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth/login')
  async login(@Body() loginDto: UserDetailsDto) {
    return this.authService.signIn(loginDto.email, loginDto.password);
  }
}
