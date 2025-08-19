import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilitiesService } from './availabilities.service';
import { Repository } from 'typeorm';
import { Availability } from './entities/availability.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

// 👉 Mock de repository TypeORM
const mockAvailabilityRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
});

describe('AvailabilitiesService', () => {
  let service: AvailabilitiesService;
  let repository: jest.Mocked<Repository<Availability>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilitiesService,
        {
          provide: getRepositoryToken(Availability),
          useFactory: mockAvailabilityRepository,
        },
      ],
    }).compile();

    service = module.get<AvailabilitiesService>(AvailabilitiesService);
    repository = module.get(getRepositoryToken(Availability));
  });

  describe('create', () => {
    it('should create and save availability if startTime < endTime', async () => {
      const dto = { startTime: '09:00', endTime: '10:00' } as any;
      const availability = { id: '1', ...dto };

      repository.create.mockReturnValue(availability);
      repository.save.mockResolvedValue(availability);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(availability);
      expect(result).toEqual(availability);
    });

    it('should throw BadRequestException if startTime >= endTime', async () => {
      const dto = { startTime: '10:00', endTime: '09:00' } as any;

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAllByEstablishment', () => {
    it('should throw if establishmentId is missing', async () => {
      await expect(service.findAllByEstablishment('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return list of availabilities ordered by date/startTime', async () => {
      const mockAvailabilities = [
        { id: '1', date: '2025-01-01', startTime: '09:00' },
      ] as any;
      repository.find.mockResolvedValue(mockAvailabilities);

      const result = await service.findAllByEstablishment('est-123');

      expect(repository.find).toHaveBeenCalledWith({
        where: { establishmentId: 'est-123' },
        order: { date: 'ASC', startTime: 'ASC' },
      });
      expect(result).toEqual(mockAvailabilities);
    });
  });

  describe('findOne', () => {
    it('should return availability if found', async () => {
      const availability = { id: '1' } as any;
      repository.findOneBy.mockResolvedValue(availability);

      const result = await service.findOne('1');

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(result).toBe(availability);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update availability if times are valid', async () => {
      const existing = { id: '1', startTime: '09:00', endTime: '10:00' } as any;
      repository.findOneBy.mockResolvedValue(existing);
      repository.save.mockResolvedValue({ ...existing, startTime: '08:00' });

      const result = await service.update('1', { startTime: '08:00' });

      expect(result.startTime).toBe('08:00');
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw if startTime >= endTime', async () => {
      const existing = { id: '1', startTime: '09:00', endTime: '10:00' } as any;
      repository.findOneBy.mockResolvedValue(existing);

      await expect(
        service.update('1', { startTime: '11:00', endTime: '10:00' } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove availability if not booked', async () => {
      const availability = { id: '1', isBooked: false } as any;
      repository.findOneBy.mockResolvedValue(availability);
      repository.remove.mockResolvedValue(availability); // ✅ correction
  
      await service.remove('1');
  
      expect(repository.remove).toHaveBeenCalledWith(availability);
    });

    it('should throw ConflictException if already booked', async () => {
      const availability = { id: '1', isBooked: true } as any;
      repository.findOneBy.mockResolvedValue(availability);

      await expect(service.remove('1')).rejects.toThrow(ConflictException);
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});
