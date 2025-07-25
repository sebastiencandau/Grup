// src/availabilities/availabilities.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AvailabilitiesService } from './availabilities.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Availabilities')
@Controller('availabilities')
export class AvailabilitiesController {
  constructor(private readonly availabilitiesService: AvailabilitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une disponibilité' })
  @ApiResponse({ status: 201, description: 'Disponibilité créée avec succès.' })
  create(@Body() createDto: CreateAvailabilityDto) {
    return this.availabilitiesService.create(createDto);
  }

  @Get('establishment/:establishmentId')
  @ApiOperation({ summary: 'Lister les disponibilités d’un établissement' })
  @ApiParam({ name: 'establishmentId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Liste des disponibilités.' })
  findAllByEstablishment(@Param('establishmentId', ParseUUIDPipe) establishmentId: string) {
    return this.availabilitiesService.findAllByEstablishment(establishmentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une disponibilité' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Disponibilité trouvée.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.availabilitiesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une disponibilité' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Disponibilité mise à jour.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateAvailabilityDto,
  ) {
    return this.availabilitiesService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une disponibilité' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Disponibilité supprimée.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.availabilitiesService.remove(id);
  }
}
