import AppDataSource from '../../database/data-source';
import { BaseRepository } from '../../database/base.repository';
import { SaleItem } from './saleItem.entity';

export class SaleItemRepository extends BaseRepository<SaleItem> {
    constructor() {
        super(AppDataSource.getRepository(SaleItem));
    }
}
