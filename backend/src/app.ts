import dotenv from 'dotenv';
dotenv.config();

import express from 'express'; // Importar Response
import cors from 'cors'; // Importar o middleware cors
import authRoutes from './routes/authRoutes';
import reservaRoutes from './routes/Reserva';
import utenteRoutes from './routes/Utente';
import espacoRoutes from "./routes/Espaco";
import { authenticateToken } from './middlewares/authMiddleware';

const app = express();

app.use(express.json());

// Configuração do middleware CORS
app.use(cors());

// Rotas públicas (não protegidas)
app.use('/auth', authRoutes);

// Aplicar o middleware de autenticação a todas as rotas protegidas
app.use(authenticateToken);

// Rotas protegidas
app.use('/reservas', reservaRoutes);

app.use('/utentes', utenteRoutes);

app.use("/espacos", espacoRoutes);

app.use("/verify", (req, res) => {
  return res.status(200).json({ message: 'Token válido' });
})

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
