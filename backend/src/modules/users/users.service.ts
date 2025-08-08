import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from './types';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(
    id: string,
    user: Partial<{ name: string; email: string }>,
  ): Promise<string> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: user,
    });
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    return 'User updated successfully';
  }

  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
