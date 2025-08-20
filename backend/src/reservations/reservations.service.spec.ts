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
  let reservationRepo: Repository<Reservation>;
  let availabilityRepo: Repository<Availability>;
  let mailService: MailService;

  beforeEach(async () => {
    const reservationRepoMock = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const availabilityRepoMock = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const mailServiceMock = {
      sendReservationConfirmation: jest.fn(),
    };

    const httpServiceMock = {
      post: jest.fn().mockReturnValue(of({ data: {} })),
      get: jest.fn().mockReturnValue(of({ data: {} })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: getRepositoryToken(Reservation), useValue: reservationRepoMock },
        { provide: getRepositoryToken(Availability), useValue: availabilityRepoMock },
        { provide: MailService, useValue: mailServiceMock },
        { provide: HttpService, useValue: httpServiceMock },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    reservationRepo = module.get(getRepositoryToken(Reservation));
    availabilityRepo = module.get(getRepositoryToken(Availability));
    mailService = module.get(MailService);
  });

  describe('create', () => {
    it('should throw NotFoundException if availability not found', async () => {
      availabilityRepo.findOne = jest.fn().mockResolvedValue(null);
      await expect(
        service.create({ availabilityId: '1', title: 'Test', organizerEmail: 'a@b.com' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if availability inactive', async () => {
      availabilityRepo.findOne = jest.fn().mockResolvedValue({ id: '1', isActive: false });
      await expect(
        service.create({ availabilityId: '1', title: 'Test', organizerEmail: 'a@b.com' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if availability booked', async () => {
      availabilityRepo.findOne = jest.fn().mockResolvedValue({ id: '1', isActive: true, isBooked: true });
      await expect(
        service.create({ availabilityId: '1', title: 'Test', organizerEmail: 'a@b.com' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if participantsCount > maxParticipants', async () => {
      availabilityRepo.findOne = jest.fn().mockResolvedValue({ id: '1', isActive: true, isBooked: false, maxParticipants: 2 });
      await expect(
        service.create({ availabilityId: '1', title: 'Test', organizerEmail: 'a@b.com', participantsCount: 5 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create reservation and send mail', async () => {
      const availability = { id: '1', isActive: true, isBooked: false, maxParticipants: 5 };
      const savedReservation = { id: 'r1', title: 'Test', participantsCount: 1, organizerEmail: 'a@b.com', token: 'uuid' };

      availabilityRepo.findOne = jest.fn().mockResolvedValue(availability);
      reservationRepo.create = jest.fn().mockReturnValue(savedReservation);
      reservationRepo.save = jest.fn().mockResolvedValue(savedReservation);

      const result = await service.create({ availabilityId: '1', title: 'Test', organizerEmail: 'a@b.com' });

      expect(reservationRepo.create).toHaveBeenCalled();
      expect(reservationRepo.save).toHaveBeenCalled();
      expect(mailService.sendReservationConfirmation).toHaveBeenCalledWith(
        savedReservation.organizerEmail,
        savedReservation.title,
        savedReservation.participantsCount,
        savedReservation.id,
      );
      expect(result).toBe(savedReservation);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if reservation not found', async () => {
      reservationRepo.findOne = jest.fn().mockResolvedValue(null);
      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });

    it('should return reservation with nested availability and establishment if found', async () => {
      const mockReservation = {
        id: '1',
        title: 'Réunion',
        description: 'Description de la réunion',
        organizerEmail: 'organizer@example.com',
        participantsCount: 3,
        participants: ['alice@example.com', 'bob@example.com'],
        availability: {
          id: '10',
          date: '2025-08-20',
          startTime: '10:00',
          endTime: '12:00',
          maxParticipants: 5,
          details: 'Salle 1',
          isActive: true,
          isBooked: false,
          establishment: {
            id: '100',
            name: 'Café Central',
            description: 'Café sympa',
            address: '123 Rue Principale',
            phone: '0123456789',
          },
        },
      };
      reservationRepo.findOne = jest.fn().mockResolvedValue(mockReservation);

      const result = await service.findOne('1');
      expect(result).toEqual(mockReservation);
    });
  });

  describe('findByToken', () => {
    it('should return reservation for given token', async () => {
      const reservation = { token: 'token123' };
      reservationRepo.findOne = jest.fn().mockResolvedValue(reservation);
      const result = await service.findByToken('token123');
      expect(result).toBe(reservation);
    });

    it('should return null if not found', async () => {
      reservationRepo.findOne = jest.fn().mockResolvedValue(null);
      const result = await service.findByToken('token123');
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all reservations', async () => {
      const reservations = [{ id: '1' }];
      reservationRepo.find = jest.fn().mockResolvedValue(reservations);
      const result = await service.findAll();
      expect(result).toBe(reservations);
    });
  });

  describe('findByEstablishment', () => {
    it('should return reservations for a given establishment', async () => {
      const reservations = [{ id: '1', availability: { establishmentId: 'est-1' } }];
      reservationRepo.find = jest.fn().mockResolvedValue(reservations);
      const result = await service.findByEstablishment('est-1');
      expect(result).toBe(reservations);
    });
  });

describe('update', () => {
  it('should update a reservation', async () => {
  const updatedData = { title: 'new title' };
  const mockReservation = { id: 'id', title: 'new title', availability: { id: 'avail-1' } };

  reservationRepo.update = jest.fn().mockResolvedValue(undefined); // update ne retourne rien
  service.findOne = jest.fn().mockResolvedValue(mockReservation);

  const result = await service.update('id', updatedData);

  expect(reservationRepo.update).toHaveBeenCalledWith('id', updatedData);
  expect(service.findOne).toHaveBeenCalledWith('id');
  expect(result).toEqual(mockReservation);
});
});



  describe('remove', () => {
    it('should throw NotFoundException if reservation not found', async () => {
      reservationRepo.findOne = jest.fn().mockResolvedValue(null);
      await expect(service.remove('id')).rejects.toThrow(NotFoundException);
    });

    it('should remove reservation and update availability', async () => {
      const reservation = { id: 'id', availabilityId: 'a1' };
      reservationRepo.findOne = jest.fn().mockResolvedValue(reservation);
      reservationRepo.delete = jest.fn().mockResolvedValue({});
      availabilityRepo.update = jest.fn().mockResolvedValue({});

      await service.remove('id');

      expect(availabilityRepo.update).toHaveBeenCalledWith('a1', { isBooked: false });
      expect(reservationRepo.delete).toHaveBeenCalledWith('id');
    });
  });
});
