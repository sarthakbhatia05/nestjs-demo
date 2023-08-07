import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectId,
  ObjectIdColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserRole } from './roles.entities';

@Entity({ name: 'users' })
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  createdAt: Date;

  // @OneToMany(() => UserRole, (role) =>role.user)
  // roles: Role[]

  @ManyToOne(() => UserRole, (userRole) => userRole.user)
  roles: UserRole 

  // @OneToOne(() => UserData, userData => userData.user, { cascade: true })
  // @JoinColumn()
  // userData: UserData;
}
