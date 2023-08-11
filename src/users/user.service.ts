import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
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
    @InjectRepository(UserRole)
    private roleRepository: MongoRepository<UserRole>,
    @InjectRepository(Company) private companyRepo: Repository<Company>,
  ) {}

  fetchUsers() {
    return this.userRepository.find({ relations: ['roles'] });
  }

  async fetchUserByEmail(email: string) {
    const user1 = await this.userRepository
      .aggregate([
        {
          $lookup: {
            from: 'roles',
            localField: 'roles',
            foreignField: '_id',
            as: 'roles',
          },
        },
        {
          $match: {
            email: email,
          },
        },
        {
          $project: {
            'roles.user': 0,
          },
        },
      ])
      .toArray();

    console.log(user1);
    // const user = await this.userRepository.findOne({ where: { email: email } });
    // const role1 = new UserRole();
    // role1.roleName = 'Admin';
    // role1.user = user;

    // this.roleRepository.save(role1);

    if (!user1) {
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
    const roles = undefined;
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
    // const doesExist = await this.userRepository.findOne({
    //   where: { email: email },
    // });

    const user = await this.userRepository
      .aggregate([
        {
          $match: { email: email },
        },
      ])
      .toArray();
    if (user.length == 0) {
      throw new BadRequestException({
        error: 'User does not exist !',
      });
    }
    const userRole = user[0].roles.roleName;
    // const roles = await this.roleRepository.updateOne(
    //   {
    //     roleName: userRole,
    //   },
    //   {
    //     $pull: {
    //       user: { email: email },
    //     },
    //   },
    // );

    //roles[0].user.p;

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

  async updateUserByEmail(email: string, userDetails: UserDetailsDto) {
    const userRole = await this.userRepository
      .aggregate([
        {
          $match: { email: email },
        },
      ])
      .toArray();
    await this.roleRepository.updateOne(
      {
        roleName: userRole[0].roles.roleName,
        'user.email': email,
      },
      {
        $set: {
          'user.$.email': userDetails.email,
          'user.$.name': userDetails.name,
        },
      },
    );
    return this.userRepository.update({ email }, { ...userDetails });
  }

  //tempo

  async addRole(roleName: string) {
    const user = [];
    const newRole = this.roleRepository.create({ roleName, user });
    const save = await this.roleRepository.save(newRole);
    return save;
  }

  async assignUserRole(
    // email: string,
    roleName: string,
  ): Promise<any | undefined> {
    // const user = await this.userRepository.findOne({
    //   where: { email: email },
    //   relations: ['roles'],
    // });
    // const user = await this.userRepository
    //   .aggregate([
    //     {
    //       $match: { email: email },
    //     },
    //   ])
    //   .toArray();
    // if (!user) {
    //   throw new BadRequestException({
    //     error: 'User does not exist !',
    //   });
    // }
    // console.log(user);
    // const role1 = new UserRole()
    // role1.roleName = roleName
    // role1.user = undefined
    // role1.user = user[0]
    //role1.user = user[0]
    // return this.roleRepository.save(role1)
    //return this.roleRepository.save(role1)
    // role1.roleName = roleName;
    // role1.user = user;
    // const role2 = new UserRole();
    // role2.roleName = 'Admin2';
    // role2.user = user;
    // user[0].roles.push(role1)
    //console.log(role1);
    //user.roles.push(role);
    // console.log(user.roles);
    //console.log(user[0].roles)
    //return await this.userRepository.save(user);
    // return user
    //return user;
  }

  async updateUserRole(email: string, roleName: string) {
    const user = await this.userRepository.findOne({ where: { email: email } });

    const role = await this.roleRepository
      .aggregate([
        {
          $match: { roleName: roleName },
        },
        {
          $project: { _id: 0 },
        },
      ])
      .toArray();

    if (role.length == 0) {
      throw new BadRequestException({
        error: 'No role named ' + roleName,
      });
    }
    const roles = role[0].user;
    roles.push(user._id);
    console.log(roles);
    // console.log(role[0])
    // roles.push(role[0]);
    // console.log(roles)
    //user[0].roles.push(role[0])
    // console.log(role[0]);
    // console.log(user);
    // role[0].user.push(user)

    this.roleRepository.updateOne(
      { roleName: roleName },
      { $set: { user: roles } },
    );
    const role1 = await this.roleRepository.findOne({
      where: { roleName: roleName },
    });

    this.userRepository.updateOne(
      { _id: user._id },
      { $set: { roles: role1.id } },
    );
    //role[0].user = user[0]

    //this.roleRepository.save(role[0])
    return this.userRepository.save(user);
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

  fetchAllRoles() {
    return this.roleRepository
      .aggregate([
        {
          $unwind: '$user',
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $project: {
            'user.roles': 0,
          },
        },
        // {
        //   $unwind: '$userDetails',
        // },
        // {
        //   $group: {
        //     _id: '$_id',
        //     user: { $push: '$userDetails' },
        //     // ... other fields you want to keep in the result
        //   },
        // },
      ])
      .toArray();
  }
}
