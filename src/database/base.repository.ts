import {
    DeepPartial,
    FindManyOptions,
    FindOptionsOrder,
    FindOptionsWhere,
    ObjectLiteral,
    Repository,
} from 'typeorm';

export class BaseRepository<T extends ObjectLiteral> {
    constructor(protected readonly repo: Repository<T>) {}

    async findAll(where?: FindOptionsWhere<T>, relations?: string[], order?: FindOptionsOrder<T>) {
        return this.repo.find({ where, relations, order } as FindManyOptions<T>);
    }

    async findById(id: string, _where?: FindOptionsWhere<T>, relations?: string[]) {
        const where = { id, ..._where } as unknown as FindOptionsWhere<T>;
        return this.repo.findOne({ where, relations });
    }

    async findOne(where: FindOptionsWhere<T>, relations?: string[]) {
        return this.repo.findOne({ where, relations });
    }

    async findAndCount(
        where: FindOptionsWhere<T>,
        options: {
            relations?: string[];
            order?: FindOptionsOrder<T>;
            skip?: number;
            take?: number;
        } = {},
    ) {
        return this.repo.findAndCount({ where, ...options });
    }

    async count(where?: FindOptionsWhere<T>) {
        return this.repo.count({ where });
    }

    create(data: DeepPartial<T>) {
        return this.repo.create(data);
    }

    async save(entity: T) {
        return this.repo.save(entity);
    }

    async remove(entity: T) {
        return this.repo.remove(entity);
    }

    async exists(where: FindOptionsWhere<T>) {
        const count = await this.count(where);
        return count > 0;
    }

    getRepository() {
        return this.repo;
    }
}
