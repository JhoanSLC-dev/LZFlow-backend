import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Organization } from '../organizations/organization.entity';
import { Category } from '../categories/category.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { SaleItem } from '../sales/saleItem.entity';
import { ProductStatus } from '../../shared/constants';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    organizationId: string;

    @ManyToOne(() => Organization, (org) => org.products)
    @JoinColumn({ name: 'organizationId' })
    organization: Organization;

    @Column({ nullable: true, type: 'varchar' })
    categoryId: string | null;

    @ManyToOne(() => Category, (cat) => cat.products, { nullable: true })
    @JoinColumn({ name: 'categoryId' })
    category: Category | null;

    @Column({ nullable: true, type: 'varchar' })
    supplierId: string | null;

    @ManyToOne(() => Supplier, (sup) => sup.products, { nullable: true })
    @JoinColumn({ name: 'supplierId' })
    supplier: Supplier | null;

    @Column({ unique: true, length: 50 })
    sku: string;

    @Column({ length: 255 })
    name: string;

    @Column({ nullable: true, type: 'text' })
    description: string | null;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    costPrice: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    salePrice: number;

    @Column({ type: 'int', default: 0 })
    stockQuantity: number;

    @Column({ type: 'int', default: 0 })
    minimumStock: number;

    @Column({ type: 'varchar', length: 20, default: 'active' })
    status: ProductStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => SaleItem, (si) => si.product)
    saleItems: SaleItem[];
}
