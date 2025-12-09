const GestorTareas = require('./services/gestor-tareas');

async function main() {
  console.log('🚀 SISTEMA MODULAR EXTENDIDO\n');

  const gestor = new GestorTareas();
  await gestor.inicializar();

  console.log('📝 Creando tareas...');
  await gestor.crearTarea('Aprender módulos', 'Práctica avanzada', 'alta');
  await gestor.crearTarea('Estudiar Node.js', 'Repasar asincronía', 'media');

  console.log('🏁 Completando una tarea...');
  const tareas = gestor.obtenerTareas();
  await gestor.completarTarea(tareas[0].id);

  console.log('📤 Exportando...');
  await gestor.exportar();

  console.log('🎉 Finalizado!');
}

main().catch(err => console.error('❌ Error:', err.message));
