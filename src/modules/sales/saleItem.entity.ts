import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from '../products/product.entity';

@Entity('sale_items')
export class SaleItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    saleId: string;

    @ManyToOne(() => Sale, (sale) => sale.items)
    @JoinColumn({ name: 'saleId' })
    sale: Sale;

    @Column()
    productId: string;

    @ManyToOne(() => Product, (product) => product.saleItems)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    unitPrice: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    subtotal: number;
}
