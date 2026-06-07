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
import { Product } from '../products/product.entity';

@Entity('suppliers')
export class Supplier {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    organizationId: string;

    @ManyToOne(() => Organization, (org) => org.suppliers)
    @JoinColumn({ name: 'organizationId' })
    organization: Organization;

    @Column({ length: 255 })
    companyName: string;

    @Column({ length: 255 })
    contactName: string;

    @Column({ length: 255 })
    email: string;

    @Column({ length: 50 })
    phone: string;

    @Column({ nullable: true, type: 'text' })
    address: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Product, (product) => product.supplier)
    products: Product[];
}
