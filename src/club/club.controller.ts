import { Controller, Get, Param, NotFoundException } from '@nestjs/common';

import { ClubService } from './club.service'
import { Club } from './interface/club.interface';


@Controller('club')
export class ClubController {
  constructor(private clubService: ClubService){}

  @Get()
  findAll(): Promise<Club[]> {
    return this.clubService.findAll()
  }

  @Get(':id')
  async findUnique(
    @Param('id') id: string
  ): Promise<Club>{
    const club = await this.clubService.findUnique(id)

    if(club) return club
    else throw new NotFoundException()
  }
}