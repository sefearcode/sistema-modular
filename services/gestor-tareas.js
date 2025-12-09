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
      datos.tareas.forEach(t => {
        const tarea = new Tarea(t.id, t.titulo, t.descripcion, t.prioridad);
        if (t.completada) tarea.completar();
        this.tareas.set(t.id, tarea);
      });
    }

    console.log(`📋 ${this.tareas.size} tareas cargadas`);
  }

  async guardarCambios() {
    const arreglo = Array.from(this.tareas.values()).map(t => t.obtenerInformacion());
    this.almacenamiento.actualizarDatos({ tareas: arreglo });
    await this.almacenamiento.guardar();
  }

  async crearTarea(titulo, descripcion = '', prioridad = 'media') {
    Validador.validarDatos(titulo, prioridad);

    const id = Date.now().toString();
    const tarea = new Tarea(id, titulo, descripcion, prioridad);

    this.tareas.set(id, tarea);
    await Logger.log(`Creada tarea: ${titulo}`);

    await this.guardarCambios();
    return tarea;
  }

  async completarTarea(id) {
    const tarea = this.tareas.get(id);
    if (!tarea) throw new Error('Tarea no encontrada');

    tarea.completar();
    await Logger.log(`Tarea completada: ${tarea.titulo}`);

    await this.guardarCambios();
    return tarea;
  }

  async eliminarTarea(id) {
    const tarea = this.tareas.get(id);
    if (!tarea) throw new Error('Tarea no encontrada');

    this.tareas.delete(id);
    await Logger.log(`Eliminada tarea: ${tarea.titulo}`);

    await this.guardarCambios();
  }

  obtenerTareas() {
    return Array.from(this.tareas.values());
  }

  async exportar() {
    const datos = this.obtenerTareas().map(t => t.obtenerInformacion());
    await Exportador.exportarJSON(datos);
    await Exportador.exportarCSV(datos);
  }
}

module.exports = GestorTareas;
