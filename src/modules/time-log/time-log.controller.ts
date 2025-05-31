import { Body, Controller, Post } from '@nestjs/common';
import { TimeLogService } from './time-log.service';
import { TimeLogDto } from './dto/time-log.dto';
import { UUIDValidationPipe } from '../../pipes/uuid-validation.pipe';
import { ApiKey } from '../../decorators/get-api-key-from-header.decorator';

@Controller('time-log')
export class TimeLogController {
  constructor (private readonly timeLogService: TimeLogService) {}

  @Post('save-logs')
  async saveLogs (
    @ApiKey(UUIDValidationPipe) apiKey: string,
    @Body() logs: TimeLogDto[],
  ): Promise<{ message: string }> {
    await this.timeLogService.saveLogs(apiKey, logs);
    return { message: 'Logs were saved successfully' };
  }
}