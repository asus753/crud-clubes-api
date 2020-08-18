import { Test } from '@nestjs/testing'
import { ClubService } from '../club.service'
import { Club } from '../club.entity'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import clubFixture from './fixtures/club.fixture'
import { NotFoundException } from '@nestjs/common'

const mockClubRepository = () => ({
  find: jest.fn().mockResolvedValue(['all clubs']),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findOne: jest.fn(async id => clubFixture),
  save: jest.fn()
})

describe('ClubService', () => {

  let clubService
  let clubRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ClubService,
        {provide: getRepositoryToken(Club), useFactory: mockClubRepository}
      ]
    }).compile()
    
    clubService = module.get<ClubService>(ClubService)
    clubRepository = module.get<Repository<Club>>(getRepositoryToken(Club))
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

  it('create club', () => {

    const newClub = 'club'
    clubService.create(newClub)
    expect(clubRepository.save).toHaveBeenCalledWith(newClub)
  })

  describe('update club', () => {

    it('update succesfully', async () => {
      const updateInfo = {name: 'other name'}
      const clubId = 1
      const result = await clubService.update(clubId, updateInfo)

      expect(clubRepository.findOne).toHaveBeenCalledWith(clubId)
      expect(clubRepository.save).toHaveBeenCalled()
      expect(result.name).toEqual(updateInfo.name)
      
    })

    it('ignore null or undefined options', async () => {
      const clubId = 1
      const updateInfo = {name: 'other name', active: undefined, venue: null}
      const result = await clubService.update(clubId, updateInfo)

      expect(result.name).toEqual(updateInfo.name)
      expect(result.active).toBeDefined()
      expect(result.venue).toBeDefined()
    })

    it('reject with non-existent club', async () => {
      const updateInfo = {name: 'other name'}
      const clubId = -1

      clubRepository.findOne.mockResolvedValue(null)
     
      expect(clubService.update(clubId, updateInfo)).rejects.toThrow(NotFoundException)
    })
  })
})