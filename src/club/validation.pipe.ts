import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { CreateClubDto } from './dto/create-club.dto'
import { UpdateClubDto } from './dto/update-club.dto'

@Injectable()
export class NewClubValidationPipe implements PipeTransform<any> {
  async transform(bodyReq: unknown): Promise<CreateClubDto>{

    const clubDto = plainToClass(CreateClubDto, bodyReq)
    const errors = await validate(clubDto, {
      whitelist: true,
      validationError: {
        target: false,
        value: true
      }
    })

    if(errors.length > 0) throw new BadRequestException(errors)
    else return clubDto
  }
}

@Injectable()
export class UpdateClubPipe implements PipeTransform{
  async transform(bodyReq: unknown): Promise<UpdateClubDto> {

    const updateDto = plainToClass(UpdateClubDto, bodyReq, {})
    const errors = await validate(updateDto, {
      whitelist: true,
      validationError: {
        target: false,
        value: true
      }
    })

    if(errors.length > 0)throw new BadRequestException(errors)

    else return updateDto
  } 
}