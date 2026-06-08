import { BaseRepository } from '../../database/base.repository';
import { Product } from './product.entity';
import AppDataSource from '../../database/data-source';
import { FindOptionsWhere, Like } from 'typeorm';
import { generateSku } from '../../shared/utils';
import { ProductQueryDto } from './product.dto';
import { PaginatedResult } from '../../shared/types';

export class ProductRepository extends BaseRepository<Product> {
    constructor() {
        super(AppDataSource.getRepository(Product));
    }

    async getInventoryValue(organizationId: string) {
        const [inventoryValue] = await this.getRepository().query(
            `SELECT COALESCE(SUM("costPrice" * "stockQuantity"), 0) as value FROM products WHERE "organizationId" = $1 AND status = 'active'`,
            [organizationId],
        );

        return inventoryValue;
    }

    async getLowStockProducts(organizationId: string) {
        const [lowStockProducts] = await this.getRepository().query(
            `SELECT COUNT(*)::int as count FROM products WHERE "organizationId" = $1 AND status = 'active' AND "stockQuantity" <= "minimumStock"`,
            [organizationId],
        );

        return lowStockProducts;
    }

    async getInventoryValuation(organizationId: string) {
        const [result] = await this.getRepository().query(
            `SELECT
                COALESCE(SUM("costPrice" * "stockQuantity"), 0) as cost_value,
                COALESCE(SUM("salePrice" * "stockQuantity"), 0) as sale_value,
                COUNT(*)::int as total_products,
                COALESCE(SUM("stockQuantity"), 0)::int as total_stock
            FROM products
            WHERE "organizationId" = $1 AND status = 'active'`,
            [organizationId],
        );
        return result;
    }

    async findAllPaginated(
        orgId: string,
        query: ProductQueryDto,
    ): Promise<PaginatedResult<Product>> {
        const where: FindOptionsWhere<Product> = { organizationId: orgId };

        if (query.search) {
            where.name = Like(`%${query.search}%`);
        }
        if (query.categoryId) where.categoryId = query.categoryId;
        if (query.supplierId) where.supplierId = query.supplierId;
        if (query.status) where.status = query.status as Product['status'];

        const [data, total] = await this.repo.findAndCount({
            where,
            relations: ['category', 'supplier'],
            order: { [query.sortBy || 'createdAt']: query.sortOrder || 'DESC' },
            skip: (query.page - 1) * query.limit,
            take: query.limit,
        });

        let filtered = data;
        if (query.lowStock) {
            filtered = data.filter((p) => p.stockQuantity <= p.minimumStock);
        }
        if (query.minPrice) {
            filtered = filtered.filter((p) => Number(p.salePrice) >= (query.minPrice || 0));
        }
        if (query.maxPrice) {
            filtered = filtered.filter((p) => Number(p.salePrice) <= (query.maxPrice || Infinity));
        }

        const totalPages = Math.ceil(total / query.limit);

        return {
            data: filtered,
            meta: {
                total: query.lowStock ? filtered.length : total,
                page: query.page,
                limit: query.limit,
                totalPages,
                hasNext: query.page < totalPages,
                hasPrev: query.page > 1,
            },
        };
    }

    async findBySku(sku: string, orgId: string): Promise<Product | null> {
        return this.repo.findOne({ where: { sku, organizationId: orgId } });
    }

    async generateSku(name: string, orgId: string): Promise<string> {
        const count = await this.repo.count({ where: { organizationId: orgId } });
        return generateSku(name, count + 1);
    }

    async updateStock(id: string, orgId: string, quantity: number): Promise<Product | null> {
        const product = await this.findOne({
            id,
            organizationId: orgId,
        } as FindOptionsWhere<Product>);
        if (!product) return null;
        product.stockQuantity = quantity;
        return this.repo.save(product);
    }

    async decrementStock(id: string, orgId: string, quantity: number): Promise<Product | null> {
        const product = await this.findOne({
            id,
            organizationId: orgId,
        } as FindOptionsWhere<Product>);
        if (!product) return null;
        product.stockQuantity -= quantity;
        return this.repo.save(product);
    }
}
