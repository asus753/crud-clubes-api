jest.mock('../../area/area.service')
import { NewClubValidationPipe, UpdateClubPipe } from '../validation.pipe'
import { AreaService } from '../../area/area.service'
import { mocked } from 'ts-jest/utils'
import { invalidCreationRequest, validCreationRequest, invalidUpdateRequest, validUpdateRequest } from './fixtures/requests.fixture'
import { BadRequestException } from '@nestjs/common'
import { Club } from '../club.entity'

const mockedAreaService = mocked(AreaService, true)

describe('new club pipe', () => {
  const areaServiceInstance = new AreaService(null)
  const pipe = new NewClubValidationPipe(areaServiceInstance)

  beforeEach(() => {
    mockedAreaService.mockClear()
    mockedAreaService.prototype.findByName.mockClear()
  })

  it('unseccsefully creation', async () => {
    try {
      await pipe.transform(invalidCreationRequest)
    } catch (error) {

      const validationErrorsArray = error.getResponse().message
      
      expect(error).toBeInstanceOf(BadRequestException)
      expect(Array.isArray(validationErrorsArray)).toBe(true)
      expect(areaServiceInstance.findByName).toBeCalledWith(invalidCreationRequest.area)
    }
  })

  it('succsesfully creation', async () => {
    const areaEg = {
      id: 1,
      name: 'example area'
    }
    mockedAreaService.prototype.findByName.mockResolvedValueOnce(areaEg)

    const clubValidated = await pipe.transform(validCreationRequest)

    expect(clubValidated).toMatchObject(new Club())
    expect(areaServiceInstance.findByName).toBeCalledWith(validCreationRequest.area)
    expect(clubValidated.area).toBe(areaEg)
  })

})

describe('update club pipe', () => {
  const areaServiceInstance = new AreaService(null)
  const updatePipe = new UpdateClubPipe(areaServiceInstance)

  beforeEach(() => {
    mockedAreaService.mockClear()
    mockedAreaService.prototype.findByName.mockClear()
  })

  it('unsucssesfully update', async () => {
    try {
      await updatePipe.transform(invalidUpdateRequest)
    } catch (error) {

      const validationErrorsArray = error.getResponse().message
      
      expect(error).toBeInstanceOf(BadRequestException)
      expect(Array.isArray(validationErrorsArray)).toBe(true)
      expect(areaServiceInstance.findByName).toBeCalledWith(invalidUpdateRequest.area)
    }
  })

  it('sucssesfully update', async () => {
    const areaEg = {
      id: 1,
      name: 'example area'
    }
    mockedAreaService.prototype.findByName.mockResolvedValueOnce(areaEg)

    const updateClub = await updatePipe.transform(validUpdateRequest)

    expect(updateClub).toMatchObject({...validUpdateRequest, area: areaEg})
    expect(areaServiceInstance.findByName).toBeCalledWith(validUpdateRequest.area)
    expect(updateClub.area).toBe(areaEg)

  })
})