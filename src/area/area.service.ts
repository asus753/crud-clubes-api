import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'

import { Area } from './area.entity'

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area)
    private areaRepository: Repository<Area>,
  ) {}

  async findByName(name: string): Promise<Area | undefined> {
    return this.areaRepository.findOne({ name })
  }
}
