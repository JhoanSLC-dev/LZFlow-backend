import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { Category } from '../categories/category.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { Sale } from '../sales/sale.entity';

@Entity('organizations')
export class Organization {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 255 })
    name: string;

    @Column({ nullable: true, type: 'text' })
    description: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => User, (user) => user.organization)
    users: User[];

    @OneToMany(() => Product, (product) => product.organization)
    products: Product[];

    @OneToMany(() => Category, (category) => category.organization)
    categories: Category[];

    @OneToMany(() => Supplier, (supplier) => supplier.organization)
    suppliers: Supplier[];

    @OneToMany(() => Sale, (sale) => sale.organization)
    sales: Sale[];
}
