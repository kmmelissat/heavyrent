import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRentalRequestDto {
  @ApiProperty({ description: 'ID of the machine to rent', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  machineId: number;

  @ApiProperty({
    description: 'Start date of the rental',
    example: '2024-03-21T00:00:00Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'End date of the rental',
    example: '2024-03-28T00:00:00Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}
