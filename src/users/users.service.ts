import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  find() {
    return this.usersRepository.find();
  }

  findById(_id: string) {
    return this.usersRepository.findOne({ _id });
  }

  update(_id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.findOneAndUpdate(updateUserDto, { _id }, { new: true });
  }

  delete(_id: string) {
    return this.usersRepository.findOneAndDelete({ _id });
  }
}
