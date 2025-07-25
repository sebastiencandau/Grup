import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Establishment } from './entities/establishment.entity';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishement.dto';

@Injectable()
export class EstablishmentsService {
  constructor(
    @InjectRepository(Establishment)
    private readonly establishmentRepository: Repository<Establishment>,
  ) {}

  async create(createEstablishmentDto: CreateEstablishmentDto): Promise<Establishment> {
    const establishment = this.establishmentRepository.create(createEstablishmentDto);
    return this.establishmentRepository.save(establishment);
  }

  async findAll(): Promise<Establishment[]> {
    return this.establishmentRepository.find();
  }

  async findOne(id: string): Promise<Establishment> {
    const establishment = await this.establishmentRepository.findOneBy({ id });
    if (!establishment) {
      throw new NotFoundException(`Establishment with id ${id} not found`);
    }
    return establishment;
  }

  async update(id: string, updateEstablishmentDto: UpdateEstablishmentDto): Promise<Establishment> {
    const establishment = await this.findOne(id);
    Object.assign(establishment, updateEstablishmentDto);
    return this.establishmentRepository.save(establishment);
  }

  async remove(id: string): Promise<void> {
    const establishment = await this.findOne(id);
    await this.establishmentRepository.remove(establishment);
  }
}
