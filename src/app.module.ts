import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ClubModule } from './club/club.module'
import { Area } from './area/area.entity'
import { Club } from './club/club.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.dist',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_PATH,
      entities: [Area, Club],
      logging: true,
    }),
    ClubModule,
  ],
})
export class AppModule {}
