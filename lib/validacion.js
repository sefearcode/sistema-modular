// lib/validacion.js

class ValidadorTareas {
  static validarTitulo(titulo) {
    if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 3) {
      throw new Error('El título debe tener al menos 3 caracteres');
    }
  }

  static validarDescripcion(descripcion) {
    if (descripcion !== undefined && typeof descripcion !== 'string') {
      throw new Error('La descripción debe ser un texto');
    }
  }

  static validarPrioridad(prioridad) {
    const permitidas = ['baja', 'media', 'alta'];
    if (!permitidas.includes(prioridad)) {
      throw new Error(`La prioridad debe ser una de: ${permitidas.join(', ')}`);
    }
  }

  static validarDatosTarea({ titulo, descripcion, prioridad }) {
    this.validarTitulo(titulo);
    this.validarDescripcion(descripcion);
    this.validarPrioridad(prioridad);
  }
}

module.exports = ValidadorTareas;
