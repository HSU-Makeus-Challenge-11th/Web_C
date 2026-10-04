import type { User } from '../../user.entity';

export class UserResponseDto {
  id: number;
  name: string | null;

  constructor(user: Pick<User, 'id' | 'name'>) {
    this.id = user.id;
    this.name = user.name;
  }
}
