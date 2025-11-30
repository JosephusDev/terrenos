import express from 'express';
import { cadastrar, atualizar, eliminar, carregar, carregarSolicitacoes } from '../controllers/Utente';

const router = express.Router();

// Rota protegida para cadastrar um utente
router.post('/', cadastrar);

// Rota protegida para editar um utente
router.put('/', atualizar);

// Rota protegida para eliminar um utente
router.delete('/:id', eliminar);

// Rota protegida para carregar um utente
router.get('/', carregar);

router.get('/solicitacoes', carregarSolicitacoes);

export default router;
