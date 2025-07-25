import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from 'src/reservations/entities/reservation.entity';

@Entity()
export class Participant {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  phone: string;

  @ApiProperty({ enum: ['pending', 'accepted', 'declined'] })
  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'declined';

  @ManyToOne(() => Reservation, (reservation) => reservation.participants, { onDelete: 'CASCADE' })
  reservation: Reservation;
}
