import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Availability } from './entities/availability.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

@Injectable()
export class AvailabilitiesService {
  constructor(
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
  ) {}

  async create(createDto: CreateAvailabilityDto): Promise<Availability> {
    if (createDto.startTime >= createDto.endTime) {
      throw new BadRequestException("L'heure de début doit être avant l'heure de fin.");
    }

    const availability = this.availabilityRepository.create(createDto);
    return this.availabilityRepository.save(availability);
  }

  async findAllByEstablishment(establishmentId: string): Promise<Availability[]> {
    if (!establishmentId) {
      throw new BadRequestException("L'établissement est requis.");
    }

    return this.availabilityRepository.find({
      where: { establishmentId },
      order: { date: 'ASC', startTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Availability> {
    const availability = await this.availabilityRepository.findOneBy({ id });

    if (!availability) {
      throw new NotFoundException("Disponibilité introuvable.");
    }

    return availability;
  }

  async update(id: string, updateDto: UpdateAvailabilityDto): Promise<Availability> {
    const availability = await this.findOne(id);

    if (updateDto.startTime && updateDto.endTime && updateDto.startTime >= updateDto.endTime) {
      throw new BadRequestException("L'heure de début doit précéder l'heure de fin.");
    }

    Object.assign(availability, updateDto);
    return this.availabilityRepository.save(availability);
  }

  async remove(id: string): Promise<void> {
    const availability = await this.findOne(id);

    if (availability.isBooked) {
      throw new ConflictException("Impossible de supprimer une disponibilité déjà réservée.");
    }

    await this.availabilityRepository.remove(availability);
  }
}
