import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from '../club/club.entity';
import { invalidCreationRequest, validCreationRequest, validUpdateRequest, invalidUpdateRequest } from '../club/__tests__/fixtures/requests.fixture';
import { Area } from '../area/area.entity';
import { ClubModule } from '../club/club.module';
import { getRepository } from 'typeorm';

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
})

