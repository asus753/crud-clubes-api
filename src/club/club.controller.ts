import { Controller, Get, Param, NotFoundException, Post, Body, Put, ParseIntPipe, BadRequestException, InternalServerErrorException } from '@nestjs/common';

import { ClubService } from './club.service'
import { NewClubValidationPipe, UpdateClubPipe } from './validation.pipe'
import { CreateClubDto } from './dto/create-club.dto';
import { ValidationError } from 'class-validator';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './club.entity';


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
  async create(@Body(NewClubValidationPipe) newClubInfo: CreateClubDto): Promise<void>{
    try {
      await this.clubService.create(newClubInfo)
    } catch (error) {
      
      if(error instanceof ValidationError) throw new BadRequestException([error])
      else throw new InternalServerErrorException(error)
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(UpdateClubPipe) updateClubInfo: UpdateClubDto
  ): Promise<Club> {
    
    const clubInstance = await this.clubService.findUnique(id)

    if(clubInstance){

      try {
        const clubUpdated = await this.clubService.update(clubInstance, updateClubInfo)
        return clubUpdated
      } catch (error) {
        if(error instanceof ValidationError) throw new BadRequestException([error])
        else throw new InternalServerErrorException()
      }

    }else throw new NotFoundException()
  }

}