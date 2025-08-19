import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { NotFoundException } from '@nestjs/common';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: Partial<Record<keyof ReservationsService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByEstablishment: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findByToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        { provide: ReservationsService, useValue: service },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
  });

  describe('create', () => {
    it('should call service.create and return result', async () => {
      const dto = { availabilityId: '1', title: 'Test', organizerEmail: 'a@b.com' };
      const result = { id: 'r1', ...dto };
      service.create?.mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all reservations', async () => {
      const reservations = [{ id: '1' }];
      service.findAll?.mockResolvedValue(reservations);
      expect(await controller.findAll()).toBe(reservations);
    });
  });

  describe('findOne', () => {
    it('should return a reservation', async () => {
      const reservation = { id: '1' };
      service.findOne?.mockResolvedValue(reservation);
      expect(await controller.findOne('1')).toBe(reservation);
    });

    it('should throw if not found', async () => {
      service.findOne?.mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEstablishment', () => {
    it('should return reservations for an establishment', async () => {
      const reservations = [{ id: '1' }];
      service.findByEstablishment?.mockResolvedValue(reservations);
      expect(await controller.findByEstablishment('est-1')).toBe(reservations);
    });
  });

  describe('update', () => {
    it('should update a reservation', async () => {
      const updated = { id: '1', title: 'Updated' };
      const dto = { title: 'Updated' };
      service.update?.mockResolvedValue(updated);
      expect(await controller.update('1', dto)).toBe(updated);
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove a reservation', async () => {
      service.remove?.mockResolvedValue(undefined);
      await expect(controller.remove('1')).resolves.toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('findByToken', () => {
    it('should return a reservation for a token', async () => {
      const reservation = { token: 'abc' };
      service.findByToken?.mockResolvedValue(reservation);
      expect(await controller.findByToken('abc')).toBe(reservation);
      expect(service.findByToken).toHaveBeenCalledWith('abc');
    });
  });
});
