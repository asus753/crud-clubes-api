import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClubService } from './club.service'
import { ClubController } from './club.controller'
import { Club } from './club.entity'

import { AreaModule } from '../area/area.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Club]),
    AreaModule
  ],
  providers: [ClubService],
  controllers: [ClubController]
})
export class ClubModule {}
