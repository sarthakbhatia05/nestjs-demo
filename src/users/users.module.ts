import { User } from 'src/Entities/user.entities';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserData } from 'src/Entities/userData.entities';
import { UserRole } from 'src/Entities/roles.entities';
import { Product } from 'src/Entities/product.entities';
import { Company } from 'src/Entities/company.entities';
// import { Genre } from 'src/Entities/genre.entities';
// import { Movie } from 'src/Entities/movie.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserData, UserRole, Product, Company]),
    forwardRef(() => AuthModule),
    JwtModule.register({}),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
