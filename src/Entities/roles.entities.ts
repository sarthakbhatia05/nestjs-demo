import { Entity, ObjectIdColumn, ObjectId, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entities';

@Entity({ name: 'roles' })
export class UserRole {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  roleName: string;

  @OneToMany(() => User, (user) => user.roles, { cascade: true })
  @JoinColumn()
  user: User[];
}
