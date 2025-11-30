import { Request, Response } from 'express';
import { pool } from '../config/database';

// Cadastrar uma nova Utente fundiária
export const cadastrar = async (req: Request, res: Response) => {
  const { nome, telemovel, bi, data_nascimento, endereco } = req.body;

  try {
    const [result] = await pool.query('INSERT INTO utente (nome, telemovel, bi, data_nascimento, endereco) VALUES (?, ?, ?, ?, ?)', 
        [ nome, telemovel, bi, data_nascimento, endereco ]
    );
    res.status(201).json({ message: 'Utente created successfully'});
  } catch (error) {
    res.status(500).json({ message: 'Database error', error });
  }
};

// Editar uma Utente existente
export const atualizar = async (req: Request, res: Response) => {
  const { id, nome, telemovel, bi, endereco } = req.body;

  try {
    const [result] = await pool.query('UPDATE utente SET nome = ?, telemovel = ?, bi = ?, endereco = ? WHERE id = ?', 
        [nome, telemovel, bi, endereco, id]
    );
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Utente not found' });
    }
    res.status(200).json({ message: 'Utente updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error });
  }
};

// Eliminar uma Utente existente
export const eliminar = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM utente WHERE id = ?', [id]);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Utente not found' });
    }
    res.status(200).json({ message: 'Utente deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error });
  }
};

// Carregar um Utente existente
export const carregar = async (req: Request, res: Response) => {

  try {
    const [rows] = await pool.query('select * from utente order by nome');
    if ((rows as any).length === 0) {
      return res.status(404).json({ message: 'Utente not found' });
    }
    res.status(200).json((rows as any));
  } catch (error) {
    res.status(500).json({ message: 'Database error', error });
  }
};

export const carregarSolicitacoes = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('select * from ver_utentes_sem_espaco');
    if ((rows as any).length === 0) {
      return res.status(404).json({ message: 'Utente not found' });
    }
    res.status(200).json((rows as any));
  } catch (error) {
    res.status(500).json({ message: 'Database error', error });
  }
};
