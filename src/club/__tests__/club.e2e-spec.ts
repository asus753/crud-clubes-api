import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken, getConnectionToken, getEntityManagerToken,   } from '@nestjs/typeorm';
import { Club } from '../club.entity';
import { invalidCreationRequest, validCreationRequest, validUpdateRequest, invalidUpdateRequest } from './fixtures/requests.fixture';
import { Area } from '../../area/area.entity';
import { ClubModule } from '../club.module';
import { getRepository } from 'typeorm';
import { ValidationError } from 'class-validator';
import { async } from 'rxjs';


describe('club', () => {
  let app: INestApplication
  
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          synchronize: true,
          entities: [Area, Club]
        }),
        ClubModule
      ]
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
    await setupAreaTable()
  })

  async function setupAreaTable (): Promise<void>{
    const areaRepository = getRepository(Area)
    const areasForTest = ['Argentina', 'England']

    areasForTest.forEach(async area => {
      await areaRepository.insert({name: area})
    })
  }

  afterAll(() => {
    app.close()
  })

  describe('Creating new club', () => {
    it('create one club correctly', async () => {
      const bodyReq = validCreationRequest

      await request(app.getHttpServer())
        .post('/club')
        .send(bodyReq)
        .expect(HttpStatus.CREATED)
    })

    it('try to create club with invalid information', async () => {
      const bodyReq = invalidCreationRequest

      await request(app.getHttpServer())
        .post('/club')
        .send(bodyReq)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(res => {
          expect(Array.isArray(res.body.message)).toBe(true)
        })
    })

    it('try to create club with valid information but non-existent area', async () => {
      const nonExistentArea = 'Narnia'
      const bodyReq = validCreationRequest
      bodyReq.area = nonExistentArea

      await request(app.getHttpServer())
        .post('/club')
        .send(bodyReq)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(res => {
          expect(Array.isArray(res.body.message)).toBe(true)
        })
    })
  })

  describe('Geting clubs', () => {

    it('get all clubs',async () => {

      await request(app.getHttpServer())
        .get('/club')
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(Array.isArray(res.body)).toBe(true)
          expect(res.body.length).toBe(1)
        })
    })

    it('get one club succesfully', async () => {
      const CLUB_ID = 1

      await request(app.getHttpServer())
        .get('/club/' + CLUB_ID)
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toMatchObject(new Club())
        })
    })

    it('get one non-existent club', async() => {
      const CLUB_ID = -1

      await request(app.getHttpServer())
        .get('/club/' + CLUB_ID)
        .expect(HttpStatus.NOT_FOUND)
    })
  })

  //CUBRIR UPDATE METHODS

  describe('Updating clubs', () => {

    it('update succesfully', async () => {
      const CLUB_ID_TO_UPDATE = 1
      const bodyReq = validUpdateRequest

      await request(app.getHttpServer())
        .put('/club/' + CLUB_ID_TO_UPDATE)
        .send(bodyReq)
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).toMatchObject(new Club())
          expect(res.body.name).toEqual(bodyReq.name)
          expect(res.body.area.name).toEqual(bodyReq.area)
        })
    })

    it('try to update with invalid information', async () => {
      const CLUB_ID_TO_UPDATE = 1
      const bodyReq = invalidUpdateRequest

      await request(app.getHttpServer())
      .put('/club/' + CLUB_ID_TO_UPDATE)
      .send(bodyReq)
      .expect(HttpStatus.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect(res => {
        expect(Array.isArray(res.body.message)).toBe(true)
      })
    })

    it('try to update with valid information but non-existent area', async () => {
      const CLUB_ID_TO_UPDATE = 1
      const nonExistentArea = 'Narnia'
      const bodyReq = validUpdateRequest
      bodyReq.area = nonExistentArea

      await request(app.getHttpServer())
        .put('/club/' + CLUB_ID_TO_UPDATE)
        .send(bodyReq)
        .expect(HttpStatus.BAD_REQUEST)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(Array.isArray(res.body.message)).toBe(true)
        })
    })

    it('try to update non-existent club', async () => {
      const CLUB_ID_TO_UPDATE = -1
      const bodyReq = validUpdateRequest

      await request(app.getHttpServer())
        .put('/club/' + CLUB_ID_TO_UPDATE)
        .send(bodyReq)
        .expect(HttpStatus.NOT_FOUND)
    })
  })


  /*

  describe('/PUT club', () => {

    beforeEach(() => {
      mockClubService.prototype.update.mockClear()
    })


    it('succesfully update', () => {
      const CLUB_ID = 1
      const bodyReq = validUpdateRequest

      return request(app.getHttpServer())
        .put(`/club/${CLUB_ID}`)
        .send(bodyReq)
        .expect(() => expect(mockPipeUpdate.transform).toBeCalled())
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
    })

    it('unsuccesfully update: not found', () => {
      const CLUB_ID = -1
      const bodyReq = validUpdateRequest
      const notFoundException = new NotFoundException()
    
      mockClubService.prototype.findUnique.mockResolvedValueOnce(undefined)

      return request(app.getHttpServer())
        .put(`/club/${CLUB_ID}`)
        .send(bodyReq)
        .expect(() => expect(mockPipeUpdate.transform).toBeCalled())
        .expect(HttpStatus.NOT_FOUND, notFoundException.getResponse())
    })

    it('unsuccesfully update: bad request', () => {
      const CLUB_ID = 1
      const bodyReq = invalidUpdateRequest
      const badRequestException = new BadRequestException('validation errors')

      mockPipeUpdate.transform.mockRejectedValueOnce(badRequestException)

      return request(app.getHttpServer())
        .put(`/club/${CLUB_ID}`)
        .send(bodyReq)
        .expect(() => expect(mockClubService.prototype.update).not.toBeCalled())
        .expect(HttpStatus.BAD_REQUEST, badRequestException.getResponse())
    })
  }) */
})

