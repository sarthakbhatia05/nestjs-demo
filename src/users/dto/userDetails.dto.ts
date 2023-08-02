import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserDetailsDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  name: string;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long.',
  })
  password: string;
}
