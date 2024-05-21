import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiAcceptedResponse, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiAcceptedResponse({ description: 'Returned all users' })
  getUsers() {
    return this.usersService.find();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiAcceptedResponse({ description: 'Returned a user with the given id' })
  getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ description: 'Created user' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiAcceptedResponse({ description: 'Updated user' })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiAcceptedResponse({ description: 'Deleted user' })
  deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
