import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ConflictError, UnauthorizedError } from '../../shared/errors';
import { OrganizationRepository } from '../organizations/organization.repository';
import { UserRepository } from '../users/user.repository';
import AppDataSource from '../../database/data-source';
import { AuthResponse, LoginDto, RegisterDto } from './auth.dto';
import { config } from '../../config';
import { ROLES } from '../../shared/constants';
import { JwtPayload } from '../../shared/types';

export class AuthService {
    private userRepository: UserRepository;
    private organizationRepository: OrganizationRepository;

    constructor(userRepository?: UserRepository, organizationRepository?: OrganizationRepository) {
        this.userRepository = userRepository || new UserRepository();
        this.organizationRepository = organizationRepository || new OrganizationRepository();
    }

    async register(dto: RegisterDto) {
        const existingUser = await this.userRepository.findByEmail(dto.email);

        if (existingUser) {
            throw new ConflictError('Email already in user');
        }

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const org = this.organizationRepository.create({ name: dto.organizationName });
            const savedOrg = await queryRunner.manager.save(org);

            const hashedPassword = await bcrypt.hash(dto.password, config.bcrypt.saltRounds);

            const user = this.userRepository.create({
                email: dto.email,
                name: dto.name,
                password: hashedPassword,
                role: ROLES.OWNER,
                organizationId: savedOrg.id,
            });
            const savedUser = await queryRunner.manager.save(user);

            await queryRunner.commitTransaction();
            return this.generateAuthResponse(savedUser);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async login(dto: LoginDto) {
        const user = await this.userRepository.findByEmailWithPassword(dto.email);

        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedError('Account is deactivated');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid credentials');
        }

        return this.generateAuthResponse(user);
    }

    async refreshToken(token: string) {
        if (!token) throw new UnauthorizedError('Refresh token is required');

        let decoded: JwtPayload;

        try {
            decoded = jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
        } catch (error) {
            throw new UnauthorizedError('Invalid refresh token');
        }

        const user = await this.userRepository.findById(decoded.userId);

        if (!user || !user.isActive) {
            throw new UnauthorizedError('User not found or inactive');
        }

        return this.generateAuthResponse(user);
    }

    private generateAuthResponse(user: {
        id: string;
        email: string;
        name: string;
        role: string;
        organizationId: string;
    }): AuthResponse {
        const payload: JwtPayload = {
            userId: user.id,
            organizationId: user.organizationId,
            role: user.role as JwtPayload['role'],
        };

        const accessToken = jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn,
        });

        const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
            expiresIn: config.jwt.refreshExpiresIn,
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                organizationId: user.organizationId,
            },
            accessToken,
            refreshToken,
        };
    }
}
