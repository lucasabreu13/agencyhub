import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencySettingsController } from './settings.controller';
import { AgencySettingsService } from './settings.service';
import { Agency } from '../../../database/entities/agency.entity';
import { User } from '../../../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agency, User])],
  controllers: [AgencySettingsController],
  providers: [AgencySettingsService],
})
export class AgencySettingsModule {}
