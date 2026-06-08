import { CategoryRepository } from './category.repository';
import { NotFoundError } from '../../shared/errors';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

export class CategoryService {
    private categoryRepository: CategoryRepository;

    constructor(categoryRepository?: CategoryRepository) {
        this.categoryRepository = categoryRepository ?? new CategoryRepository();
    }

    async findAll(orgId: string) {
        return this.categoryRepository.findByOrganization(orgId);
    }

    async findById(id: string, orgId: string) {
        const category = await this.categoryRepository.findOne({ id, organizationId: orgId });
        if (!category) throw new NotFoundError('Category not found');
        return category;
    }

    async create(dto: CreateCategoryDto, orgId: string) {
        const category = this.categoryRepository.create({ ...dto, organizationId: orgId });
        return this.categoryRepository.save(category);
    }

    async update(id: string, dto: UpdateCategoryDto, orgId: string) {
        const category = await this.findById(id, orgId);
        Object.assign(category, dto);
        return this.categoryRepository.save(category);
    }

    async remove(id: string, orgId: string) {
        const category = await this.findById(id, orgId);
        await this.categoryRepository.remove(category);
    }
}
