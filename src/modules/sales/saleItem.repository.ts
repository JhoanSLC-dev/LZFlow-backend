import AppDataSource from '../../database/data-source';
import { BaseRepository } from '../../database/base.repository';
import { SaleItem } from './saleItem.entity';

export class SaleItemRepository extends BaseRepository<SaleItem> {
    constructor() {
        super(AppDataSource.getRepository(SaleItem));
    }

    async getTopProducts(organizationId: string, limit: number) {
        return this.getRepository().query(
            `SELECT
                p.id,
                p.name,
                p.sku,
                SUM(si.quantity)::int as total_quantity,
                SUM(si.subtotal) as total_revenue
            FROM sale_items si
            JOIN products p ON p.id = si."productId"
            JOIN sales s ON s.id = si."saleId"
            WHERE p."organizationId" = $1 AND s.status = 'completed'
            GROUP BY p.id, p.name, p.sku
            ORDER BY total_quantity DESC
            LIMIT $2`,
            [organizationId, limit],
        );
    }
}
