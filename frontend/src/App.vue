<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { equiposApi } from "./services/equipos.js";

const estados = ["Disponible", "En uso", "Mantención", "Baja"];
const equipos = ref([]);
const busqueda = ref("");
const cargando = ref(false);
const guardando = ref(false);
const eliminando = ref(null);
const error = ref("");
const mensaje = ref("");
const editandoId = ref(null);
const detalle = ref(null);
const formularioVacio = () => ({
  codigoInventario: "",
  nombre: "",
  tipo: "",
  marca: "",
  modelo: "",
  ubicacion: "",
  estado: "Disponible",
  fechaAdquisicion: "",
  observaciones: "",
});
const formulario = reactive(formularioVacio());
const campos = [
  {
    nombre: "codigoInventario",
    etiqueta: "Código de inventario",
    minimo: 3,
    maximo: 50,
  },
  { nombre: "nombre", etiqueta: "Nombre", minimo: 3, maximo: 150 },
  { nombre: "tipo", etiqueta: "Tipo", minimo: 1, maximo: 80 },
  { nombre: "marca", etiqueta: "Marca", minimo: 1, maximo: 100 },
  { nombre: "modelo", etiqueta: "Modelo", minimo: 1, maximo: 100 },
  { nombre: "ubicacion", etiqueta: "Ubicación", minimo: 1, maximo: 150 },
];
const normalizar = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const equiposFiltrados = computed(() => {
  const texto = normalizar(busqueda.value.trim());
  return equipos.value.filter((equipo) =>
    ["nombre", "codigoInventario", "tipo", "ubicacion", "estado"].some(
      (campo) => normalizar(equipo[campo]).includes(texto),
    ),
  );
});
const ocupado = computed(
  () => cargando.value || guardando.value || eliminando.value !== null,
);

async function cargarEquipos() {
  cargando.value = true;
  try {
    equipos.value = await equiposApi.listar();
    return true;
  } catch (err) {
    error.value = err.message;
    return false;
  } finally {
    cargando.value = false;
  }
}
async function recargar() {
  error.value = "";
  mensaje.value = "";
  await cargarEquipos();
}
function limpiarFormulario() {
  editandoId.value = null;
  Object.assign(formulario, formularioVacio());
}
async function guardar() {
  error.value = "";
  mensaje.value = "";
  guardando.value = true;
  const eraEdicion = editandoId.value !== null;
  const datos = Object.fromEntries(
    Object.entries(formulario).map(([clave, valor]) => [clave, valor.trim()]),
  );
  try {
    if (eraEdicion) await equiposApi.actualizar(editandoId.value, datos);
    else await equiposApi.crear(datos);
    limpiarFormulario();
    detalle.value = null;
    const actualizado = await cargarEquipos();
    mensaje.value = `${eraEdicion ? "Equipo actualizado." : "Equipo registrado."}${actualizado ? "" : " No se pudo actualizar el listado; pulsa Actualizar."}`;
  } catch (err) {
    error.value = err.message;
  } finally {
    guardando.value = false;
  }
}
async function verDetalle(id) {
  error.value = "";
  mensaje.value = "";
  cargando.value = true;
  detalle.value = null;
  try {
    detalle.value = await equiposApi.obtener(id);
  } catch (err) {
    error.value = err.message;
  } finally {
    cargando.value = false;
  }
}
function editar(equipo) {
  error.value = "";
  mensaje.value = "";
  editandoId.value = equipo.id;
  for (const clave of Object.keys(formulario))
    formulario[clave] = equipo[clave] ?? "";
  document.getElementById("codigoInventario")?.focus();
}
async function eliminar(equipo) {
  if (
    !window.confirm(
      `¿Eliminar el equipo "${equipo.nombre}" (${equipo.codigoInventario})?`,
    )
  )
    return;
  error.value = "";
  mensaje.value = "";
  eliminando.value = equipo.id;
  try {
    await equiposApi.eliminar(equipo.id);
    if (editandoId.value === equipo.id) limpiarFormulario();
    if (detalle.value?.id === equipo.id) detalle.value = null;
    const actualizado = await cargarEquipos();
    mensaje.value = `Equipo eliminado.${actualizado ? "" : " No se pudo actualizar el listado; pulsa Actualizar."}`;
  } catch (err) {
    error.value = err.message;
  } finally {
    eliminando.value = null;
  }
}
onMounted(cargarEquipos);
</script>

