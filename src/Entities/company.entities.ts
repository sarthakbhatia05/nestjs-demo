import { Column, Entity, ObjectIdColumn, OneToMany } from 'typeorm';
import { Product } from './product.entities';
import { ObjectId } from 'mongodb';

@Entity()
export class Company {
  @ObjectIdColumn()
  id: ObjectId;
  @Column()
  name: string;

  @Column()
  description: string;

  @Column(() => Product)
  products: Product[];

  //   @ObjectIdColumn({ name: 'product', array: true })
  //   products: ObjectId[] | Product[]

  //   @OneToMany(() => Product, (product) => product.company, { cascade: true })
  //   products: Product[];
}
