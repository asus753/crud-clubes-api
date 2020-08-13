import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Club as ClubInterface } from './interface/club.interface'
import { Club } from './club.entity'

import { createClubDto } from './dto/create-club.dto'

import { AreaService } from '../area/area.service'

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

  async create(clubInfo: createClubDto): Promise<void> {
    const area = await this.areaService.findByName(clubInfo.area)

    if(area) this.clubRepository.save({...clubInfo, area})
    else throw new BadRequestException({
      statusCode: 400,
      value: clubInfo.area,
      property: 'area',
      message: 'area value is invalid or non-existent'
    })
  }
}