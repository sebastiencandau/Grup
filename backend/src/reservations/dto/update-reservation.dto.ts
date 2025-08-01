import {
  IsString,
  IsEmail,
  IsOptional,
  IsUUID,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReservationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  organizerEmail?: string;

  @ApiProperty({ required: false, description: 'Nouveau créneau (disponibilité)' })
  @IsOptional()
  @IsUUID()
  availabilityId?: string;

  @ApiProperty({
    required: false,
    description: 'Liste mise à jour des emails de participants',
    type: [String],
  })

  @IsOptional()
  @IsInt()
  @Min(1)
  participantsCount?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  participantsEmails?: string[];
}
