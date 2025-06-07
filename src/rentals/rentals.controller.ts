import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RentalStatus } from './entities/rental-request.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('rentals')
@ApiBearerAuth()
@Controller('rentals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  @Roles('customer')
  create(
    @Body() createRentalRequestDto: CreateRentalRequestDto,
    @Request() req,
  ) {
    return this.rentalsService.create(createRentalRequestDto, req.user);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.rentalsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'customer')
  findOne(@Param('id') id: string) {
    return this.rentalsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRentalDto: UpdateRentalDto) {
    return this.rentalsService.update(+id, updateRentalDto);
  }

  @Put(':id/status')
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body('status') status: RentalStatus) {
    return this.rentalsService.updateStatus(+id, status);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.rentalsService.remove(+id);
  }
}
