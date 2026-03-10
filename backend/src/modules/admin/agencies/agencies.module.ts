import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgenciesController } from './agencies.controller';
import { AgenciesService } from './agencies.service';
import { Agency } from '../../../database/entities/agency.entity';
import { User } from '../../../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agency, User])],
  controllers: [AgenciesController],
  providers: [AgenciesService],
  exports: [AgenciesService],
})
export class AdminAgenciesModule {}
