import {
  Column,
  Entity,
  JoinColumn,
  ObjectId,
  ObjectIdColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserRole } from './roles.entities';

@Entity({ name: 'users' })
export class User {
  @ObjectIdColumn()
  id: ObjectId;

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

  @OneToMany(() => UserRole, (userRole) => userRole.user, { cascade: true })
  @JoinColumn()
  roles: UserRole[];

  // @OneToOne(() => UserData, userData => userData.user, { cascade: true })
  // @JoinColumn()
  // userData: UserData;
}
