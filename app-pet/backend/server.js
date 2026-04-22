const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API do Diário Pet funcionando.' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/entries', require('./routes/diaryRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));

async function startServer() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pet_diary'
    );

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Erro ao conectar no MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
