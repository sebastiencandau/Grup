import {
  IsString,
  IsEmail,
  IsOptional,
  IsUUID,
  IsArray,
  IsString as IsStringArray, // renommage facultatif si conflit
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsEmail()
  organizerEmail: string;

  @ApiProperty({
    description: 'ID de la disponibilité choisie',
  })
  @IsUUID()
  availabilityId: string;

  @ApiPropertyOptional({
    description: 'Nombre total de participants',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  participantsCount?: number;

  @ApiPropertyOptional({
    description: 'Liste des participants (noms ou emails)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  participants?: string[];
}
