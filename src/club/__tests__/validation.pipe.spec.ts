import { NewClubValidationPipe, UpdateClubPipe } from '../validation.pipe'
import { invalidCreationRequest, validCreationRequest, invalidUpdateRequest, validUpdateRequest } from './fixtures/requests.fixture'
import { BadRequestException } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { CreateClubDto } from '../dto/create-club.dto'
import { UpdateClubDto } from '../dto/update-club.dto'


describe('new club pipe', () => {
  const creationPipe = new NewClubValidationPipe()

  it('unseccsefully creation', async () => {
    try {
      await creationPipe.transform(invalidCreationRequest)
    } catch (error) {

      const validationErrorsArray = error.getResponse().message
      
      expect(error).toBeInstanceOf(BadRequestException)
      expect(Array.isArray(validationErrorsArray)).toBe(true)
      expect(validationErrorsArray.every(error => error instanceof ValidationError))
      
    }
  })

  it('succsesfully creation', async () => {
    const clubDto = await creationPipe.transform(validCreationRequest)

    expect(clubDto).toBeInstanceOf(CreateClubDto)
  })

})

describe('update club pipe', () => {
  const updatePipe = new UpdateClubPipe()

  it('unsucssesfully update', async () => {
    try {
      await updatePipe.transform(invalidUpdateRequest)
    } catch (error) {

      const validationErrorsArray = error.getResponse().message
      
      expect(error).toBeInstanceOf(BadRequestException)
      expect(Array.isArray(validationErrorsArray)).toBe(true)
      expect(validationErrorsArray.every(error => error instanceof ValidationError)).toBe(true)
    }
  })

  it('sucssesfully update', async () => {
    const updateDto = await updatePipe.transform(validUpdateRequest)

    expect(updateDto).toBeInstanceOf(UpdateClubDto)
  })
})