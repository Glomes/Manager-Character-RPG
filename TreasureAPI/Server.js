// server.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const fichaRoutes = require('./routes/ficha');
const db = require('./database/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes); 
app.use('/api/ficha', fichaRoutes);  

db.connect();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
