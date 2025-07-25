import { Availability } from 'src/availabilities/entities/availability.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Establishment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  phone?: string;

  @OneToMany(() => Availability, availability => availability.establishment)
  availabilities: Availability[];
}
