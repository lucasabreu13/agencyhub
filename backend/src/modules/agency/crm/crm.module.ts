import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrmController } from './crm.controller';
import { CrmService } from './crm.service';
import { CrmContact } from '../../../database/entities/crm-contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CrmContact])],
  controllers: [CrmController],
  providers: [CrmService],
  exports: [CrmService],
})
export class AgencyCrmModule {}
