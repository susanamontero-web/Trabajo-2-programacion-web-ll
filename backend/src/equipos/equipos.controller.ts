import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { EquiposService } from './equipos.service';

@Controller('equipos')
export class EquiposController {
  constructor(private readonly equiposService: EquiposService) {}

  @Get()
  findAll() {
    return this.equiposService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.equiposService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateEquipoDto) {
    return this.equiposService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEquipoDto) {
    return this.equiposService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.equiposService.remove(id);
  }
}
