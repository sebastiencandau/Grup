import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { randomUUID } from 'crypto';
import { Availability } from 'src/availabilities/entities/availability.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
  ) { }

  async create(dto: CreateReservationDto) {
    const availability = await this.availabilityRepository.findOne({
      where: { id: dto.availabilityId },
    });

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    if (!availability.isActive) {
      throw new Error('Availability is not active');
    }

    if ((availability as any).isBooked) {
      throw new Error('Availability is already booked');
    }

    // Vérifie que le nombre de participants ne dépasse pas la capacité
    const count = dto.participantsCount ?? 1;
    if (count > availability.maxParticipants) {
      throw new Error(`Cannot reserve more than ${availability.maxParticipants} participants`);
    }

    // Crée la réservation
    const reservation = this.reservationRepository.create({
      title: dto.title,
      description: dto.description,
      organizerEmail: dto.organizerEmail,
      availabilityId: availability.id,
      token: randomUUID(),
      participantsCount: count,
    });

    const savedReservation = await this.reservationRepository.save(reservation);

    // Marque la disponibilité comme réservée si la capacité est atteinte
    if (count >= availability.maxParticipants) {
      await this.availabilityRepository.update(availability.id, { isBooked: true });
    }

    return savedReservation;
  }

  async findByEstablishment(establishmentId: string) {
    return this.reservationRepository.find({
      where: {
        availability: {
          establishmentId,
        },
      },
      relations: ['availability'], // nécessaire pour que `availability.establishmentId` soit utilisable
    });
  }


  findAll() {
    return this.reservationRepository.find({ relations: ['participants'] });
  }

  async findOne(id: string) {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['participants'],
    });
    if (!reservation) throw new NotFoundException('Reservation not found');
    return reservation;
  }

  async update(id: string, dto: UpdateReservationDto) {
    await this.reservationRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const reservation = await this.reservationRepository.findOne({ where: { id } });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // Marquer la disponibilité comme non réservée
    if (reservation.availabilityId) {
      await this.availabilityRepository.update(reservation.availabilityId, {
        isBooked: false,
      });
    }

    // Supprimer la réservation
    await this.reservationRepository.delete(id);
  }


  async findByToken(token: string) {
    return this.reservationRepository.findOne({
      where: { token },
      relations: ['participants'],
    });
  }
}
