import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { BrokerModule } from '../broker/broker.module';

@Module({
  imports: [BrokerModule],
  controllers: [AdminController],
})
export class AdminModule {}
