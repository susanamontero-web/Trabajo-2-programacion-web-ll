const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const EQUIPOS_URL = `${API_URL}/equipos`;

async function solicitar(ruta = "", opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${EQUIPOS_URL}${ruta}`, {
      ...opciones,
      headers: opciones.body
        ? { "Content-Type": "application/json" }
        : undefined,
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. Comprueba que el backend esté iniciado e inténtalo nuevamente.",
    );
  }
  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => null);
    const mensaje = datos?.message;
    throw new Error(
      Array.isArray(mensaje)
        ? mensaje.join(" ")
        : mensaje ||
            `No se pudo completar la operación (error ${respuesta.status}).`,
    );
  }
  if (respuesta.status === 204) return;
  return respuesta.json();
}

export const equiposApi = {
  listar: () => solicitar(),
  obtener: (id) => solicitar(`/${id}`),
  crear: (datos) =>
    solicitar("", { method: "POST", body: JSON.stringify(datos) }),
  actualizar: (id, datos) =>
    solicitar(`/${id}`, { method: "PATCH", body: JSON.stringify(datos) }),
  eliminar: (id) => solicitar(`/${id}`, { method: "DELETE" }),
};