<template>
  <main>
    <header>
      <h1>Inventario tecnológico</h1>
      <p>Registro y administración de equipos.</p>
    </header>
    <p v-if="error" class="aviso error" role="alert">{{ error }}</p>
    <p v-if="mensaje" class="aviso exito" role="status">{{ mensaje }}</p>
    <section aria-labelledby="titulo-formulario">
      <h2 id="titulo-formulario">
        {{ editandoId !== null ? "Editar equipo" : "Registrar equipo" }}
      </h2>
      <p>Todos los campos son obligatorios, excepto las observaciones.</p>
      <form @submit.prevent="guardar">
        <fieldset :disabled="ocupado">
          <div class="campos">
            <label
              v-for="campo in campos"
              :key="campo.nombre"
              :for="campo.nombre"
            >
              {{ campo.etiqueta }}
              <input
                :id="campo.nombre"
                v-model="formulario[campo.nombre]"
                type="text"
                required
                :minlength="campo.minimo"
                :maxlength="campo.maximo"
              />
            </label>
            <label for="estado"
              >Estado
              <select id="estado" v-model="formulario.estado" required>
                <option v-for="estado in estados" :key="estado">
                  {{ estado }}
                </option>
              </select>
            </label>
            <label for="fechaAdquisicion"
              >Fecha de adquisición
              <input
                id="fechaAdquisicion"
                v-model="formulario.fechaAdquisicion"
                type="date"
                required
              />
            </label>
            <label for="observaciones" class="ancho-completo"
              >Observaciones (opcional)
              <textarea
                id="observaciones"
                v-model="formulario.observaciones"
                maxlength="5000"
                rows="3"
              ></textarea>
            </label>
          </div>
          <div class="acciones">
            <button type="submit">
              {{
                guardando
                  ? "Guardando…"
                  : editandoId !== null
                    ? "Guardar cambios"
                    : "Registrar equipo"
              }}
            </button>
            <button
              v-if="editandoId !== null"
              type="button"
              class="secundario"
              @click="limpiarFormulario"
            >
              Cancelar edición
            </button>
          </div>
        </fieldset>
      </form>
    </section>
    <section v-if="detalle" aria-labelledby="titulo-detalle">
      <div class="cabecera-seccion">
        <h2 id="titulo-detalle">Detalle del equipo</h2>
        <button type="button" class="secundario" @click="detalle = null">
          Cerrar detalle
        </button>
      </div>
      <dl>
        <div>
          <dt>ID</dt>
          <dd>{{ detalle.id }}</dd>
        </div>
        <div v-for="campo in campos" :key="campo.nombre">
          <dt>{{ campo.etiqueta }}</dt>
          <dd>{{ detalle[campo.nombre] }}</dd>
        </div>
        <div>
          <dt>Estado</dt>
          <dd>{{ detalle.estado }}</dd>
        </div>
        <div>
          <dt>Fecha de adquisición</dt>
          <dd>{{ detalle.fechaAdquisicion }}</dd>
        </div>
        <div>
          <dt>Observaciones</dt>
          <dd>{{ detalle.observaciones || "Sin observaciones" }}</dd>
        </div>
      </dl>
    </section>
    <section aria-labelledby="titulo-listado" :aria-busy="cargando">
      <div class="cabecera-seccion">
        <h2 id="titulo-listado">Equipos registrados</h2>
        <button
          type="button"
          class="secundario"
          :disabled="ocupado"
          @click="recargar"
        >
          Actualizar
        </button>
      </div>
      <label for="busqueda"
        >Buscar por nombre, código, tipo, ubicación o estado</label
      >
      <input
        id="busqueda"
        v-model="busqueda"
        type="search"
        placeholder="Escribe para buscar…"
      />
      <p v-if="cargando" role="status">Cargando equipos…</p>
      <p v-else-if="equipos.length === 0">No hay equipos para mostrar.</p>
      <p v-else-if="equiposFiltrados.length === 0">
        No se encontraron equipos con esa búsqueda.
      </p>
      <template v-else>
        <p>{{ equiposFiltrados.length }} de {{ equipos.length }} equipos</p>
        <div class="tabla-contenedor">
          <table>
            <caption class="solo-lectores">
              Listado del inventario tecnológico
            </caption>
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Nombre</th>
                <th scope="col">Tipo</th>
                <th scope="col">Ubicación</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="equipo in equiposFiltrados" :key="equipo.id">
                <td>{{ equipo.codigoInventario }}</td>
                <td>{{ equipo.nombre }}</td>
                <td>{{ equipo.tipo }}</td>
                <td>{{ equipo.ubicacion }}</td>
                <td>{{ equipo.estado }}</td>
                <td>
                  <div class="acciones">
                    <button
                      type="button"
                      class="secundario"
                      :disabled="ocupado"
                      :aria-label="`Ver detalle de ${equipo.nombre}`"
                      @click="verDetalle(equipo.id)"
                    >
                      Ver
                    </button>
                    <button
                      type="button"
                      class="secundario"
                      :disabled="ocupado"
                      :aria-label="`Editar ${equipo.nombre}`"
                      @click="editar(equipo)"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      class="peligro"
                      :disabled="ocupado"
                      :aria-label="`Eliminar ${equipo.nombre}`"
                      @click="eliminar(equipo)"
                    >
                      {{
                        eliminando === equipo.id ? "Eliminando…" : "Eliminar"
                      }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </section>
  </main>
</template>
