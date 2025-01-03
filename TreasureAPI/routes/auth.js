// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const router = express.Router();

// Endpoint para registrar um novo usuário
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Verificar se o usuário já existe
  const user = await db.db.get('SELECT * FROM users WHERE username = ?', [username]);
  if (user) {
    return res.status(400).json({ message: 'Usuário já existe' });
  }

  // Hash da senha
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Inserir o novo usuário no banco de dados
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  db.db.run(
    'INSERT INTO users (username, password, created_at, updated_at) VALUES (?, ?, ?, ?)',
    [username, hashedPassword, createdAt, updatedAt],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao registrar usuário', error: err });
      }
      res.status(201).json({
        message: 'Usuário registrado com sucesso!',
        userId: this.lastID,  // ID do novo usuário
      });
    }
  );
});

// Endpoint para login (já existente)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Buscar usuário no DB
  const user = await db.db.get('SELECT * FROM users WHERE username = ?', [username]);
  if (!user) {
    return res.status(400).json({ message: 'Usuário não encontrado' });
  }

  // Verificar a senha
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Senha incorreta' });
  }

  // Gerar o token JWT
  const token = jwt.sign({ id: user.id }, 'seu-segredo', { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
