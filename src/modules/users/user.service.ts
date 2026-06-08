import bcrypt from 'bcrypt';
import { config } from '../../config';
import { ConflictError, NotFoundError } from '../../shared/errors';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { SaleRepository } from '../sales/sale.repository';

export class UserService {
    private userRepository: UserRepository;
    private salesRepository: SaleRepository;

    constructor(userRepository?: UserRepository, salesRepository?: SaleRepository) {
        this.userRepository = userRepository ?? new UserRepository();
        this.salesRepository = salesRepository ?? new SaleRepository();
    }

    async findByOrganization(organizationId: string) {
        return this.userRepository.findByOrganization(organizationId);
    }

    async findById(id: string, organizationId: string) {
        const user = await this.userRepository.findOne({ id, organizationId });
        if (!user) throw new NotFoundError('User not found');
        return user;
    }

    async create(dto: CreateUserDto, organizationId: string) {
        const existing = await this.userRepository.findByEmail(dto.email);
        if (existing) throw new ConflictError('Email already in use');

        const hashedPassword = await bcrypt.hash(dto.password, config.bcrypt.saltRounds);
        const user = this.userRepository.create({
            ...dto,
            password: hashedPassword,
            organizationId,
        });
        return this.userRepository.save(user);
    }

    async update(id: string, dto: UpdateUserDto, organizationId: string) {
        const user = await this.findById(id, organizationId);

        if (dto.email && dto.email !== user.email) {
            const existing = await this.userRepository.findByEmail(dto.email);
            if (existing) throw new ConflictError('Email already in use');
        }

        Object.assign(user, dto);
        return this.userRepository.save(user);
    }

    async remove(id: string, organizationId: string) {
        const user = await this.findById(id, organizationId);
        const sales = await this.salesRepository.exists({ createdById: user.id });
        if (sales) throw new ConflictError('User has sales');
        await this.userRepository.remove(user);
    }
}
