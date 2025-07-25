import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant } from './entities/participant.entity';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>,
  ) {}

  create(createDto: CreateParticipantDto) {
    const participant = this.participantRepo.create(createDto);
    return this.participantRepo.save(participant);
  }

  findAll() {
    return this.participantRepo.find({ relations: ['reservation'] });
  }

  findOne(id: string) {
    return this.participantRepo.findOne({ where: { id }, relations: ['reservation'] });
  }

  update(id: string, updateDto: UpdateParticipantDto) {
    return this.participantRepo.update(id, updateDto);
  }

  remove(id: string) {
    return this.participantRepo.delete(id);
  }
}
