import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Club } from './club.entity'
import { AreaService } from 'src/area/area.service';
import { Area } from 'src/area/area.entity';
import { CreateClubDto } from './dto/create-club.dto';
import { ValidationError } from 'class-validator';
import { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubService { 
  constructor(
    @InjectRepository(Club) private clubRepository: Repository<Club>,
    @Inject(AreaService) private areaService: AreaService
  ){}

  findUnique(id: number | string): Promise<Club | undefined> {
    return this.clubRepository.findOne(id, {})
  }

  findAll(): Promise<Club[]> {
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

  async update(clubInstance: Club, updateClubInfo: UpdateClubDto): Promise<Club>{

    if(updateClubInfo.area){
      try {
        const clubUpdated = await this.updateWithArea(clubInstance, updateClubInfo)
        return clubUpdated
      } catch (error) {
        throw error
      }
    }else{
      const clubUpdated = await this.updateWithoutArea(clubInstance, updateClubInfo)
      return clubUpdated
    }
  }

  private async updateWithoutArea(clubInstance: Club, updateClubInfo: UpdateClubDto): Promise<Club>{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {area, ...updateClubInfoWithoutArea} = updateClubInfo 

    const clubUpdated = await this.clubRepository.save({...clubInstance, ...updateClubInfoWithoutArea})
    return clubUpdated
  }

  private async updateWithArea(clubInstance: Club, updateClubInfo: UpdateClubDto): Promise<Club> {
    if(!updateClubInfo.area) throw new Error()
    
    const area = await this.getArea(updateClubInfo.area)

    if(area) {
      const clubUpdated = await this.clubRepository.save({...clubInstance, ...updateClubInfo, area})
      return clubUpdated
    }
    else{
      throw this.createAreaInvalidErrorMessage(updateClubInfo.area)
    }
  }

  private createAreaInvalidErrorMessage(value: string): ValidationError{
    const areaError = new ValidationError()
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