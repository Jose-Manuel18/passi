import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestWithUser } from '../../common/types/jwt-payload';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { PublicTask } from './types';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: RequestWithUser,
  ): Promise<PublicTask> {
    return this.tasksService.create(createTaskDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for the current user' })
  @ApiResponse({ status: 200, description: 'List of tasks' })
  findAll(@Request() req: RequestWithUser): Promise<PublicTask[]> {
    return this.tasksService.findAll(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task' })
  @ApiResponse({ status: 200, description: 'Task details' })
  findOne(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<PublicTask> {
    return this.tasksService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: RequestWithUser,
  ): Promise<PublicTask> {
    return this.tasksService.update(id, updateTaskDto, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  remove(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<string> {
    return this.tasksService.remove(id, req.user.sub);
  }
}
