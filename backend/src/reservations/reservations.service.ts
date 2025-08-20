import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { randomUUID } from 'crypto';
import { Availability } from 'src/availabilities/entities/availability.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
    
    private readonly mailService: MailService,

  ) { }


async create(dto: CreateReservationDto): Promise<Reservation> {
    const availability = await this.availabilityRepository.findOne({
      where: { id: dto.availabilityId },
    });

    if (!availability) {
      throw new NotFoundException('La disponibilité demandée est introuvable.');
    }

    if (!availability.isActive) {
      throw new BadRequestException("Cette disponibilité n'est plus active.");
    }

    if (availability.isBooked) {
      throw new ConflictException('Cette disponibilité est déjà complètement réservée.');
    }

    const requestedCount = dto.participantsCount ?? 1;

    if (requestedCount <= 0) {
      throw new BadRequestException('Le nombre de participants doit être supérieur à 0.');
    }

    if (requestedCount > availability.maxParticipants) {
      throw new BadRequestException(
        `Nombre de participants demandé (${requestedCount}) supérieur à la capacité (${availability.maxParticipants}).`,
      );
    }

    const reservation = this.reservationRepository.create({
      title: dto.title,
      description: dto.description,
      organizerEmail: dto.organizerEmail,
      availabilityId: availability.id,
      token: randomUUID(),
      participantsCount: requestedCount,
    });

    const savedReservation = await this.reservationRepository.save(reservation);

    /* pour le moment à chaque réservation, la disponnibilité passe à "réservée" */
      await this.availabilityRepository.update(availability.id, {
        isBooked: true,
        isActive: false,
      });

    /* le but sera dans le futur de prendre en compte la confirmation de chaque participants.
    if (requestedCount >= availability.maxParticipants) {
      await this.availabilityRepository.update(availability.id, {
        isBooked: true,
        isActive: false,
      });
    } */

    // Envoi de l'email de confirmation
    await this.mailService.sendReservationConfirmation(
      savedReservation.organizerEmail,
      savedReservation.title,
      savedReservation.participantsCount,
      savedReservation.id,
    );

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
    return this.reservationRepository.find();
  }

async findOne(id: string) {
  const reservation = await this.reservationRepository.findOne({
    where: { id },
    relations: ['availability', 'availability.establishment'], // récupère la disponibilité et l'établissement associé
  });

  if (!reservation) {
    throw new NotFoundException('Reservation not found');
  }

  return {
    id: reservation.id,
    title: reservation.title,
    description: reservation.description,
    organizerEmail: reservation.organizerEmail,
    participantsCount: reservation.participantsCount,
    participants: reservation.participants || [],
    availability: {
      id: reservation.availability.id,
      date: reservation.availability.date,
      startTime: reservation.availability.startTime,
      endTime: reservation.availability.endTime,
      maxParticipants: reservation.availability.maxParticipants,
      details: reservation.availability.details,
      isActive: reservation.availability.isActive,
      isBooked: reservation.availability.isBooked,
      establishment: {
        id: reservation.availability.establishment.id,
        name: reservation.availability.establishment.name,
        description: reservation.availability.establishment.description,
        address: reservation.availability.establishment.address,
        phone: reservation.availability.establishment.phone,
      },
    },
  };
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
