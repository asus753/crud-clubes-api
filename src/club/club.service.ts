import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Club as ClubInterface } from './interface/club.interface'
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
}