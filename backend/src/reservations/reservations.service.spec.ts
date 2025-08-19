import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Availability } from 'src/availabilities/entities/availability.entity';
import { MailService } from 'src/mail/mail.service';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationRepo: Partial<Record<keyof Repository<Reservation>, jest.Mock>>;
  let availabilityRepo: Partial<Record<keyof Repository<Availability>, jest.Mock>>;
  let mailService: MailService;

  beforeEach(async () => {
    reservationRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    availabilityRepo = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const httpServiceMock = {
      post: jest.fn().mockReturnValue(of({ data: {} })),
      get: jest.fn().mockReturnValue(of({ data: {} })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: getRepositoryToken(Reservation), useValue: reservationRepo },
        { provide: getRepositoryToken(Availability), useValue: availabilityRepo },
        {
            provide: MailService,
            useValue: {
              sendReservationConfirmation: jest.fn(),
            },
          },                
        { provide: HttpService, useValue: httpServiceMock },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    mailService = module.get<MailService>(MailService);
  });

  describe('create', () => {
    it('should throw NotFoundException if availability not found', async () => {
      availabilityRepo.findOne?.mockResolvedValue(null);
      await expect(
        service.create({ availabilityId: '1', title: 'Test', organizerEmail: 'a@b.com' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if availability inactive', async () => {
      availabilityRepo.findOne?.mockResolvedValue({ id: '1', isActive: false });
      await expect(
        service.create({ availabilityId: '1', title: 'Test', organizerEmail: 'a@b.com' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if availability booked', async () => {
      availabilityRepo.findOne?.mockResolvedValue({ id: '1', isActive: true, isBooked: true });
      await expect(
        service.create({ availabilityId: '1', title: 'Test', organizerEmail: 'a@b.com' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if requested participantsCount > maxParticipants', async () => {
      availabilityRepo.findOne?.mockResolvedValue({ id: '1', isActive: true, isBooked: false, maxParticipants: 2 });
      await expect(
        service.create({ availabilityId: '1', title: 'Test', organizerEmail: 'a@b.com', participantsCount: 5 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create reservation and send mail', async () => {
      const availability = { id: '1', isActive: true, isBooked: false, maxParticipants: 5 };
      const savedReservation = { id: 'r1', title: 'Test', participantsCount: 1, organizerEmail: 'a@b.com', token: 'uuid' };
      availabilityRepo.findOne?.mockResolvedValue(availability);
      reservationRepo.create?.mockReturnValue(savedReservation);
      reservationRepo.save?.mockResolvedValue(savedReservation);

      const result = await service.create({ availabilityId: '1', title: 'Test', organizerEmail: 'a@b.com' });

      expect(reservationRepo.create).toHaveBeenCalled();
      expect(reservationRepo.save).toHaveBeenCalled();
      expect(mailService.sendReservationConfirmation).toHaveBeenCalledWith(
        savedReservation.organizerEmail,
        savedReservation.title,
        savedReservation.participantsCount,
        savedReservation.token,
      );
      expect(result).toBe(savedReservation);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if reservation not found', async () => {
      reservationRepo.findOne?.mockResolvedValue(null);
      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });

    it('should return reservation if found', async () => {
      const reservation = { id: '1' };
      reservationRepo.findOne?.mockResolvedValue(reservation);
      const result = await service.findOne('1');
      expect(result).toBe(reservation);
    });
  });

  describe('findByToken', () => {
    it('should return reservation for given token', async () => {
      const reservation = { token: 'token123' };
      reservationRepo.findOne?.mockResolvedValue(reservation);
      const result = await service.findByToken('token123');
      expect(result).toBe(reservation);
    });

    it('should return null if not found', async () => {
      reservationRepo.findOne?.mockResolvedValue(null);
      const result = await service.findByToken('token123');
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all reservations', async () => {
      const reservations = [{ id: '1' }];
      reservationRepo.find?.mockResolvedValue(reservations);
      const result = await service.findAll();
      expect(result).toBe(reservations);
    });
  });

  describe('findByEstablishment', () => {
    it('should return reservations for a given establishment', async () => {
      const reservations = [{ id: '1', availability: { establishmentId: 'est-1' } }];
      reservationRepo.find?.mockResolvedValue(reservations);
      const result = await service.findByEstablishment('est-1');
      expect(result).toBe(reservations);
    });
  });

  describe('update', () => {
    it('should update a reservation and return updated', async () => {
      const reservation = { id: 'id', title: 'new' };
      reservationRepo.update?.mockResolvedValue({ affected: 1 });
      reservationRepo.findOne?.mockResolvedValue(reservation);

      const result = await service.update('id', { title: 'new' });
      expect(reservationRepo.update).toHaveBeenCalledWith('id', { title: 'new' });
      expect(result).toBe(reservation);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if reservation not found', async () => {
      reservationRepo.findOne?.mockResolvedValue(null);
      await expect(service.remove('id')).rejects.toThrow(NotFoundException);
    });

    it('should remove reservation and update availability', async () => {
      const reservation = { id: 'id', availabilityId: 'a1' };
      reservationRepo.findOne?.mockResolvedValue(reservation);
      reservationRepo.delete?.mockResolvedValue({});
      availabilityRepo.update?.mockResolvedValue({});

      await service.remove('id');

      expect(availabilityRepo.update).toHaveBeenCalledWith('a1', { isBooked: false });
      expect(reservationRepo.delete).toHaveBeenCalledWith('id');
    });
  });
});
