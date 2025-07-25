// src/availabilities/availabilities.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
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
    const availability = this.availabilityRepository.create(createDto);
    return this.availabilityRepository.save(availability);
  }

  async findAllByEstablishment(establishmentId: string): Promise<Availability[]> {
    return this.availabilityRepository.find({
      where: { establishmentId },
      order: { date: 'ASC', startTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Availability> {
    const availability = await this.availabilityRepository.findOneBy({ id });
    if (!availability) throw new NotFoundException('Availability not found');
    return availability;
  }

  async update(id: string, updateDto: UpdateAvailabilityDto): Promise<Availability> {
    const availability = await this.findOne(id);
    Object.assign(availability, updateDto);
    return this.availabilityRepository.save(availability);
  }

  async remove(id: string): Promise<void> {
    const availability = await this.findOne(id);
    await this.availabilityRepository.remove(availability);
  }
}
