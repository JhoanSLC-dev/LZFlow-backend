import { BaseRepository } from '../../database/base.repository';
import { Organization } from './organization.entity';
import AppDataSource from '../../database/data-source';

export class OrganizationRepository extends BaseRepository<Organization> {
    constructor() {
        super(AppDataSource.getRepository(Organization));
    }
}
