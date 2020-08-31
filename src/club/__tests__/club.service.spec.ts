import { Test } from '@nestjs/testing'
import { ClubService } from '../club.service'
import { Club } from '../club.entity'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import clubFixture from './fixtures/club.fixture'
import { AreaService } from '../../area/area.service'
import { newClubDtoFixture } from './fixtures/dto.fixture'
import { ValidationError } from 'class-validator'
import { plainToClass } from 'class-transformer'

const mockClubRepository = {
  find: jest.fn().mockResolvedValue(['all clubs']),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}

const mockAreaService = {
  findByName: jest.fn(),
}

describe('ClubService', () => {
  let clubService: ClubService
  let clubRepository
  let areaService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ClubService,
        { provide: getRepositoryToken(Club), useValue: mockClubRepository },
        { provide: AreaService, useValue: mockAreaService },
      ],
    }).compile()

    clubService = module.get<ClubService>(ClubService)
    clubRepository = module.get<Repository<Club>>(getRepositoryToken(Club))
    areaService = module.get<AreaService>(AreaService)
  })

  describe('Get clubs', () => {
    it('get all clubs', async () => {
      const result = await clubService.findAll()
      expect(clubRepository.find).toHaveBeenCalledTimes(1)
      expect(result).toEqual(['all clubs'])
    })

    it('get one club', async () => {
      const clubId = 1
      await clubService.findUnique(clubId)
      expect(clubRepository.findOne).toHaveBeenCalledWith(clubId)
    })
  })

  describe('create club', () => {
    beforeEach(() => {
      mockAreaService.findByName.mockClear()
      mockClubRepository.create.mockClear()
      mockClubRepository.insert.mockClear()
    })

    it('create succesfully', async () => {
      const mockArea = { id: 1, name: 'area' }
      mockAreaService.findByName.mockResolvedValueOnce(mockArea)

      const newClubDto = newClubDtoFixture

      await clubService.create(newClubDto)

      expect(areaService.findByName).toBeCalledWith(newClubDto.area)
      expect(clubRepository.create).toBeCalledWith({
        ...newClubDto,
        area: mockArea,
      })
      expect(clubRepository.insert).toBeCalled()
    })

    it('create with invalid area', async () => {
      mockAreaService.findByName.mockResolvedValueOnce(undefined)

      const newClubDto = newClubDtoFixture

      try {
        await clubService.create(newClubDto)
      } catch (error) {
        expect(areaService.findByName).toBeCalledWith(newClubDto.area)
        expect(clubRepository.create).not.toBeCalled()
        expect(clubRepository.insert).not.toBeCalled()
        expect(error).toBeInstanceOf(ValidationError)
        expect(error.value).toEqual(newClubDto.area)
      }
    })
  })

  describe('update club', () => {
    beforeEach(() => {
      mockAreaService.findByName.mockClear()
      mockClubRepository.update.mockClear()
    })

    it('update succesfully without area', async () => {
      const updateInfo = { name: 'other name' }
      const clubInstance = plainToClass(Club, clubFixture)

      await clubService.update(clubInstance, updateInfo)

      expect(areaService.findByName).not.toBeCalled()
      expect(clubRepository.update).toHaveBeenCalledWith(
        clubInstance.id,
        updateInfo,
      )
    })

    it('update succesfully with area', async () => {
      const mockValidArea = { id: 1, name: 'area valid' }
      mockAreaService.findByName.mockResolvedValueOnce(mockValidArea)
      const updateDto = { name: 'other name', area: 'England' }
      const clubInstance = plainToClass(Club, clubFixture)

      await clubService.update(clubInstance, updateDto)

      expect(areaService.findByName).toBeCalledWith(updateDto.area)
      expect(clubRepository.update).toBeCalledWith(clubInstance.id, {
        ...updateDto,
        area: mockValidArea,
      })
      
    })

    it('update unsuccessfully with area', async () => {
      mockAreaService.findByName.mockResolvedValueOnce(undefined)
      const updateDto = { name: 'other name', area: 'InvalidArea' }
      const clubInstance = plainToClass(Club, clubFixture)

      try {
        await clubService.update(clubInstance, updateDto)
      } catch (error) {
        expect(areaService.findByName).toBeCalledWith(updateDto.area)
        expect(clubRepository.update).not.toBeCalled()
        expect(error).toBeInstanceOf(ValidationError)
      }
    })
  })

  describe('delete club', () => {

    it('delete succesfully', async () => {
      const CLUB_ID_TO_DELETE = 1

      await clubService.delete(CLUB_ID_TO_DELETE)

      expect(clubRepository.delete).toBeCalledWith({id: CLUB_ID_TO_DELETE})
    })
  })
})
