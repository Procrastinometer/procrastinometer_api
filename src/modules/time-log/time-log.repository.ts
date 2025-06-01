import { Injectable } from '@nestjs/common';
import { AbstractTimeLogRepository } from './abstractions/time-log-repository.abstraction';
import { PrismaService } from '../../database/prisma.service';
import { TimeLogDto } from './dto/time-log.dto';

@Injectable()
export class TimeLogRepository implements AbstractTimeLogRepository {
  constructor (private prisma: PrismaService) {}

  async saveLogs (userId: string, logs: TimeLogDto[]): Promise<void> {
    await this.prisma.timeLog.createMany({
      data: logs.map((log) => ({
        ...log,
        userId,
        startTime: new Date(log.startTime),
        endTime: new Date(log.endTime),
      })),
      skipDuplicates: true,
    });
  }

  async getDurationByDate (userId: string, start: Date, end: Date): Promise<number[]> {
    const logs = await this.prisma.timeLog.findMany({
      where: {
        userId,
        startTime: {
          gte: start,
          lte: end,
        },
      },
      select: { duration: true },
    });

    return logs.map((log) => log.duration);
  }
}