import { Column, Entity, ObjectId, ObjectIdColumn, OneToOne } from 'typeorm';
import { User } from './user.entities';

@Entity({ name: 'userData' })
export class UserData {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  city: string;

  @Column()
  age: number;

  @Column()
  gender: string;

  //   @OneToOne(() => User, user => user.userData)
  //   user: User;
}
