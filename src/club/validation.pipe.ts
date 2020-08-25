import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { CreateClubDto } from './dto/create-club.dto'
import { UpdateClubDto } from './dto/update-club.dto'

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
  async transform(value: unknown): Promise<UpdateClubDto> {

    const clubNewInfo = plainToClass(UpdateClubDto, value, {})
    const errors = await validate(clubNewInfo, {
      whitelist: true,
      validationError: {
        target: false,
        value: true
      }
    })

    if(errors.length > 0)throw new BadRequestException(errors)

    else return clubNewInfo
  } 
}