import AppDataSource from '../../database/data-source';
import { SaleRepository } from './sale.repository';
import { ProductRepository } from '../products/product.repository';
import { Sale } from './sale.entity';
import { SaleItem } from './saleItem.entity';
import { Product } from '../products/product.entity';
import { NotFoundError, InsufficientStockError } from '../../shared/errors';
import { CreateSaleDto, SaleQueryDto } from './sale.dto';

export class SaleService {
    private saleRepository: SaleRepository;
    private productRepository: ProductRepository;

    constructor(saleRepository?: SaleRepository, productRepository?: ProductRepository) {
        this.saleRepository = saleRepository ?? new SaleRepository();
        this.productRepository = productRepository ?? new ProductRepository();
    }

    async findAll(orgId: string, query: SaleQueryDto) {
        return this.saleRepository.findAllPaginated(orgId, query);
    }

    async findById(id: string, orgId: string) {
        const sale = await this.saleRepository.findByIdWithRelations(id, orgId);
        if (!sale) throw new NotFoundError('Sale not found');
        return sale;
    }

    async create(dto: CreateSaleDto, orgId: string, userId: string): Promise<Sale> {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const saleItems: SaleItem[] = [];
            let subtotal = 0;

            for (const item of dto.items) {
                const product = await queryRunner.manager.findOne(Product, {
                    where: { id: item.productId, organizationId: orgId },
                });

                if (!product) {
                    throw new NotFoundError(`Product ${item.productId} not found`);
                }

                if (product.stockQuantity < item.quantity) {
                    throw new InsufficientStockError(
                        `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, requested: ${item.quantity}`,
                    );
                }

                product.stockQuantity -= item.quantity;
                await queryRunner.manager.save(product);

                const itemSubtotal = item.quantity * item.unitPrice;
                subtotal += itemSubtotal;

                const saleItem = queryRunner.manager.create(SaleItem, {
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    subtotal: itemSubtotal,
                });
                saleItems.push(saleItem);
            }

            const total = subtotal + dto.tax;

            const sale = queryRunner.manager.create(Sale, {
                organizationId: orgId,
                customerName: dto.customerName,
                subtotal,
                tax: dto.tax,
                total,
                createdById: userId,
                items: saleItems,
            });

            const savedSale = await queryRunner.manager.save(sale);

            await queryRunner.commitTransaction();

            return this.findById(savedSale.id, orgId);
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
