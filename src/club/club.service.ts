import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Club as ClubInterface } from './interface/club.interface'
import { DataToUpdateClub } from './interface/update-club.interface'
import { Club } from './club.entity'

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club) private clubRepository: Repository<Club>
  ){}

  findUnique(id: number | string): Promise<ClubInterface> {
    return this.clubRepository.findOne(id)
  }

  findAll(): Promise<ClubInterface[]> {
    return this.clubRepository.find()
  }

  async create(newClubInfo: ClubInterface): Promise<void> {
    this.clubRepository.save(newClubInfo)
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
}