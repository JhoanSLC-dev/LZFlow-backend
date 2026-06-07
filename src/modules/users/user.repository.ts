import AppDataSource from '../../database/data-source';
import { User } from './user.entity';
import { BaseRepository } from '../../database/base.repository';

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super(AppDataSource.getRepository(User));
    }

    async findByEmail(email: string) {
        return this.repo.findOne({ where: { email } });
    }
}
