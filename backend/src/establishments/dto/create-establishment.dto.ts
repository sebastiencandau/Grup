// src/establishments/dto/create-establishment.dto.ts
import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEstablishmentDto {
  @ApiProperty({
    description: 'Nom de l’établissement',
    minLength: 3,
    maxLength: 150,
    example: 'Le Bistrot du Coin',
  })
  @IsString()
  @Length(3, 150)
  name: string;

  @ApiPropertyOptional({
    description: 'Description de l’établissement',
    example: 'Un petit restaurant familial situé en centre-ville.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Adresse complète de l’établissement',
    example: '12 rue de Paris, 75001 Paris',
  })
  @IsString()
  address: string;

  @ApiPropertyOptional({
    description: 'Numéro de téléphone de l’établissement',
    example: '+33 1 23 45 67 89',
  })
  @IsString()
  @IsOptional()
  phone?: string;
}
