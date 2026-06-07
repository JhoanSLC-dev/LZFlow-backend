import AppDataSource from '../../database/data-source';
import { BaseRepository } from '../../database/base.repository';
import { Sale } from './sale.entity';

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
}
