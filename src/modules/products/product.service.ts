import { ProductRepository } from './product.repository';
import { NotFoundError } from '../../shared/errors';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './product.dto';

export class ProductService {
    private productRepository: ProductRepository;

    constructor(productRepository?: ProductRepository) {
        this.productRepository = productRepository ?? new ProductRepository();
    }

    async findAll(orgId: string, query: ProductQueryDto) {
        return this.productRepository.findAllPaginated(orgId, query);
    }

    async findById(id: string, orgId: string) {
        const product = await this.productRepository.findOne({ id, organizationId: orgId }, [
            'category',
            'supplier',
        ]);
        if (!product) throw new NotFoundError('Product not found');
        return product;
    }

    async create(dto: CreateProductDto, orgId: string) {
        const sku = await this.productRepository.generateSku(dto.name, orgId);
        const product = this.productRepository.create({
            ...dto,
            sku,
            organizationId: orgId,
        });
        return this.productRepository.save(product);
    }

    async update(id: string, dto: UpdateProductDto, orgId: string) {
        const product = await this.findById(id, orgId);
        Object.assign(product, dto);
        return this.productRepository.save(product);
    }

    async remove(id: string, orgId: string) {
        const product = await this.findById(id, orgId);
        await this.productRepository.remove(product);
    }

    async findBySku(sku: string, orgId: string) {
        return this.productRepository.findBySku(sku, orgId);
    }

    async updateStock(id: string, orgId: string, quantity: number) {
        const product = await this.findById(id, orgId);
        product.stockQuantity = quantity;
        return this.productRepository.save(product);
    }

    async decrementStock(id: string, orgId: string, quantity: number) {
        const product = await this.findById(id, orgId);
        product.stockQuantity -= quantity;
        return this.productRepository.save(product);
    }
}
