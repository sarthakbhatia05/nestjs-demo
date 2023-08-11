import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDetailsDto } from './dto/userDetails.dto';
import { JoiValidationPipe } from './joi-validation.pipe';
import { createUserSchema } from './userValidateSchema';
import { AuthGuard } from 'src/auth/auth.guard';

//@UseGuards(AuthGuard)
@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/fetchusers')
  getUsers() {
    const users = this.userService.fetchUsers();
    return users;
  }

  @Get('fetchuserbyid/:email')
  getUserByEmail(
    @Param('email')
    email: string,
  ) {
    return this.userService.fetchUserByEmail(email);
  }

  @Post('/addnewuser')
  createUser(@Body(ValidationPipe) userDetails: UserDetailsDto) {
    return this.userService.createUser(userDetails);
  }

  @Put('/updateuser/:email')
  updateUser(
    @Body()
    userDetails: UserDetailsDto,
    @Param('email')
    email: string,
  ) {
    return this.userService.updateUserByEmail(email, userDetails);
  }

  @Delete('/deleteuser/:email')
  deleteUserByEmail(@Param('email') email: string) {
    // console.log(this.userService.deleteUser(id));
    return this.userService.deleteUser(email);
  }

  @Post('roles/:email')
  async assignRoleToUser(
    @Param('email') email: string,
    @Body('roleName') roleName: string,
  ) {
    //return await this.userService.assignUserRole(roleName);
    return this.userService.updateUserRole(email, roleName);
  }

  // Tempo

  @Post('addrole')
  AddRole(@Body('roleName') role: string) {
    return this.userService.addRole(role);
  }

  @Get('company')
  companyDetails() {
    return this.userService.addCompany();
  }

  @Get('fetchroles')
  fetchRoles() {
    return this.userService.fetchAllRoles();
  }
}
