import { Controller, Get, Param, NotFoundException, Post, Body, Put, ParseIntPipe } from '@nestjs/common';

import { ClubService } from './club.service'
import { Club } from './interface/club.interface'
import { DataToUpdateClub } from './interface/update-club.interface'
import { NewClubValidationPipe, UpdateClubPipe } from './validation.pipe'


@Controller('club')
export class ClubController {
  constructor(private clubService: ClubService){}

  @Get()
  findAll(): Promise<Club[]> {
    return this.clubService.findAll()
  }

  @Get(':id')
  async findUnique(@Param('id') id: string): Promise<Club>{
    const club = await this.clubService.findUnique(id)

    if(club) return club
    else throw new NotFoundException()
  }

  @Post()
  async create(@Body(NewClubValidationPipe) newClubInfo: Club): Promise<void>{
    this.clubService.create(newClubInfo)
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(UpdateClubPipe) updateClubInfo: DataToUpdateClub
  ): Promise<unknown> {
    return this.clubService.update(id, updateClubInfo)
  }

}