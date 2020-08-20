import { Test } from "@nestjs/testing"
import { AreaService } from "../area.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Area } from "../area.entity"
import { Repository } from "typeorm"
import areaFixture from './area.fixture'


describe('areaService', () => {
  const mockAreaRepository = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    findOne: jest.fn(async (name: {area: string}) => areaFixture)
  }

  let areaService: AreaService
  let areaRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AreaService,
        {provide: getRepositoryToken(Area), useValue: mockAreaRepository}
      ]
    }).compile()

    areaService = module.get<AreaService>(AreaService)
    areaRepository = module.get<Repository<Area>>(getRepositoryToken(Area))
  })

  it('get by name', async () => {
    const areaName = 'Argentina'
    const area = await areaService.findByName(areaName)
    
    expect(areaRepository.findOne).toBeCalledWith({name: areaName})
    expect(area).toBe(areaFixture)
  })
})