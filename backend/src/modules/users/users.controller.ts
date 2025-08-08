import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from './types';
import { UsersService } from './users.service';

@Controller('')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('findAll')
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('findOne/:id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Put('update/:id')
  update(
    @Param('id') id: string,
    @Body() user: Partial<{ name: string; email: string }>,
  ): Promise<string> {
    return this.usersService.update(id, user);
  }
}
