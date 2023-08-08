import { Column, Entity, ManyToMany, ObjectId, ObjectIdColumn } from 'typeorm';
import { Company } from './company.entities';

@Entity()
export class Product {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  description: string;

  //   @ManyToMany(() => Company, (company) => company.products)
  //   company: Company;
}
