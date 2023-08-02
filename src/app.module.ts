import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { User } from './Entities/user.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserData } from './Entities/userData.entities';
import { UserRole } from './Entities/roles.entities';
import { Product } from './Entities/product.entities';
import { Company } from './Entities/company.entities';
// import { Genre } from './Entities/genre.entities';
// import { Movie } from './Entities/movie.entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://127.0.0.1:27017/nestjs_demo',
      entities: [User, UserData, UserRole, Product, Company],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
