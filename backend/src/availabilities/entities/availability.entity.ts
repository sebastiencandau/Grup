// src/availabilities/entities/availability.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Establishment } from '../../establishments/entities/establishment.entity';

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
  maxParticipants: number; // capacité du créneau

  @Column({ type: 'text', nullable: true })
  details?: string;

  // Optionnel, pour gérer l’activation/désactivation
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
