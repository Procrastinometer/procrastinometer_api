import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { TimeLogModule } from '../time-log/time-log.module';

@Module({
  imports: [AuthModule, UserModule, TimeLogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
