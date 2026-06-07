import { BaseRepository } from '../../database/base.repository';
import { Product } from './product.entity';
import AppDataSource from '../../database/data-source';

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
}
