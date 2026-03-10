import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyUsersController } from './users.controller';
import { AgencyUsersService } from './users.service';
import { User } from '../../../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AgencyUsersController],
  providers: [AgencyUsersService],
})
export class AgencyUsersModule {}
