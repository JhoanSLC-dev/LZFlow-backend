import { ProductRepository } from './../products/product.repository';
import { SaleRepository } from '../sales/sale.repository';
import { SaleItemRepository } from '../sales/saleItem.repository';

export class ReportService {
    private saleRepository: SaleRepository;
    private saleItemRepository: SaleItemRepository;
    private productRepository: ProductRepository;

    constructor(
        saleRepository?: SaleRepository,
        saleItemRepository?: SaleItemRepository,
        productRepository?: ProductRepository,
    ) {
        this.saleRepository = saleRepository || new SaleRepository();
        this.saleItemRepository = saleItemRepository || new SaleItemRepository();
        this.productRepository = productRepository || new ProductRepository();
    }

    async getDashboard(organizationId: string) {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        const totalSalesResult = await this.saleRepository.getTotalSales(organizationId);
        const todayResult = await this.saleRepository.getSalesByStartOfDay(
            organizationId,
            startOfDay,
        );
        const monthResult = await this.saleRepository.getSalesByStartOfMonth(
            organizationId,
            startOfMonth,
        );
        const yearResult = await this.saleRepository.getSalesByStartOfYear(
            organizationId,
            startOfYear,
        );
        const inventoryValue = await this.productRepository.getInventoryValue(organizationId);
        const totalProducts = await this.productRepository.count({
            organizationId,
            status: 'active',
        });
        const lowStockProducts = await this.productRepository.getLowStockProducts(organizationId);

        return {
            totalSales: parseInt(totalSalesResult.count) || 0,
            totalRevenue: parseFloat(totalSalesResult.revenue) || 0,
            todayRevenue: parseFloat(todayResult.revenue) || 0,
            monthRevenue: parseFloat(monthResult.revenue) || 0,
            yearRevenue: parseFloat(yearResult.revenue) || 0,
            inventoryValue: parseFloat(inventoryValue.value) || 0,
            lowStockCount: parseInt(lowStockProducts[0]?.count) || 0,
            totalProducts: totalProducts,
        };
    }

    async getMonthlyRevenue(organizationId: string, year?: number) {
        const targetYear = year || new Date().getFullYear();
        return await this.saleRepository.getMonthlyRevenue(organizationId, targetYear);
    }

    async getTopProducts(organizationId: string, limit = 10) {
        return await this.saleItemRepository.getTopProducts(organizationId, limit);
    }
}
