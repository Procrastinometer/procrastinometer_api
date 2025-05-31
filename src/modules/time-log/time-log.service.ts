import { Injectable } from '@nestjs/common';
import { AbstractTimeLogRepository } from './abstractions/time-log-repository.abstraction';
import { TimeLogDto } from './dto/time-log.dto';
import { AbstractUserService } from '../user/abstractions/user-service.abstraction';

@Injectable()
export class TimeLogService {
  constructor (
    private readonly timeLogRepository: AbstractTimeLogRepository,
    private readonly userService: AbstractUserService,
  ) {}

  async saveLogs (apiKey: string, logs: TimeLogDto[]): Promise<void> {
    const user = await this.userService.findByApiKey(apiKey);

    const aggregatedLogs = this.aggregateLogs(logs);
    await this.timeLogRepository.saveLogs(user.id, aggregatedLogs);
  }

  private aggregateLogs (logs: TimeLogDto[]): TimeLogDto[] {
    if (logs.length === 0) return [];

    const sorted = [...logs].sort((a, b) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

    const result: TimeLogDto[] = [sorted[0]];

    for (const current of sorted.slice(1)) {
      const prev = result[result.length - 1];

      if (this.isSameContext(prev, current)) {
        prev.endTime = current.endTime;
        prev.duration += current.duration;
      } else {
        result.push(current);
      }
    }

    return result;
  }

  private isSameContext (firstLog: TimeLogDto, secondLog: TimeLogDto): boolean {
    return (
      firstLog.fileName === secondLog.fileName &&
      firstLog.projectName === secondLog.projectName &&
      firstLog.codeEditor === secondLog.codeEditor &&
      firstLog.programmingLanguage === secondLog.programmingLanguage &&
      firstLog.osName === secondLog.osName &&
      new Date(firstLog.endTime).getTime() === new Date(secondLog.startTime).getTime()
    );
  }
}