import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Machine } from '../../machines/entities/machine.entity';

export enum RentalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('rental_requests')
export class RentalRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Machine, (machine) => machine.rentalRequests)
  machine: Machine;

  @ManyToOne(() => User, (user) => user.rentalRequests)
  user: User;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({
    type: 'enum',
    enum: RentalStatus,
    default: RentalStatus.PENDING,
  })
  status: RentalStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
