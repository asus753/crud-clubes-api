import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { AreaService } from './area.service'
import { Area } from './area.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Area])
  ],
  providers: [AreaService],
  exports: [AreaService]
})
export class AreaModule {}