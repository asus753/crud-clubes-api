import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ClubService } from '../club.service';
import { INestApplication, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { NewClubValidationPipe, UpdateClubPipe } from '../validation.pipe';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Club } from '../club.entity';

describe('club', () => {
  let app: INestApplication

  const mockClubService = {
    findAll: jest.fn(() => ['clubs']),
    findUnique: jest.fn(() => 'club'),
    create: jest.fn(),
    update: jest.fn((id, any) => any)
  }

  const mockPipeCreate = {
    transform: jest.fn(body => body)
  }
  
  const mockPipeUpdate = {
    transform: jest.fn(body => body)
  }
  
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).overrideProvider(ClubService).useValue(mockClubService)
      .overridePipe(NewClubValidationPipe).useValue(mockPipeCreate)
      .overridePipe(UpdateClubPipe).useValue(mockPipeUpdate)
      .overrideProvider(getRepositoryToken(Club)).useValue(null)
      .compile()

    app = module.createNestApplication()
    await app.init()
  })

  it('/GET club', () => {
    return request(app.getHttpServer())
      .get('/club')
      .expect(HttpStatus.OK, mockClubService.findAll())
  })

  describe('/GET club/:id', () => {
    it('susccesfully find', () => {
      const CLUB_ID = '1'

      return request(app.getHttpServer())
        .get(`/club/${CLUB_ID}`)
        .expect(() => expect(mockClubService.findUnique).toBeCalledWith(CLUB_ID))
        .expect(HttpStatus.OK, mockClubService.findUnique())
    })

    it('not found', async () => {
      const CLUB_ID = '-1'

      mockClubService.findUnique.mockReturnValue(null)

      await request(app.getHttpServer())
        .get(`/club/${CLUB_ID}`)
        .expect(HttpStatus.NOT_FOUND, new NotFoundException().getResponse())

      mockClubService.findUnique.mockImplementation(() => 'club')  
    })
  })

  describe('/POST club', () => {

    beforeEach(() => {
      mockClubService.create.mockClear()
    })

    it('succesfully post', () => {
      const req = {name: 'someone club'}

      return request(app.getHttpServer())
        .post('/club')
        .send(req)
        .expect(() => expect(mockPipeCreate.transform).toBeCalled())
        .expect(() => expect(mockClubService.create).toBeCalledWith(req))
        .expect(HttpStatus.CREATED)
    })

    it('bad request', () => {
      const badRequestException = new BadRequestException('validation errors')

      mockPipeCreate.transform.mockRejectedValueOnce(badRequestException)

      return request(app.getHttpServer())
        .post('/club')
        .expect(() => expect(mockClubService.create).not.toBeCalled())
        .expect(HttpStatus.BAD_REQUEST, badRequestException.getResponse())
    })
  })

  describe('/PUT club', () => {

    beforeEach(() => {
      mockClubService.update.mockClear()
    })


    it('succesfully update', () => {
      const CLUB_ID = 1
      const req = {name: 'new name'}


      return request(app.getHttpServer())
        .put(`/club/${CLUB_ID}`)
        .send(req)
        .expect(() => expect(mockPipeUpdate.transform).toBeCalled())
        .expect(() => expect(mockClubService.update).toBeCalledWith(CLUB_ID, req))
        .expect(HttpStatus.OK, req)
    })

    it('not found', () => {
      const CLUB_ID = -1
      const req = {name: 'new name'}
      const notFoundException = new NotFoundException()
    
      mockClubService.update.mockRejectedValueOnce(notFoundException)

      return request(app.getHttpServer())
        .put(`/club/${CLUB_ID}`)
        .send(req)
        .expect(HttpStatus.NOT_FOUND, notFoundException.getResponse())

    })

    it('bad request', () => {
      const CLUB_ID = 1
      const badReq = {name: 555}
      const badRequestException = new BadRequestException('validation errors')

      mockPipeUpdate.transform.mockRejectedValueOnce(badRequestException)

      return request(app.getHttpServer())
        .put(`/club/${CLUB_ID}`)
        .send(badReq)
        .expect(() => expect(mockClubService.update).not.toBeCalled())
        .expect(HttpStatus.BAD_REQUEST, badRequestException.getResponse())
    })
  })


})

