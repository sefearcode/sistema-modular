const fs = require('fs').promises;
const path = require('path');

class Logger {
  static async log(mensaje) {
    const archivo = path.join(__dirname, '..', 'data', 'log.txt');
    const linea = `${new Date().toISOString()} - ${mensaje}\n`;

    await fs.mkdir(path.dirname(archivo), { recursive: true });
    await fs.appendFile(archivo, linea, 'utf8');
  }
}

module.exports = Logger;
