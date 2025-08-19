import { Test, TestingModule } from '@nestjs/testing';
import { EstablishmentsService } from './establishments.service';
import { Establishment } from './entities/establishment.entity';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';

// Mock global du repository
const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

type MockRepository<T = any> = ReturnType<typeof mockRepository>;

describe('EstablishmentsService', () => {
  let service: EstablishmentsService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstablishmentsService,
        { provide: 'EstablishmentRepository', useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<EstablishmentsService>(EstablishmentsService);
    repository = module.get<MockRepository>('EstablishmentRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new establishment', async () => {
      const dto = { name: 'Test', address: '123 rue', description: 'desc', phone: '123' };
      repository.findOne.mockResolvedValue(undefined);
      repository.create.mockReturnValue(dto);
      repository.save.mockResolvedValue({ id: '1', ...dto });

      const result = await service.create(dto);
      expect(result).toEqual({ id: '1', ...dto });
      expect(repository.save).toHaveBeenCalledWith(dto);
    });

    it('should throw conflict if establishment exists', async () => {
      repository.findOne.mockResolvedValue({ id: '1', name: 'Test' });

      await expect(service.create({ name: 'Test', address: '123' }))
        .rejects
        .toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all establishments', async () => {
      const data = [{ id: '1', name: 'Test', address: '123' }];
      repository.find.mockResolvedValue(data);

      const result = await service.findAll();
      expect(result).toEqual(data);
    });
  });

  describe('findOne', () => {
    it('should return an establishment', async () => {
      const data = { id: '1', name: 'Test', address: '123' };
      repository.findOneBy.mockResolvedValue(data);

      const result = await service.findOne('1');
      expect(result).toEqual(data);
    });

    it('should throw not found if no establishment', async () => {
      repository.findOneBy.mockResolvedValue(undefined);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw bad request if no id', async () => {
      await expect(service.findOne('')).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update an establishment', async () => {
      const existing = { id: '1', name: 'Old', address: '123' };
      const dto = { name: 'New' };
      repository.findOneBy.mockResolvedValue(existing);
      repository.save.mockResolvedValue({ ...existing, ...dto });

      const result = await service.update('1', dto);
      expect(result.name).toBe('New');
    });

    it('should throw bad request if dto is empty', async () => {
      const existing = { id: '1', name: 'Old', address: '123' };
      repository.findOneBy.mockResolvedValue(existing);
      await expect(service.update('1', {})).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove an establishment', async () => {
      const existing = { id: '1', name: 'Test', address: '123', availabilities: [] };
      repository.findOneBy.mockResolvedValue(existing);
      repository.remove.mockResolvedValue(undefined);

      await service.remove('1');
      expect(repository.remove).toHaveBeenCalledWith(existing);
    });

    it('should throw conflict if has availabilities', async () => {
      const existing = { id: '1', name: 'Test', address: '123', availabilities: [{}] };
      repository.findOneBy.mockResolvedValue(existing);
      await expect(service.remove('1')).rejects.toThrow(ConflictException);
    });
  });
});
