// src/availabilities/dto/create-availability.dto.ts
import { IsUUID, IsDateString, IsString, IsOptional, Matches, IsIn, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAvailabilityDto {
  @ApiProperty({
    description: 'UUID de l’établissement auquel appartient cette disponibilité',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  establishmentId: string;

  @ApiProperty({
    description: 'Date de la disponibilité au format YYYY-MM-DD',
    example: '2025-08-01',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Heure de début au format HH:mm (24h)',
    example: '14:00',
  })
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
  startTime: string;

  @ApiProperty({
    description: 'Heure de fin au format HH:mm (24h)',
    example: '15:00',
  })
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
  endTime: string;

  @ApiPropertyOptional({
    description: 'Détails optionnels sur la disponibilité (salle, équipement, etc.)',
    example: 'Salle 2B',
  })
  
  @IsOptional()
  @IsString()
  details?: string;
  @ApiProperty({
    description: 'Nombre maximum de participants pour cette disponibilité',
    example: 5,
  })

  @ApiProperty({
    description: 'Nombre maximum de participants pour cette disponibilité',
    example: 5,
  })
  @IsInt()
  @Min(1)
  maxParticipants: number;


}
