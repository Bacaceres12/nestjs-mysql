import { AuthRepository } from './auth.repository';
import { TokenDto } from './dto/token.dto';
import { BadRequestException, Body, Controller, Get, Patch, Post, UsePipes, ValidationPipe, Put, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUsuarioDto } from './dto/login.dto';
import { NuevoUsuarioDto } from './dto/nuevo-usuario.dto';
import { MessageDto } from 'src/common/message.dto';
import { CambiarcontrasenaDto } from './dto/Cambiarcontrasena.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService,
        private readonly authRepository: AuthRepository

        ){} 

    @Get()
    getAll() {
        return this.authService.getall();
    }

    @UsePipes(new ValidationPipe({whitelist: true}))
    @Post('nuevo')
    create(@Body() dto: NuevoUsuarioDto) {
        return this.authService.create(dto);
    }

    @UsePipes(new ValidationPipe({whitelist: true}))
    @Post('login')
    login(@Body() dto: LoginUsuarioDto) {
        return this.authService.login(dto);
    }

    @Post('refresh')
    refresh(@Body() dto: TokenDto) {
        return this.authService.refresh(dto);
    }

@Post('recuperar-contrasena')
async recuperarContrasena(@Body('correo') correo: string) {
  await this.authService.recuperarContrasena(correo);
  return new MessageDto('Se ha enviado un correo electrónico para recuperar la contraseña');
}

 @Post('actualizar-contrasena/:token')
    async actualizarContrasena(
        @Body('nuevaContrasena') nuevaContrasena: string,
        @Param('token') token: string
    ): Promise<any> {
        await this.authService.actualizarContrasena(token, nuevaContrasena);
        return new MessageDto('Contraseña actualizada con éxito.');
    }

}
