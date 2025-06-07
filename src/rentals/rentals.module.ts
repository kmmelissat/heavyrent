import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { RentalRequest } from './entities/rental-request.entity';
import { Machine } from '../machines/entities/machine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RentalRequest, Machine])],
  controllers: [RentalsController],
  providers: [RentalsService],
  exports: [RentalsService],
})
export class RentalsModule {}
