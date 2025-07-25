// src/availabilities/entities/availability.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Establishment } from '../../establishments/entities/establishment.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity()
export class Availability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Establishment, establishment => establishment.availabilities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'establishmentId' })
  establishment: Establishment;

  @Column('uuid')
  establishmentId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'int', default: 1 })
  maxParticipants: number;

  @Column({ type: 'text', nullable: true })
  details?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // 🔒 Nouveau champ
  @Column({ type: 'boolean', default: false })
  isBooked: boolean;

}
