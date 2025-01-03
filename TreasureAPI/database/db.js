const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
let db;

function connect() {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
    } else {
      console.log('Conectado ao banco de dados');
      // Criar a tabela de fichas se não existir
      db.run(`CREATE TABLE IF NOT EXISTS fichas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        file_path TEXT,
        created_at TEXT,
        updated_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`);
    }
  });
}

function close() {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Erro ao fechar o banco de dados:', err);
      } else {
        console.log('Banco de dados fechado');
      }
    });
  }
}

module.exports = {
  connect,
  close,
  db
};
