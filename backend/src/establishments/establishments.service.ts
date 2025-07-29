import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  ) { }

  async create(createDto: CreateEstablishmentDto): Promise<Establishment> {
    // Exemple : on pourrait empêcher deux établissements avec le même nom au même endroit
    const existing = await this.establishmentRepository.findOne({
      where: { name: createDto.name },
    });

    if (existing) {
      throw new ConflictException(`Un établissement nommé "${createDto.name}" existe déjà.`);
    }

    const establishment = this.establishmentRepository.create(createDto);
    return this.establishmentRepository.save(establishment);
  }

  async findAll(): Promise<Establishment[]> {
    return this.establishmentRepository.find();
  }

  async findOne(id: string): Promise<Establishment> {
    if (!id) {
      throw new BadRequestException("L'identifiant est requis.");
    }

    const establishment = await this.establishmentRepository.findOneBy({ id });

    if (!establishment) {
      throw new NotFoundException(`Établissement avec l'id ${id} introuvable.`);
    }

    return establishment;
  }

  async update(id: string, updateDto: UpdateEstablishmentDto): Promise<Establishment> {
    const establishment = await this.findOne(id);

    if (!Object.keys(updateDto).length) {
      throw new BadRequestException('Aucune donnée fournie pour la mise à jour.');
    }

    Object.assign(establishment, updateDto);
    return this.establishmentRepository.save(establishment);
  }

  async remove(id: string): Promise<void> {
    const establishment = await this.findOne(id);

    // Optionnel : empêcher la suppression s’il a des availabilities/réservations liées
    if (establishment.availabilities?.length) {
      throw new ConflictException("Impossible de supprimer un établissement avec des disponibilités.");
    }

    await this.establishmentRepository.remove(establishment);
  }
}
