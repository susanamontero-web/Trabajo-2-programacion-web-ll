import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EstadoEquipo } from '../entities/equipo.entity';

const Trim = () =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  );

export class CreateEquipoDto {
  @Trim()
  @IsString({ message: 'El código de inventario debe ser texto.' })
  @MinLength(3, { message: 'El código debe tener al menos 3 caracteres.' })
  @MaxLength(50)
  codigoInventario: string;

  @Trim()
  @IsString({ message: 'El nombre debe ser texto.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(150)
  nombre: string;

  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'El tipo es obligatorio.' })
  @MaxLength(80)
  tipo: string;

  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'La marca es obligatoria.' })
  @MaxLength(100)
  marca: string;

  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'El modelo es obligatorio.' })
  @MaxLength(100)
  modelo: string;

  @Trim()
  @IsString()
  @IsNotEmpty({ message: 'La ubicación es obligatoria.' })
  @MaxLength(150)
  ubicacion: string;

  @IsEnum(EstadoEquipo, {
    message: 'El estado debe ser Disponible, En uso, Mantención o Baja.',
  })
  estado: EstadoEquipo;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha de adquisición debe tener formato AAAA-MM-DD.',
  })
  @IsDateString(
    { strict: true },
    { message: 'La fecha de adquisición no es válida.' },
  )
  fechaAdquisicion: string;

  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(5000)
  observaciones?: string | null;
}
