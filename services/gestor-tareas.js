const Tarea = require('../models/tarea');
const Almacenamiento = require('../lib/almacenamiento');
const Validador = require('../lib/validacion');
const Logger = require('../lib/logger');
const Exportador = require('./exportador');

class GestorTareas {
  constructor() {
    this.almacenamiento = new Almacenamiento('tareas.json');
    this.tareas = new Map();
  }

  async inicializar() {
    const datos = await this.almacenamiento.cargar();

    if (datos.tareas) {
      datos.tareas.forEach(tareaData => {
        const tarea = new Tarea(
          tareaData.id,
          tareaData.titulo,
          tareaData.descripcion,
          tareaData.prioridad
        );
        if (tareaData.completada) tarea.completar();
        this.tareas.set(tarea.id, tarea);
      });
    }

    await Logger.registrar(`Sistema inicializado con ${this.tareas.size} tareas`);
  }

  async guardar() {
    const tareasArray = Array.from(this.tareas.values()).map(t => t.obtenerInformacion());
    this.almacenamiento.actualizarDatos({ tareas: tareasArray });
    await this.almacenamiento.guardar();

    await Logger.registrar('Datos guardados');
  }

  crearTarea(titulo, descripcion = '', prioridad = 'media') {
    Validador.validarDatosTarea({ titulo, descripcion, prioridad });

    const id = Date.now().toString();
    const tarea = new Tarea(id, titulo, descripcion, prioridad);
    this.tareas.set(id, tarea);

    Logger.registrar(`Tarea creada "${titulo}"`);
    return tarea;
  }

  async completarTarea(id) {
    const tarea = this.obtenerTarea(id);
    if (!tarea) throw new Error(`Tarea ${id} no encontrada`);

    tarea.completar();
    await this.guardar();

    await Logger.registrar(`Tarea completada "${tarea.titulo}"`);
    return tarea;
  }

  async actualizarTarea(id, datos) {
    const tarea = this.obtenerTarea(id);
    if (!tarea) throw new Error(`Tarea ${id} no encontrada`);

    if (datos.prioridad) Validador.validarPrioridad(datos.prioridad);

    tarea.actualizar(datos);
    await this.guardar();

    await Logger.registrar(`Tarea actualizada "${tarea.titulo}"`);
    return tarea;
  }

  async eliminarTarea(id) {
    const tarea = this.obtenerTarea(id);
    if (!tarea) throw new Error(`Tarea ${id} no encontrada`);

    this.tareas.delete(id);
    await this.guardar();

    await Logger.registrar(`Tarea eliminada "${tarea.titulo}"`);
    return tarea;
  }

  obtenerTarea(id) {
    return this.tareas.get(id);
  }

  obtenerTodasTareas(filtro = {}) {
    let tareas = Array.from(this.tareas.values());
    if (filtro.completada !== undefined)
      tareas = tareas.filter(t => t.completada === filtro.completada);
    if (filtro.prioridad)
      tareas = tareas.filter(t => t.prioridad === filtro.prioridad);
    return tareas;
  }

  obtenerEstadisticas() {
    const tareas = Array.from(this.tareas.values());
    const total = tareas.length;
    const completadas = tareas.filter(t => t.completada).length;

    return {
      total,
      completadas,
      pendientes: total - completadas
    };
  }

  // 🔥 NUEVO: exportación
  async exportar(formato = 'json') {
    const tareas = Array.from(this.tareas.values()).map(t => t.obtenerInformacion());

    if (formato === 'json') {
      const ruta = await Exportador.exportarJSON(tareas);
      await Logger.registrar('Tareas exportadas en JSON');
      return ruta;
    }

    if (formato === 'csv') {
      const ruta = await Exportador.exportarCSV(tareas);
      await Logger.registrar('Tareas exportadas en CSV');
      return ruta;
    }

    throw new Error('Formato no soportado (usa json o csv)');
  }
}

module.exports = GestorTareas;
