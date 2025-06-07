import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RentalRequest } from '../../rentals/entities/rental-request.entity';

@Entity('machines')
export class Machine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: true })
  available: boolean;

  @ManyToOne(() => User, (user) => user.machines)
  createdBy: User;

  @OneToMany(() => RentalRequest, (rentalRequest) => rentalRequest.machine)
  rentalRequests: RentalRequest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
