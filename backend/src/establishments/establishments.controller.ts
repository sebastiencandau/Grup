import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EstablishmentsService } from './establishments.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishement.dto';

@ApiTags('Establishments') // <== groupe Swagger
@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un établissement' })
  @ApiResponse({ status: 201, description: 'Établissement créé avec succès.' })
  create(@Body() createEstablishmentDto: CreateEstablishmentDto) {
    return this.establishmentsService.create(createEstablishmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les établissements' })
  @ApiResponse({ status: 200, description: 'Liste des établissements.' })
  findAll() {
    return this.establishmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un établissement par ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Établissement trouvé.' })
  @ApiResponse({ status: 404, description: 'Établissement introuvable.' })
  findOne(@Param('id') id: string) {
    return this.establishmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un établissement' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Établissement mis à jour.' })
  update(
    @Param('id') id: string,
    @Body() updateEstablishmentDto: UpdateEstablishmentDto,
  ) {
    return this.establishmentsService.update(id, updateEstablishmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un établissement' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Établissement supprimé.' })
  remove(@Param('id') id: string) {
    return this.establishmentsService.remove(id);
  }
}
