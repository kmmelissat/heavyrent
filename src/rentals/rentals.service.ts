import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentalRequest, RentalStatus } from './entities/rental-request.entity';
import { CreateRentalRequestDto } from './dto/create-rental-request.dto';
import { User } from '../users/entities/user.entity';
import { Machine } from '../machines/entities/machine.entity';

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(RentalRequest)
    private rentalRequestRepository: Repository<RentalRequest>,
    @InjectRepository(Machine)
    private machineRepository: Repository<Machine>,
  ) {}

  async create(
    createRentalRequestDto: CreateRentalRequestDto,
    user: User,
  ): Promise<RentalRequest> {
    const machine = await this.machineRepository.findOne({
      where: { id: createRentalRequestDto.machineId },
    });

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    // Check if the machine is available for the requested dates
    const existingRental = await this.rentalRequestRepository.findOne({
      where: {
        machine: { id: machine.id },
        status: RentalStatus.APPROVED,
        startDate: createRentalRequestDto.startDate,
        endDate: createRentalRequestDto.endDate,
      },
    });

    if (existingRental) {
      throw new BadRequestException(
        'Machine is not available for the selected dates',
      );
    }

    const rentalRequest = this.rentalRequestRepository.create({
      machine,
      user,
      startDate: createRentalRequestDto.startDate,
      endDate: createRentalRequestDto.endDate,
      status: RentalStatus.PENDING,
    });

    return this.rentalRequestRepository.save(rentalRequest);
  }

  async findAll(): Promise<RentalRequest[]> {
    return this.rentalRequestRepository.find({
      relations: ['machine', 'user'],
    });
  }

  async findByUserId(userId: number): Promise<RentalRequest[]> {
    return this.rentalRequestRepository.find({
      where: { user: { id: userId } },
      relations: ['machine', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<RentalRequest> {
    const rentalRequest = await this.rentalRequestRepository.findOne({
      where: { id },
      relations: ['machine', 'user'],
    });

    if (!rentalRequest) {
      throw new NotFoundException('Rental request not found');
    }

    return rentalRequest;
  }

  async updateStatus(id: number, status: RentalStatus): Promise<RentalRequest> {
    const rentalRequest = await this.findOne(id);
    rentalRequest.status = status;
    return this.rentalRequestRepository.save(rentalRequest);
  }

  async remove(id: number): Promise<void> {
    const result = await this.rentalRequestRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Rental request not found');
    }
  }
}
