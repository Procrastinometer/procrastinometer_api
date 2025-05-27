import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { AbstractUserService } from './abstractions/user-service.abstraction';
import { AbstractionUserRepository } from './abstractions/user-repository.abstraction';
import { PrismaModule } from '../../database/prisma.module';
import { UserController } from './user.controller';

@Module({
  providers: [
    { provide: AbstractionUserRepository, useClass: UserRepository },
    { provide: AbstractUserService, useClass: UserService },
  ],
  exports: [AbstractUserService],
  imports: [PrismaModule],
  controllers: [UserController],
})
export class UserModule {}
