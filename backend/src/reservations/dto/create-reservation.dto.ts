import { IsString, IsEmail, IsOptional, IsUUID, IsArray, ArrayNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({
    description: 'Liste des emails des participants',
    type: [String],
  })

  @IsOptional()
  @IsInt()
  @Min(1)
  participantsCount?: number;

}
