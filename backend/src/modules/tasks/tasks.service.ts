import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PublicTask } from './types';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<PublicTask> {
    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        completed: createTaskDto.completed ?? false,
        userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return task;
  }

  async findAll(userId: string): Promise<PublicTask[]> {
    return this.prisma.task.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        description: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string, userId: string): Promise<PublicTask> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        completed: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return task as PublicTask;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<PublicTask> {
    const existingTask = await this.prisma.task.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingTask) {
      throw new NotFoundException('Task not found');
    }

    if (existingTask.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const task = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
      select: {
        id: true,
        title: true,
        description: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return task;
  }

  async remove(id: string, userId: string): Promise<string> {
    const existingTask = await this.prisma.task.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingTask) {
      throw new NotFoundException('Task not found');
    }

    if (existingTask.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.task.delete({ where: { id } });
    return 'Task deleted successfully';
  }
}
