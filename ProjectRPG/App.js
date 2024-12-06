const express = require('express');

const app = express();
const PORT = 3000;


app.use(express.json());

app.get('/', (req, res) => {
    res.send('Run dev!');

});

app.post('/test', (req,res)=>{
    const { name, message } = req.body;
    res.json({ name, message, status: 'Recebido com sucesso!' });
})


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)

});