// services/exportador.js

const fs = require('fs').promises;
const path = require('path');

class Exportador {
  static async exportarJSON(tareas, nombreArchivo = 'export.json') {
    const ruta = path.join(__dirname, '..', 'data', nombreArchivo);
    await fs.writeFile(ruta, JSON.stringify(tareas, null, 2));
    return ruta;
  }

  static async exportarCSV(tareas, nombreArchivo = 'export.csv') {
    const ruta = path.join(__dirname, '..', 'data', nombreArchivo);

    const cabecera = 'id,titulo,descripcion,prioridad,completada,fechaCreacion,fechaCompletada\n';

    const filas = tareas.map(t => (
      `${t.id},"${t.titulo}","${t.descripcion}",${t.prioridad},${t.completada},${t.fechaCreacion},${t.fechaCompletada}`
    ));

    await fs.writeFile(ruta, cabecera + filas.join('\n'));
    return ruta;
  }
}

module.exports = Exportador;
