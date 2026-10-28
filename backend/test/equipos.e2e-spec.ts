import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/configure-app';
import { Equipo } from '../src/equipos/entities/equipo.entity';

// Usa la base configurada en .env y elimina solo sus propios registros.
describe('API equipos con MySQL', () => {
  let app: INestApplication<App>;
  const ids = new Set<number>();
  const codigo = `TEST-${Date.now()}`;
  const equipo = {
    codigoInventario: codigo,
    nombre: 'Notebook de prueba',
    tipo: 'Notebook',
    marca: 'Lenovo',
    modelo: 'ThinkPad E14',
    ubicacion: 'Laboratorio 1',
    estado: 'Disponible',
    fechaAdquisicion: '2026-03-15',
    observaciones: 'Registro temporal de pruebas automáticas',
  };

  async function iniciar() {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<INestApplication<App>>();
    configureApp(app);
    await app.init();
  }

  beforeAll(iniciar);

  afterAll(async () => {
    if (app) {
      for (const id of ids) {
        await app.get(DataSource).getRepository(Equipo).delete(id);
      }
      await app.close();
    }
  });

  it('crea, persiste tras reiniciar, lista, consulta, actualiza y elimina', async () => {
    const created = await request(app.getHttpServer())
      .post('/equipos')
      .send(equipo)
      .expect(201);
    const saved = created.body as Equipo;
    ids.add(saved.id);
    expect(saved).toMatchObject(equipo);
    expect(typeof saved.id).toBe('number');

    await app.close();
    await iniciar();
    await request(app.getHttpServer())
      .get(`/equipos/${saved.id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject(equipo);
      });
    await request(app.getHttpServer())
      .get('/equipos')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([expect.objectContaining({ id: saved.id })]),
        );
      });
    await request(app.getHttpServer())
      .post('/equipos')
      .send(equipo)
      .expect(409);
    await request(app.getHttpServer())
      .patch(`/equipos/${saved.id}`)
      .send({ estado: 'En uso', observaciones: null })
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({
          estado: 'En uso',
          observaciones: null,
          nombre: equipo.nombre,
        });
      });
    await request(app.getHttpServer())
      .patch(`/equipos/${saved.id}`)
      .send({ nombre: null })
      .expect(400);
    await request(app.getHttpServer())
      .patch(`/equipos/${saved.id}`)
      .send({})
      .expect(400);
    await request(app.getHttpServer())
      .delete(`/equipos/${saved.id}`)
      .expect(204);
    ids.delete(saved.id);
    await request(app.getHttpServer()).get(`/equipos/${saved.id}`).expect(404);
    await request(app.getHttpServer())
      .patch(`/equipos/${saved.id}`)
      .send({ nombre: 'Otro equipo' })
      .expect(404);
    await request(app.getHttpServer())
      .delete(`/equipos/${saved.id}`)
      .expect(404);
  });

  it.each([
    ['codigoInventario', 'ab'],
    ['nombre', 'ab'],
    ['nombre', 123],
    ['tipo', '   '],
    ['marca', ''],
    ['modelo', null],
    ['ubicacion', ''],
    ['estado', 'Prestado'],
    ['fechaAdquisicion', '2026-02-30'],
    ['fechaAdquisicion', '15/03/2026'],
    ['fechaAdquisicion', '2026-03-15T00:00:00Z'],
    ['observaciones', 123],
    ['id', 999],
    ['campoDesconocido', 'no permitido'],
  ])('rechaza datos inválidos en %s', async (campo, valor) => {
    await request(app.getHttpServer())
      .post('/equipos')
      .send({ ...equipo, [campo]: valor })
      .expect(400);
  });

  it('rechaza campos obligatorios ausentes', async () => {
    await request(app.getHttpServer()).post('/equipos').send({}).expect(400);
  });

  it('rechaza un ID que no sea entero', async () => {
    await request(app.getHttpServer()).get('/equipos/abc').expect(400);
    await request(app.getHttpServer()).get('/equipos/1.5').expect(400);
  });

  it('permite el origen del frontend mediante CORS', async () => {
    await request(app.getHttpServer())
      .options('/equipos')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'POST')
      .expect(204)
      .expect('Access-Control-Allow-Origin', 'http://localhost:5173');
  });
});
