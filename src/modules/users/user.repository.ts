import AppDataSource from '../../database/data-source';
import { User } from './user.entity';
import { BaseRepository } from '../../database/base.repository';
import { FindOptionsWhere } from 'typeorm';

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super(AppDataSource.getRepository(User));
    }

    async findByEmail(email: string) {
        return this.repo.findOne({ where: { email } });
    }

    async findByEmailWithPassword(email: string) {
        return this.repo.findOne({
            where: { email },
            select: ['id', 'email', 'name', 'password', 'role', 'organizationId', 'isActive'],
            relations: ['organization'],
        });
    }
}
