import express from 'express';
import { cadastrar, eliminar, carregar, carregarTotalTipo } from '../controllers/Espaco';

const router = express.Router();

// Rota protegida para cadastrar uma reserva
router.post('/', cadastrar);

// Rota protegida para eliminar uma reserva
router.delete('/:id', eliminar);

// Rota protegida para carregar uma reserva
router.get('/', carregar);

router.get("/total-tipos", carregarTotalTipo)

export default router;
