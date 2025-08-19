import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { EstablishmentsController } from './establishments.controller';
import { EstablishmentsService } from './establishments.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishement.dto';

describe('EstablishmentsController (e2e)', () => {
  let app: INestApplication;
  let service: EstablishmentsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstablishmentsController],
      providers: [
        {
          provide: EstablishmentsService,
          useValue: mockService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    service = module.get<EstablishmentsService>(EstablishmentsService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('/POST establishments', () => {
    const dto: CreateEstablishmentDto = { name: 'Test', address: '123 Main St' };
    const created = { id: '1', ...dto };
    mockService.create.mockResolvedValue(created);

    return request(app.getHttpServer())
      .post('/establishments')
      .send(dto)
      .expect(201)
      .expect(created);
  });

  it('/GET establishments', () => {
    const list = [{ id: '1', name: 'Test', address: '123 Main St' }];
    mockService.findAll.mockResolvedValue(list);

    return request(app.getHttpServer())
      .get('/establishments')
      .expect(200)
      .expect(list);
  });

  it('/GET establishments/:id', () => {
    const item = { id: '1', name: 'Test', address: '123 Main St' };
    mockService.findOne.mockResolvedValue(item);

    return request(app.getHttpServer())
      .get('/establishments/1')
      .expect(200)
      .expect(item);
  });

  it('/PATCH establishments/:id', () => {
    const dto: UpdateEstablishmentDto = { name: 'Updated Name' };
    const updated = { id: '1', name: 'Updated Name', address: '123 Main St' };
    mockService.update.mockResolvedValue(updated);

    return request(app.getHttpServer())
      .patch('/establishments/1')
      .send(dto)
      .expect(200)
      .expect(updated);
  });

  it('/DELETE establishments/:id', () => {
    mockService.remove.mockResolvedValue(undefined);

    return request(app.getHttpServer())
      .delete('/establishments/1')
      .expect(200); // par défaut Nest retourne 200 si pas de code spécifique
  });
});
