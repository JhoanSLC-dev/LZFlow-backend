import { SupplierRepository } from './supplier.repository';
import { NotFoundError } from '../../shared/errors';
import { CreateSupplierDto, UpdateSupplierDto } from './supplier.dto';

export class SupplierService {
    private supplierRepository: SupplierRepository;

    constructor(supplierRepository?: SupplierRepository) {
        this.supplierRepository = supplierRepository ?? new SupplierRepository();
    }

    async findAll(orgId: string) {
        return this.supplierRepository.findByOrganization(orgId);
    }

    async findById(id: string, orgId: string) {
        const supplier = await this.supplierRepository.findOne({ id, organizationId: orgId });
        if (!supplier) throw new NotFoundError('Supplier not found');
        return supplier;
    }

    async create(dto: CreateSupplierDto, orgId: string) {
        const supplier = this.supplierRepository.create({ ...dto, organizationId: orgId });
        return this.supplierRepository.save(supplier);
    }

    async update(id: string, dto: UpdateSupplierDto, orgId: string) {
        const supplier = await this.findById(id, orgId);
        Object.assign(supplier, dto);
        return this.supplierRepository.save(supplier);
    }

    async remove(id: string, orgId: string) {
        const supplier = await this.findById(id, orgId);
        await this.supplierRepository.remove(supplier);
    }
}
