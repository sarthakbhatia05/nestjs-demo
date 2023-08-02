import { Entity, ObjectIdColumn, ObjectId, Column, ManyToOne } from 'typeorm';
import { User } from './user.entities';

@Entity({ name: 'roles' })
export class UserRole {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  roleName: string;

  @ManyToOne(() => User, (user) => user.roles)
  user: User;
}
