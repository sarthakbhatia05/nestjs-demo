import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, Repository } from 'typeorm';
import { UserDetailsDto } from './dto/userDetails.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/Entities/user.entities';
import { UserRole } from 'src/Entities/roles.entities';
import { Company } from 'src/Entities/company.entities';
import { Product } from 'src/Entities/product.entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: MongoRepository<User>,
    @InjectRepository(UserRole) private roleRepository: Repository<UserRole>,
    @InjectRepository(Company) private companyRepo: Repository<Company>,
  ) {}

  fetchUsers() {
    return this.userRepository.find({ relations: ['roles'] });
  }

  async fetchUserByEmail(email: string) {
    const user1 = await this.userRepository
      .aggregate([
        {
          $match: { email: email },
        },
      ])
      .toArray();

    console.log(user1);
    const user = await this.userRepository.findOne({ where: { email: email } });
    const role1 = new UserRole();
    role1.roleName = 'Admin';
    role1.user = user;

    this.roleRepository.save(role1);

    if (!user) {
      throw new BadRequestException({
        error: 'No User Found !',
      });
    }

    return user1;
  }

  async createUser(userDetails: UserDetailsDto) {
    const alreadyExist = await this.userRepository.findOne({
      where: { email: userDetails.email },
    });
    if (alreadyExist) {
      throw new BadRequestException({
        error: 'User already exists !',
      });
    }
    const password = await bcrypt.hash(userDetails.password, 10);
    const roles = [];
    const { email, name } = userDetails;
    const newUser = await this.userRepository.create({
      email,
      name,
      password,
      roles,
      createdAt: new Date(),
    });
    const save = await this.userRepository.save(newUser);
    console.log(save);
    return save;
  }

  async deleteUser(email: string) {
    const doesExist = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!doesExist) {
      throw new BadRequestException({
        error: 'User does not exist !',
      });
    }
    const deleteUser = await this.userRepository.delete({ email });
    //console.log(deleteUser);

    return deleteUser;
  }

  async getUserByEmail(email: string) {
    // const user = await this.userRepository
    //   .aggregate([
    //     {
    //       $match: { email: email },
    //     },
    //     {
    //       $project: { name: 1 },
    //     },
    //   ])
    //   .toArray();
    const user1 = await this.userRepository.findOne({
      where: { email: email },
    });
    return user1;
  }

  updateUserByEmail(email: string, userDetails: UserDetailsDto) {
    return this.userRepository.update({ email }, { ...userDetails });
  }

  //tempo

  async addRole(roleName: string) {
    const newRole = this.roleRepository.create({ roleName });
    const save = await this.roleRepository.save(newRole);
    return save;
  }

  async assignUserRole(
    email: string,
    roleName: string,
  ): Promise<any | undefined> {
    // const user = await this.userRepository.findOne({
    //   where: { email: email },
    //   relations: ['roles'],
    // });

    const user = await this.userRepository
      .aggregate([
        {
          $match: { email: email },
        },
      ])
      .toArray();

    if (!user) {
      throw new BadRequestException({
        error: 'User does not exist !',
      });
    }
    console.log(user);

    // const role1 = new UserRole();
    // role1.roleName = roleName;
    // role1.user = user;
    // const role2 = new UserRole();
    // role2.roleName = 'Admin2';
    // role2.user = user;
    // user.roles.push(role1, role2);
    // console.log(role1);

    //user.roles.push(role);
    // console.log(user.roles);
    // return await this.userRepository.save(user);
    return user

    //return user;
  }

  async addCompany() {
    const products: Product[] = [];
    const iphone = new Product();
    iphone.description = 'Smartphone';
    iphone.price = 10000;

    const ipad = new Product();
    ipad.description = 'Tablet';
    ipad.price = 20000;

    const macbook = new Product();
    macbook.description = 'Laptop';
    macbook.price = 30000;

    products.push(iphone, ipad, macbook);

    const company: Company = new Company();
    company.name = 'Apple';
    company.description = 'Tech Company';
    company.products = products;
    //return this.companyRepo.save(company)

    const newData = await this.companyRepo.find({
      relations: { products: true },
    });
    return newData;
  }
}
