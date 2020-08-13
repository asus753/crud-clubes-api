import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ClubValidationPipe implements PipeTransform<any> {
  async transform(value: unknown, { metatype }: ArgumentMetadata): Promise<unknown>{

    const object = plainToClass(metatype, value)
    const errors = await validate(object, {
      whitelist: true,
      validationError: {
        target: false,
        value: true
      }
    })

    if(errors.length > 0) throw new BadRequestException(errors)
    return value
  }
  
}