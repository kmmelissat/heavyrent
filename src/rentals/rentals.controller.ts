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
import { CreateRentalRequestDto } from './dto/create-rental-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RentalStatus } from './entities/rental-request.entity';
import { Role } from '../auth/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('rentals')
@ApiBearerAuth()
@Controller('rentals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  @Roles(Role.CUSTOMER)
  create(
    @Body() createRentalRequestDto: CreateRentalRequestDto,
    @Request() req,
  ) {
    return this.rentalsService.create(createRentalRequestDto, req.user);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.rentalsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  findOne(@Param('id') id: string) {
    return this.rentalsService.findOne(+id);
  }

  @Put(':id/status')
  @Roles(Role.ADMIN)
  updateStatus(@Param('id') id: string, @Body('status') status: RentalStatus) {
    return this.rentalsService.updateStatus(+id, status);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.rentalsService.remove(+id);
  }
}
