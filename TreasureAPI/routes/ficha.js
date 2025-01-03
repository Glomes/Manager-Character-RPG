const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database/db');
const router = express.Router();

// Configuração do Multer para upload de PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fichaDir = path.join(__dirname, 'fichas');
    if (!fs.existsSync(fichaDir)) {
      fs.mkdirSync(fichaDir);
    }
    cb(null, fichaDir);
  },
  filename: (req, file, cb) => {
    cb(null, `ficha-${Date.now()}.pdf`);
  }
});

const upload = multer({ storage: storage });


router.get('/:userId', (req, res) => {
    const { userId } = req.params;
  
   
    db.db.all('SELECT * FROM fichas WHERE user_id = ?', [userId], (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar fichas', error: err });
      }
      res.json(rows);  // Retorna todas as fichas encontradas
    });
  });


router.put('/:fichaId', upload.single('pdf'), (req, res) => {
  const { fichaId } = req.params;
  const { userId } = req.body; 
  const filePath = req.file.path;

  // Atualizar a ficha no banco de dados com o novo arquivo
  const updatedAt = new Date().toISOString();

  db.db.run(
    'UPDATE fichas SET file_path = ?, updated_at = ? WHERE id = ? AND user_id = ?',
    [filePath, updatedAt, fichaId, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao atualizar ficha', error: err });
      }
      res.json({
        message: 'Ficha atualizada com sucesso!',
        filePath,
      });
    }
  );
});

router.delete('/:fichaId', (req, res) => {
    const { fichaId } = req.params;
  
   
    db.db.get('SELECT * FROM fichas WHERE id = ?', [fichaId], (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar ficha', error: err });
      }
      if (!row) {
        return res.status(404).json({ message: 'Ficha não encontrada' });
      }
  
      const filePath = row.file_path;
  
    
      db.db.run('DELETE FROM fichas WHERE id = ?', [fichaId], function (err) {
        if (err) {
          return res.status(500).json({ message: 'Erro ao excluir ficha', error: err });
        }
  
      
        fs.unlink(filePath, (err) => {
          if (err) {
            return res.status(500).json({ message: 'Erro ao excluir o arquivo', error: err });
          }
          res.json({ message: 'Ficha excluída com sucesso!' });
        });
      });
    });
  });
  

module.exports = router;
