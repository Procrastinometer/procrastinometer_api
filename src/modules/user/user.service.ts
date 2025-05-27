import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AbstractUserService } from './abstractions/user-service.abstraction';
import { User } from '@prisma/client';
import { AbstractionUserRepository } from './abstractions/user-repository.abstraction';
import { generateUUID } from '../../utils/cryptography';

@Injectable()
export class UserService implements AbstractUserService {
  constructor (private readonly userRepository: AbstractionUserRepository) {}

  async findById (id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  async findByEmail (email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException(`User with email ${email} not found`);

    return user;
  }

  async create (email: string, password: string, apiKey: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new ConflictException(`User with email ${email} already exists`);

    return this.userRepository.create(email, password, apiKey);
  }

  async refreshApiKey (userId: string): Promise<string> {
    const newApiKey = generateUUID();
    await this.userRepository.updateApiKey(userId, newApiKey);
    return newApiKey;
  }
}