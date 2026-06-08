import AppDataSource from '../../database/data-source';
import { BaseRepository } from '../../database/base.repository';
import { Sale } from './sale.entity';
import { Between, FindOptionsWhere, Like } from 'typeorm';
import { SaleQueryDto } from './sale.dto';
import { PaginatedResult } from '../../shared/types';

export class SaleRepository extends BaseRepository<Sale> {
    constructor() {
        super(AppDataSource.getRepository(Sale));
    }

    async getTotalSales(organizationId: string) {
        const [totalSalesResult] = await this.getRepository().query(
            `SELECT COUNT(*)::int AS count, COALESCE(SUM(total), 0) as revenue FROM sales WHERE "organizationId" = $1 AND status = 'completed'`,
            [organizationId],
        );

        return totalSalesResult;
    }

    async getSalesByStartOfDay(organizationId: string, startOfDay: Date) {
        const [todayResult] = await this.getRepository().query(
            `SELECT COALESCE(SUM(total), 0) as revenue FROM sales WHERE "organizationId" = $1 AND status = 'completed' AND "createdAt" >= $2`,
            [organizationId, startOfDay],
        );

        return todayResult;
    }

    async getSalesByStartOfMonth(organizationId: string, startOfMonth: Date) {
        const [monthResult] = await this.getRepository().query(
            `SELECT COALESCE(SUM(total), 0) as revenue FROM sales WHERE "organizationId" = $1 AND status = 'completed' AND "createdAt" >= $2`,
            [organizationId, startOfMonth],
        );

        return monthResult;
    }

    async getSalesByStartOfYear(organizationId: string, startOfYear: Date) {
        const [yearResult] = await this.getRepository().query(
            `SELECT COALESCE(SUM(total), 0) as revenue FROM sales WHERE "organizationId" = $1 AND status = 'completed' AND "createdAt" >= $2`,
            [organizationId, startOfYear],
        );

        return yearResult;
    }

    async getMonthlyRevenue(organizationId: string, year: number) {
        return await this.getRepository().query(
            `SELECT
                EXTRACT(MONTH FROM "createdAt")::int AS month,
                COUNT(*)::int AS sales_count,
                COALESCE(SUM(total), 0) AS revenue
            FROM sales
            WHERE "organizationId" = $1
                AND status = 'completed'
                AND EXTRACT(YEAR FROM "createdAt") = $2
            GROUP BY month
            ORDER BY month`,
            [organizationId, year],
        );
    }

    async getSalesTrend(organizationId: string, startDate: Date) {
        return this.getRepository().query(
            `SELECT
                DATE("createdAt") as date,
                COUNT(*)::int as sales_count,
                COALESCE(SUM(total), 0) as revenue
            FROM sales
            WHERE "organizationId" = $1
                AND status = 'completed'
                AND "createdAt" >= $2
            GROUP BY DATE("createdAt")
            ORDER BY date`,
            [organizationId, startDate],
        );
    }

    async findAllPaginated(orgId: string, query: SaleQueryDto): Promise<PaginatedResult<Sale>> {
        const where: FindOptionsWhere<Sale> = { organizationId: orgId };

        if (query.status) where.status = query.status as Sale['status'];
        if (query.customerName) {
            where.customerName = Like(`%${query.customerName}%`);
        }
        if (query.startDate && query.endDate) {
            where.createdAt = Between(new Date(query.startDate), new Date(query.endDate));
        }

        const [data, total] = await this.repo.findAndCount({
            where,
            relations: ['items', 'items.product', 'createdBy'],
            order: { [query.sortBy]: query.sortOrder },
            skip: (query.page - 1) * query.limit,
            take: query.limit,
        });

        const totalPages = Math.ceil(total / query.limit);

        return {
            data,
            meta: {
                total,
                page: query.page,
                limit: query.limit,
                totalPages,
                hasNext: query.page < totalPages,
                hasPrev: query.page > 1,
            },
        };
    }

    async findByIdWithRelations(id: string, orgId: string): Promise<Sale | null> {
        return this.repo.findOne({
            where: { id, organizationId: orgId } as FindOptionsWhere<Sale>,
            relations: ['items', 'items.product', 'items.product.category', 'createdBy'],
        });
    }
}
