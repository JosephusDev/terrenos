import { Request, Response } from "express";
import { pool } from "../config/database";
import { sendSMS } from "../services/sms";

export const cadastrar = async (req: Request, res: Response) => {
  const { dimensao, data_aquisicao, id_utente, id_reserva } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO espaco (dimensao, data_aquisicao, id_utente, id_reserva) VALUES (?, ?, ?, ?)",
      [dimensao, data_aquisicao, id_utente, id_reserva],
    );
    const [rows] = await pool.query(
      "SELECT nome, telemovel FROM utente WHERE id = ?",
      [id_utente],
    );

    // Cast explícito
    const data = rows as { nome: string; telemovel: string }[];

    if (data.length === 0) {
      return res.status(404).json({ message: "Utente não encontrado" });
    }

    const { error } = await sendSMS({
      name: data[0].nome,
      phone: data[0].telemovel,
    });
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Database error", error });
    }
    res.status(201).json({ message: "Espaco created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Database error", error });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM espaco WHERE id = ?", [id]);
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: "Espaco not found" });
    }
    res.status(200).json({ message: "Espaco deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Database error", error });
  }
};

export const carregar = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("select * from ver_espacos");
    if ((rows as any).length === 0) {
      return res.status(404).json({ message: "Espaco not found" });
    }
    res.status(200).json(rows as any);
  } catch (error) {
    res.status(500).json({ message: "Database error", error });
  }
};

export const carregarTotalTipo = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      "select tipo, count(*) total from espaco group by tipo;",
    );
    if ((rows as any).length === 0) {
      return res.status(404).json({ message: "Espaco not found" });
    }
    res.status(200).json(rows as any);
  } catch (error) {
    res.status(500).json({ message: "Database error", error });
  }
};
