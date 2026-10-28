import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { Equipo } from './entities/equipo.entity';

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo)
    private readonly equiposRepository: Repository<Equipo>,
  ) {}

  findAll() {
    return this.equiposRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const equipo = await this.equiposRepository.findOneBy({ id });
    if (!equipo) {
      throw new NotFoundException(`No existe un equipo con ID ${id}.`);
    }
    return equipo;
  }

  create(dto: CreateEquipoDto) {
    return this.save(this.equiposRepository.create(dto));
  }

  async update(id: number, dto: UpdateEquipoDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException(
        'Debe enviar al menos un campo para actualizar.',
      );
    }
    const equipo = await this.findOne(id);
    this.equiposRepository.merge(equipo, dto);
    return this.save(equipo);
  }

  async remove(id: number) {
    const result = await this.equiposRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`No existe un equipo con ID ${id}.`);
    }
  }

  private async save(equipo: Equipo) {
    try {
      return await this.equiposRepository.save(equipo);
    } catch (error: unknown) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === 'ER_DUP_ENTRY'
      ) {
        throw new ConflictException(
          'Ya existe un equipo con ese código de inventario.',
        );
      }
      throw error;
    }
  }
}
