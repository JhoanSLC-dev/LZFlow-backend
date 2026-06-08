import { UserRepository } from './user.repository';

export class UserService {
    private userRepository: UserRepository;

    constructor(userRepository?: UserRepository) {
        this.userRepository = userRepository ?? new UserRepository();
    }

    async findByOrganization(organizationId: string) {
        return this.userRepository.findByOrganization(organizationId);
    }
}
