import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClubService } from './club.service'
import { ClubController } from './club.controller'
import { Club } from './club.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Club])
  ],
  providers: [ClubService],
  controllers: [ClubController]
})
export class ClubModule {}
