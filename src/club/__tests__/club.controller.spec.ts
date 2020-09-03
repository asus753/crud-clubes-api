jest.mock('../club.service')
import { ClubController } from '../club.controller'
import { mocked } from 'ts-jest/utils'
import { ClubService } from '../club.service'
import { Club } from '../club.entity'
import { Repository } from 'typeorm'
import { AreaService } from 'src/area/area.service'
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'
import { CreateClubDto } from '../dto/create-club.dto'
import { newClubDtoFixture, updateClubDtoFixture } from './fixtures/dto.fixture'
import { plainToClass } from 'class-transformer'
import { ValidationError } from 'class-validator'
import { UpdateClubDto } from '../dto/update-club.dto'
import clubFixture from './fixtures/club.fixture'

describe('club controller tests', () => {
  const clubService = new ClubService(
    (null as unknown) as Repository<Club>,
    (null as unknown) as AreaService,
  )
  const clubController = new ClubController(clubService)

  it('get all clubs', async () => {
    await clubController.findAll()

    expect(clubService.findAll).toBeCalled()
  })

  describe('get unique club', () => {
    beforeEach(() => {
      mocked(clubService).findUnique.mockClear()
    })

    it('get existent club', async () => {
      const CLUB_ID = 1
      mocked(clubService).findUnique.mockResolvedValueOnce(new Club())

      const club = await clubController.findUnique(CLUB_ID)

      expect(clubService.findUnique).toBeCalledWith(CLUB_ID)
      expect(club).toBeInstanceOf(Club)
    })

    it('get non-existent club', async () => {
      const CLUB_ID = -1
      mocked(clubService).findUnique.mockRejectedValueOnce(null)

      try {
        await clubController.findUnique(CLUB_ID)
      } catch (error) {
        expect(clubService.findUnique).toBeCalledWith(CLUB_ID)
        expect(error).toBeInstanceOf(NotFoundException)
      }
    })
  })

  describe('create club', () => {
    const createDto = plainToClass(CreateClubDto, newClubDtoFixture)

    beforeEach(() => {
      mocked(clubService).create.mockClear()
    })

    it('create succesfully', async () => {
      await clubController.create(createDto)

      expect(clubService.create).toBeCalledWith(createDto)
      expect(clubService.create).toBeCalledTimes(1)
    })

    it('create unseccesfully: area invalid', async () => {
      mocked(clubService).create.mockRejectedValueOnce(new ValidationError())

      try {
        await clubController.create(createDto)
      } catch (error) {
        const validationErrorsArray = error.getResponse().message

        expect(clubService.create).toBeCalledWith(createDto)
        expect(clubService.create).toBeCalledTimes(1)
        expect(error).toBeInstanceOf(BadRequestException)
        expect(
          validationErrorsArray.every(
            error => error instanceof ValidationError,
          ),
        ).toBe(true)
      }
    })

    it('create unseccesfully: unkonow error', async () => {
      const unkonowError = new Error('unkown error')
      mocked(clubService).create.mockRejectedValueOnce(unkonowError)
      const spyConsoleError = spyOn(global.console, 'error')

      try {
        await clubController.create(createDto)
      } catch (error) {
        expect(clubService.create).toBeCalledWith(createDto)
        expect(clubService.create).toBeCalledTimes(1)
        expect(error).toBeInstanceOf(InternalServerErrorException)
        expect(spyConsoleError).toBeCalledWith(unkonowError)
      }
    })
  })

  describe('update club', () => {
    const updateDto = plainToClass(UpdateClubDto, updateClubDtoFixture)
    const club = plainToClass(Club, clubFixture)

    beforeEach(() => {
      mocked(clubService).findUnique.mockReset()
      mocked(clubService).update.mockClear()
    })

    it('update succesfully', async () => {
      const CLUB_ID_TO_UPDATE = 1
      mocked(clubService).findUnique.mockResolvedValueOnce(club)
      mocked(clubService).findUnique.mockResolvedValueOnce(club)

      const clubUpdated = await clubController.update(
        CLUB_ID_TO_UPDATE,
        updateDto,
      )

      expect(clubService.findUnique).toBeCalledWith(CLUB_ID_TO_UPDATE)
      expect(clubService.findUnique).toBeCalledTimes(2)
      expect(clubService.update).toBeCalledWith(club, updateDto)
      expect(clubUpdated).toBeInstanceOf(Club)
    })

    it('update unsuccsesfully: not found club', async () => {
      const CLUB_ID_TO_UPDATE = -1
      mocked(clubService).findUnique.mockRejectedValueOnce(null)
      const spyFindUniqueController = jest.spyOn(clubController, 'findUnique')
      
      try {
        await clubController.update(CLUB_ID_TO_UPDATE, updateDto)
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
        expect(clubService.findUnique).toBeCalledTimes(1)
        expect(spyFindUniqueController).toBeCalledTimes(1)
        expect(clubService.update).not.toBeCalled()
      }
    })

    it('update unsuccsesfully: non-existent area', async () => {
      const CLUB_ID_TO_UPDATE = 1
 
      mocked(clubService).findUnique.mockResolvedValueOnce(club)
      mocked(clubService).update.mockRejectedValueOnce(new ValidationError())

      try {
        await clubController.update(CLUB_ID_TO_UPDATE, updateDto)
      } catch (error) {
        const validationErrorsArray = error.getResponse().message

        expect(error).toBeInstanceOf(BadRequestException)
        expect(
          validationErrorsArray.every(
            error => error instanceof ValidationError,
          ),
        ).toBe(true)
      }
    })
  })

  describe('delete club', () => {
    it('delete succesfully', async () => {
      const CLUB_ID_TO_DELETE = 1

      await clubController.delete(CLUB_ID_TO_DELETE)

      expect(clubService.delete).toBeCalledWith(CLUB_ID_TO_DELETE)
    })
  })
})
