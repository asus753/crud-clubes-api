import { Injectable, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Club as ClubInterface } from './interface/club.interface'
import { DataToUpdateClub } from './interface/update-club.interface'
import { Club } from './club.entity'
import { AreaService } from 'src/area/area.service';
import { Area } from 'src/area/area.entity';
import { CreateClubDto } from './dto/create-club.dto';
import { ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ClubService { 
  constructor(
    @InjectRepository(Club) private clubRepository: Repository<Club>,
    @Inject(AreaService) private areaService: AreaService
  ){}

  findUnique(id: number | string): Promise<ClubInterface> {
    return this.clubRepository.findOne(id)
  }

  findAll(): Promise<ClubInterface[]> {
    return this.clubRepository.find()
  }

  async create(newClubInfo: CreateClubDto): Promise<void> {
    const area = await this.getArea(newClubInfo.area)

    if(area){
      const clubInstance = this.clubRepository.create({...newClubInfo, area})
      await this.clubRepository.insert(clubInstance)

    }else{
      throw this.createAreaInvalidErrorMessage(newClubInfo.area)
    }
  }

  async update(id: number, updateClubInfo: DataToUpdateClub): Promise<ClubInterface>{
    const club = await this.findUnique(id)

    if(club){
      Object.keys(updateClubInfo).forEach(property => {
        if(updateClubInfo[property]) club[property] = updateClubInfo[property]
      })

      this.clubRepository.save(club)
      return club
    }else{
      throw new NotFoundException()
    }
  }

  private createAreaInvalidErrorMessage(value: string): ValidationError{
    const areaError = new ValidationError()
    areaError.property = 'area'
    areaError.value = value
    areaError.constraints = {'valid-area': 'the area does not exist'}

    return areaError
  }

  private async getArea(name: string): Promise<Area | null>{
    const area = await this.areaService.findByName(name)
    return area
  }
}