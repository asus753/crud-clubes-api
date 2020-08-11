import { Controller, Get } from '@nestjs/common';
import { ClubService } from './club.service'

@Controller('club')
export class ClubController {
  constructor(private clubService: ClubService){}

  @Get()
  findAll(): Promise<number> {
    return this.clubService.findAll()
  }
}