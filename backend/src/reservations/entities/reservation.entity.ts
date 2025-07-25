import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Participant } from '../../participants/entities/participant.entity';
import { Availability } from '../../availabilities/entities/availability.entity';

@Entity()
export class Reservation {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ nullable: true })
  description?: string;

  @ApiProperty()
  @Column({ type: 'timestamp' })
  date: Date;

  @ApiProperty()
  @Column()
  organizerEmail: string;

  @ApiProperty()
  @Column()
  token: string;

  // Relation vers la disponibilité (créneau réservé)
  @ManyToOne(() => Availability, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'availabilityId' })
  availability: Availability;

  @ApiProperty()
  @Column('uuid')
  availabilityId: string;

  @OneToMany(() => Participant, (participant) => participant.reservation, { cascade: true })
  participants: Participant[];
}
