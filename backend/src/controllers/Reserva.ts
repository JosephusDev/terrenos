import { Request, Response } from 'express';
import { pool } from '../config/database';

// Cadastrar uma nova reserva fundiária
export const cadastrar = async (req: Request, res: Response) => {
  const { nome } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO reserva (nome) VALUES (?)', [nome]);
    res.status(201).json({ id: (result as any).insertId, nome });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error });
  }
};

// Editar uma reserva existente
export const atualizar = async (req: Request, res: Response) => {
  const { id, nome } = req.body;

  try {
    const [result] = await pool.query('UPDATE reserva SET nome = ? WHERE id = ?', [nome, id]);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Reserva not found' });
    }
    res.status(200).json({ message: 'Reserva updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error });
  }
};

// Eliminar uma reserva existente
export const eliminar = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM reserva WHERE id = ?', [id]);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: 'Reserva not found' });
    }
    res.status(200).json({ message: 'Reserva deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error });
  }
};

// Carregar uma reserva existente
export const carregar = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('select * from ver_reservas');
    if ((rows as any).length === 0) {
      return res.status(404).json({ message: 'Reserva not found' });
    }
    res.status(200).json((rows as any));
  } catch (error) {
    res.status(500).json({ message: 'Database error', error });
  }
};

export const carregarBeneficiados = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('select reserva, count(*) utentes from ver_espacos group by id_reserva;');
    if ((rows as any).length === 0) {
      return res.status(404).json({ message: 'Reserva not found' });
    }
    res.status(200).json((rows as any));
  } catch (error) {
    res.status(500).json({ message: 'Database error', error });
  }
};
