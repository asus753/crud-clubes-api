import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Club } from './club.entity'
import { AreaService } from '../area/area.service';
import { Area } from '../area/area.entity';
import { CreateClubDto } from './dto/create-club.dto';
import { ValidationError } from 'class-validator';
import { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubService { 
  constructor(
    @InjectRepository(Club) private clubRepository: Repository<Club>,
    @Inject(AreaService) private areaService: AreaService
  ){}

  findUnique(id: number): Promise<Club | undefined> {
    return this.clubRepository.findOne(id)
  }

  findAll(): Promise<Club[]> {
    return this.clubRepository.find()
  }

  async create(newClubDto: CreateClubDto): Promise<void> {
    const area = await this.getArea(newClubDto.area)

    if(area){
      const clubInstance = this.clubRepository.create({...newClubDto, area})
      await this.clubRepository.insert(clubInstance)

    }else{
      throw this.createAreaInvalidErrorMessage(newClubDto.area)
    }
  }

  async update(clubInstance: Club, updateClubDto: UpdateClubDto): Promise<Club>{

    if(updateClubDto.area){
      try {
        const clubUpdated = await this.updateWithArea(clubInstance, updateClubDto)
        return clubUpdated
      } catch (error) {
        throw error
      }
    }else{
      const clubUpdated = await this.updateWithoutArea(clubInstance, updateClubDto)
      return clubUpdated
    }
  }

  private async updateWithArea(clubInstance: Club, updateClubDto: UpdateClubDto): Promise<Club> {
    if(!updateClubDto.area) throw new Error()
    
    const area = await this.getArea(updateClubDto.area)

    if(area) {
      await this.clubRepository.update(clubInstance.id, {...updateClubDto, area})
      const clubUpdated = await this.findUnique(clubInstance.id)
      return clubUpdated!
    }
    else{
      throw this.createAreaInvalidErrorMessage(updateClubDto.area)
    }
  }

  private async updateWithoutArea(clubInstance: Club, updateClubDto: UpdateClubDto): Promise<Club>{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {area, ...updateClubInfoWithoutArea} = updateClubDto 

    await this.clubRepository.update(clubInstance.id, updateClubInfoWithoutArea)
    const clubUpdated = await this.findUnique(clubInstance.id)
    return clubUpdated!
  }

  private createAreaInvalidErrorMessage(value: string): ValidationError{
    const areaError = new ValidationError()
    areaError.children = []
    areaError.property = 'area'
    areaError.value = value
    areaError.constraints = {'valid-area': 'the area does not exist'}

    return areaError
  }

  private async getArea(name: string): Promise<Area | undefined>{
    const area = await this.areaService.findByName(name)
    return area
  }
}