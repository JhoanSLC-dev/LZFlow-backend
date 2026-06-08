import AppDataSource from '../../database/data-source';
import { Supplier } from './supplier.entity';
import { BaseRepository } from '../../database/base.repository';

export class SupplierRepository extends BaseRepository<Supplier> {
    constructor() {
        super(AppDataSource.getRepository(Supplier));
    }

    async findByOrganization(orgId: string): Promise<Supplier[]> {
        return this.findAll({ organizationId: orgId }, [], { companyName: 'ASC' });
    }
}
