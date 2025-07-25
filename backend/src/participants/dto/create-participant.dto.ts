import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipantDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: ['pending', 'accepted', 'declined'], required: false })
  @IsEnum(['pending', 'accepted', 'declined'])
  @IsOptional()
  status?: 'pending' | 'accepted' | 'declined';
}
