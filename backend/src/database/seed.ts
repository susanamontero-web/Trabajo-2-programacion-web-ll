import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';
import { Equipo, EstadoEquipo } from '../equipos/entities/equipo.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const repository = app.get(DataSource).getRepository(Equipo);
    const equipos = [
      {
        codigoInventario: 'INV-001',
        nombre: 'Notebook de administración',
        tipo: 'Notebook',
        marca: 'Lenovo',
        modelo: 'ThinkPad E14',
        ubicacion: 'Oficina administrativa',
        estado: EstadoEquipo.EN_USO,
        fechaAdquisicion: '2025-03-10',
      },
      {
        codigoInventario: 'INV-002',
        nombre: 'Computador de laboratorio',
        tipo: 'PC',
        marca: 'HP',
        modelo: 'ProDesk 400',
        ubicacion: 'Laboratorio 1',
        estado: EstadoEquipo.DISPONIBLE,
        fechaAdquisicion: '2024-07-20',
      },
      {
        codigoInventario: 'INV-003',
        nombre: 'Monitor de biblioteca',
        tipo: 'Monitor',
        marca: 'Samsung',
        modelo: 'S24R350',
        ubicacion: 'Biblioteca',
        estado: EstadoEquipo.EN_USO,
        fechaAdquisicion: '2025-05-12',
      },
      {
        codigoInventario: 'INV-004',
        nombre: 'Proyector de sala',
        tipo: 'Proyector',
        marca: 'Epson',
        modelo: 'PowerLite X49',
        ubicacion: 'Sala 201',
        estado: EstadoEquipo.MANTENCION,
        fechaAdquisicion: '2023-08-01',
      },
      {
        codigoInventario: 'INV-005',
        nombre: 'Computador antiguo de recepción',
        tipo: 'PC',
        marca: 'Dell',
        modelo: 'OptiPlex 3020',
        ubicacion: 'Bodega',
        estado: EstadoEquipo.BAJA,
        fechaAdquisicion: '2018-04-09',
      },
    ];
    let creados = 0;
    for (const equipo of equipos) {
      const existente = await repository.findOneBy({
        codigoInventario: equipo.codigoInventario,
      });
      if (!existente) {
        await repository.save(repository.create(equipo));
        creados++;
      }
    }
    console.log(
      `Datos de ejemplo: ${creados} equipos creados. Los existentes se conservaron.`,
    );
  } finally {
    await app.close();
  }
}

seed().catch((error: unknown) => {
  console.error('No se pudieron cargar los datos de ejemplo.', error);
  process.exitCode = 1;
});
