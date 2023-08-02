import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string; //classvalidator

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  createdAt: Date;
}
