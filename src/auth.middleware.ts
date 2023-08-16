import { AuthService } from './auth/auth.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import '../custom';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // const token = req.headers.authorization.split(' ')[1];
      // const decoded = await this.authService.verifyToken(token);
     // req.usuario = decoded.usuario; // Agregar el usuario a la solicitud
      next();
    } catch (error) {
      // Manejar errores de autenticación
    }
  }
}