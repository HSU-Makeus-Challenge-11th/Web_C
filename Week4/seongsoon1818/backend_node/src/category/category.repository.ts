import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category) private readonly categories: Repository<Category>,
  ) {}

  exists(categoryId: number): Promise<boolean> {
    return this.categories.existsBy({ id: categoryId });
  }
}
