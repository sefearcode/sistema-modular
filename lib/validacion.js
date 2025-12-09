class ValidadorTareas {
  static validarDatos(titulo, prioridad) {
    if (!titulo || typeof titulo !== 'string' || titulo.trim().length === 0) {
      throw new Error('El título es obligatorio y debe ser un texto válido');
    }

    const prioridades = ['baja', 'media', 'alta'];
    if (!prioridad || !prioridades.includes(prioridad)) {
      throw new Error('La prioridad debe ser: baja, media o alta');
    }
  }
}

module.exports = ValidadorTareas;
