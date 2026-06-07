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
import { Sale } from '../sales/sale.entity';
import { Role } from '../../shared/constants';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    organizationId: string;

    @ManyToOne(() => Organization, (org) => org.users)
    @JoinColumn({ name: 'organizationId' })
    organization: Organization;

    @Column({ unique: true, length: 255 })
    email: string;

    @Column({ length: 255 })
    name: string;

    @Column({ select: false })
    password: string;

    @Column({ type: 'varchar', length: 50, default: 'employee' })
    role: Role;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true, type: 'varchar' })
    refreshToken: string | null;

    @Column({ nullable: true, type: 'varchar' })
    passwordResetToken: string | null;

    @Column({ nullable: true, type: 'timestamp' })
    passwordResetExpires: Date | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Sale, (sale) => sale.createdBy)
    sales: Sale[];
}
