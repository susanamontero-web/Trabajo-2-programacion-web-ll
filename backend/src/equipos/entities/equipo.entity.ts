import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum EstadoEquipo {
  DISPONIBLE = 'Disponible',
  EN_USO = 'En uso',
  MANTENCION = 'Mantención',
  BAJA = 'Baja',
}

@Entity('equipos')
export class Equipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  codigoInventario: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 80 })
  tipo: string;

  @Column({ length: 100 })
  marca: string;

  @Column({ length: 100 })
  modelo: string;

  @Column({ length: 150 })
  ubicacion: string;

  @Column({ type: 'enum', enum: EstadoEquipo })
  estado: EstadoEquipo;

  @Column({ type: 'date' })
  fechaAdquisicion: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;
}
