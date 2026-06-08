import bcrypt from 'bcrypt';
import { config } from '../../config';
import { ConflictError, NotFoundError } from '../../shared/errors';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './user.dto';

export class UserService {
    private userRepository: UserRepository;

    constructor(userRepository?: UserRepository) {
        this.userRepository = userRepository ?? new UserRepository();
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
}
