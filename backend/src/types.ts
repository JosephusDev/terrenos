import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

// Aqui, estendemos a interface Request para incluir a propriedade 'user'
export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}
