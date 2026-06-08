import { NotFoundError } from '@/shared/errors';
import { UserRepository } from './user.repository';

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
}
