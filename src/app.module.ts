import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClubModule } from './club/club.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_PATH || 'data/database.sqlite',
      autoLoadEntities: true
    }),
    ClubModule
  ]
})
export class AppModule {}
