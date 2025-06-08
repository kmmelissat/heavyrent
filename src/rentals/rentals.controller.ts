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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('rentals')
@ApiBearerAuth()
@Controller('rentals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  @Roles(Role.CUSTOMER)
  @ApiOperation({ summary: 'Create a new rental request (Customer only)' })
  @ApiResponse({
    status: 201,
    description: 'Rental request created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid dates or machine unavailable',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Customer access required',
  })
  create(
    @Body() createRentalRequestDto: CreateRentalRequestDto,
    @Request() req,
  ) {
    return this.rentalsService.create(createRentalRequestDto, req.user);
  }

  @Get('my-rentals')
  @Roles(Role.CUSTOMER)
  @ApiOperation({
    summary: "Get current user's rental requests (Customer only)",
  })
  @ApiResponse({
    status: 200,
    description: "Returns the user's rental requests",
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Customer access required',
  })
  findMyRentals(@Request() req) {
    return this.rentalsService.findByUserId(req.user.id);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all rental requests (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all rental requests' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  findAll() {
    return this.rentalsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.CUSTOMER)
  @ApiOperation({ summary: 'Get rental request by ID' })
  @ApiResponse({ status: 200, description: 'Returns the rental request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  @ApiResponse({ status: 404, description: 'Rental request not found' })
  findOne(@Param('id') id: string) {
    return this.rentalsService.findOne(+id);
  }

  @Put(':id/status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update rental request status (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Rental request status updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Rental request not found' })
  updateStatus(@Param('id') id: string, @Body('status') status: RentalStatus) {
    return this.rentalsService.updateStatus(+id, status);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete rental request (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Rental request deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Rental request not found' })
  remove(@Param('id') id: string) {
    return this.rentalsService.remove(+id);
  }
}
