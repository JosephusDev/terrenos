import express from 'express';
import { cadastrar, atualizar, eliminar, carregar, carregarBeneficiados } from '../controllers/Reserva';

const router = express.Router();

// Rota protegida para cadastrar uma reserva
router.post('/', cadastrar);

// Rota protegida para editar uma reserva
router.put('/', atualizar);

// Rota protegida para eliminar uma reserva
router.delete('/:id', eliminar);

// Rota protegida para carregar uma reserva
router.get('/', carregar);

router.get("/beneficiados", carregarBeneficiados);

export default router;
