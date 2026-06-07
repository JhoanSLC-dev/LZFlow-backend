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
import { User } from '../users/user.entity';
import { SaleItem } from './saleItem.entity';
import { SaleStatus } from '../../shared/constants';

@Entity('sales')
export class Sale {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    organizationId: string;

    @ManyToOne(() => Organization, (org) => org.sales)
    @JoinColumn({ name: 'organizationId' })
    organization: Organization;

    @Column({ length: 255 })
    customerName: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    subtotal: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    tax: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    total: number;

    @Column({ type: 'varchar', length: 20, default: 'completed' })
    status: SaleStatus;

    @Column()
    createdById: string;

    @ManyToOne(() => User, (user) => user.sales)
    @JoinColumn({ name: 'createdById' })
    createdBy: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => SaleItem, (si) => si.sale, { cascade: true })
    items: SaleItem[];
}
