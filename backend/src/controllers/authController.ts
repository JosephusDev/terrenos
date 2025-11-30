import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/database";

export const register = async (req: Request, res: Response) => {
  const { username, password, nivel } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Utilizador ou senha inválidos" });
  }

  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const [rows] = await pool.query(
      "INSERT INTO utilizador (utilizador, senha, nivel) VALUES (?, ?, ?)",
      [username, hashedPassword, nivel],
    );

    res.status(201).json({ message: "Efectuado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Database error", error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM utilizador WHERE utilizador = ?",
      [username],
    );

    if (rows.length === 0) {
      return res.json({});
    }

    const user = rows[0];

    // Verificar a senha
    const isMatch = await bcrypt.compare(password, user.senha);

    if (!isMatch) {
      return res.json({});
    }

    // Gerar o JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.json({
      token,
      id: user.id,
      nivel: user.nivel,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Database error", error });
  }
};
