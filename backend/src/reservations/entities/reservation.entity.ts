import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
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
  @Column()
  organizerEmail: string;

  @ApiProperty()
  @Column()
  token: string;

  @ManyToOne(() => Availability, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'availabilityId' })
  availability: Availability;

  @ApiProperty()
  @Column('uuid')
  availabilityId: string;

  @Column({ type: 'int', default: 1 })
  participantsCount: number;

  @ApiProperty({ type: [String] })
  @Column('simple-array', { nullable: true })
  participants?: string[];
}
