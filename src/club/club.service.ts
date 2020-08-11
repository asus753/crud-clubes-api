import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Club as ClubInterface } from './interface/club.interface'
import { Club } from './club.entity'

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club)
    private clubRepository: Repository<Club>
  ){}

  findAll(): Promise<number> {
    return this.clubRepository.count()
  }
}