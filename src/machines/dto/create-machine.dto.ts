import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateMachineDto {
  @ApiProperty({ description: 'Machine name', example: 'Excavator X-100' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Machine description',
    example: 'Heavy-duty excavator for construction work',
  })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Machine availability status', default: true })
  @IsBoolean()
  @IsOptional()
  available?: boolean;
}
