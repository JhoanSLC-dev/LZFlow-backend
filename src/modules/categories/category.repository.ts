import AppDataSource from '../../database/data-source';
import { Category } from './category.entity';
import { BaseRepository } from '../../database/base.repository';

export class CategoryRepository extends BaseRepository<Category> {
    constructor() {
        super(AppDataSource.getRepository(Category));
    }

    async findByOrganization(orgId: string): Promise<Category[]> {
        return this.findAll({ organizationId: orgId }, [], { name: 'ASC' });
    }
}
