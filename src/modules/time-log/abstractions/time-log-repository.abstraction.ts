import { TimeLogDto } from '../dto/time-log.dto';

export abstract class AbstractTimeLogRepository {
  abstract saveLogs(userId: string, logs: TimeLogDto[]): Promise<void>;
}