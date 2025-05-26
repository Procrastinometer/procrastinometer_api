import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { AbstractSessionRepository } from './abstractions/session-repository.abstraction';
import { SessionRepository } from './session.repository';
import { AbstractSessionService } from './abstractions/session-service.abstraction';
import { SessionService } from './session.service';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: AbstractSessionRepository,
      useClass: SessionRepository,
    },
    {
      provide: AbstractSessionService,
      useClass: SessionService,
    },
  ],
  exports: [AbstractSessionService],
})
export class SessionModule {}