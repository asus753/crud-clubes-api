import { PipeTransform, Injectable, BadRequestException, Inject } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { AreaService } from '../area/area.service'
import { CreateClubDto } from './dto/create-club.dto'
import { UpdateClubDto } from './dto/update-club.dto'
import { DataToUpdateClub } from './interface/update-club.interface'

import { Area } from '../area/inteface/area'

@Injectable()
export class NewClubValidationPipe implements PipeTransform<any> {

  async transform(value: unknown): Promise<CreateClubDto>{

    const newClub = plainToClass(CreateClubDto, value)
    const errors = await validate(newClub, {
      whitelist: true,
      validationError: {
        target: false,
        value: true
      }
    })

    if(errors.length > 0) throw new BadRequestException(errors)
    else return newClub
  }
  
}

@Injectable()
export class UpdateClubPipe implements PipeTransform{

  constructor(
    @Inject(AreaService) private areaService: AreaService
  ){}

  async transform(value: unknown): Promise<DataToUpdateClub> {

    const clubNewInfo = plainToClass(UpdateClubDto, value)
    const errors = await validate(clubNewInfo)

    let area: Area | undefined

    if(clubNewInfo.area){
      area = await this.areaService.findByName(clubNewInfo.area + '')

      if(!area){
        const areaError = new ValidationError()
        areaError.value = clubNewInfo.area,
        areaError.property = 'area',
        areaError.constraints = {
          IsValid: 'this area is non-existent'
        }

        errors.push(areaError)

      }
    }

    if(errors.length > 0)throw new BadRequestException(errors)

    else return {...clubNewInfo, area}

  }
  
}