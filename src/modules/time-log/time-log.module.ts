import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { TimeLogService } from './time-log.service';
import { AbstractTimeLogRepository } from './abstractions/time-log-repository.abstraction';
import { TimeLogRepository } from './time-log.repository';
import { UserModule } from '../user/user.module';
import { TimeLogController } from './time-log.controller';

@Module({
  imports: [PrismaModule, UserModule],
  providers: [
    TimeLogService,
    {
      provide: AbstractTimeLogRepository,
      useClass: TimeLogRepository,
    },
  ],
  controllers: [TimeLogController],
})
export class TimeLogModule {}