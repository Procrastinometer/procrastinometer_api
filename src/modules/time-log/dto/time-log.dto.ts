import { IsString, IsInt, IsDateString } from 'class-validator';

export class TimeLogDto {
  @IsDateString()
    startTime: string;

  @IsInt()
    duration: number;

  @IsDateString()
    endTime: string;

  @IsString()
    fileName: string;

  @IsString()
    codeEditor: string;

  @IsString()
    osName: string;

  @IsString()
    projectName: string;

  @IsString()
    programmingLanguage: string;
}