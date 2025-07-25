// src/establishments/dto/update-establishment.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateEstablishmentDto } from './create-establishment.dto';

export class UpdateEstablishmentDto extends PartialType(CreateEstablishmentDto) {}
