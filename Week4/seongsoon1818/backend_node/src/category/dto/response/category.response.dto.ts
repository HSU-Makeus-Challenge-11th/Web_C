import type { Category } from '../../category.entity';

export class CategoryResponseDto {
  id: number;
  name: string;

  constructor(category: Pick<Category, 'id' | 'name'>) {
    this.id = category.id;
    this.name = category.name;
  }
}
