const GestorTareas = require('./services/gestor-tareas');

async function main() {
  console.log('🚀 SISTEMA MODULAR EXTENDIDO\n');

  const gestor = new GestorTareas();
  await gestor.inicializar();

  gestor.crearTarea('Estudiar Node.js', 'Repasar módulos', 'alta');
  gestor.crearTarea('Jugar fútbol', 'Partido 8 PM', 'media');

  await gestor.guardar();

  console.log('\n📤 Exportando tareas...');
  console.log('JSON:', await gestor.exportar('json'));
  console.log('CSV:', await gestor.exportar('csv'));

  console.log('\n📊 Estadísticas:', gestor.obtenerEstadisticas());
}

main().catch(err => console.error('❌ Error:', err.message));
