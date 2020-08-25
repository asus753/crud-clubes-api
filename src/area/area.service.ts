import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common'

import { Area } from './area.entity'
import { Area as AreaInterface } from './inteface/area'

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private areaRepository: Repository<Area>
  ){}

  async findByName(name: string): Promise<AreaInterface | undefined> {
    const area = await this.areaRepository.findOne({name})
    return area
  }
}