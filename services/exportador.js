const fs = require('fs').promises;
const path = require('path');

class Exportador {
  static async exportarJSON(tareas) {
    const archivo = path.join(__dirname, '..', 'data', 'tareas_export.json');
    await fs.writeFile(archivo, JSON.stringify(tareas, null, 2), 'utf8');
    console.log('📤 Exportado a JSON');
  }

  static async exportarCSV(tareas) {
    const archivo = path.join(__dirname, '..', 'data', 'tareas_export.csv');

    const encabezados = 'id,titulo,descripcion,prioridad,completada\n';
    const filas = tareas
      .map(t => `${t.id},${t.titulo},${t.descripcion},${t.prioridad},${t.completada}`)
      .join('\n');

    await fs.writeFile(archivo, encabezados + filas, 'utf8');
    console.log('📤 Exportado a CSV');
  }
}

module.exports = Exportador;
