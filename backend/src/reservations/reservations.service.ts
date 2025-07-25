import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async create(dto: CreateReservationDto) {
    const reservation = this.reservationRepository.create({
      ...dto,
      token: randomUUID(),
    });
    return this.reservationRepository.save(reservation);
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
    await this.reservationRepository.delete(id);
  }

  async findByToken(token: string) {
    return this.reservationRepository.findOne({
      where: { token },
      relations: ['participants'],
    });
  }
}
