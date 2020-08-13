import { PipeTransform, Injectable, BadRequestException, Inject } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { AreaService } from '../area/area.service'
import { CreateClubDto } from './dto/create-club.dto'
import { Club } from './interface/club.interface'

@Injectable()
export class ClubValidationPipe implements PipeTransform<any> {

  constructor(
    @Inject(AreaService) private areaService: AreaService
  ){}

  async transform(value: unknown): Promise<Club>{

    const newClub = plainToClass(CreateClubDto, value)
    const errors = await validate(newClub, {
      whitelist: true,
      validationError: {
        target: false,
        value: true
      }
    })

    const area = await this.areaService.findByName(newClub.area + '')

    if(!area){
      const areaError = new ValidationError()
      areaError.value = newClub.area,
      areaError.property = 'area',
      areaError.constraints = {
        IsValid: 'this area is non-existent'
      }

      errors.push(areaError)
    }

    if(errors.length > 0) throw new BadRequestException(errors)

    else return {...newClub, area}
  }
  
}