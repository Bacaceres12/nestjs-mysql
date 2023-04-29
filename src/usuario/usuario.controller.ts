import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UsuarioService } from './usuario.service';
import { Body, Controller, Get, Post, UsePipes, ValidationPipe, Put, Param, InternalServerErrorException, HttpException } from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AsignarRolesDto } from './dto/asignar-roles.dto';
import { UsuarioEntity } from './usuario.entity';

@Controller('usuario')
export class UsuarioController {

    constructor(private readonly usuarioService: UsuarioService) {}

    @Get()
    getAll() {
        return this.usuarioService.getall();
    }

    @UsePipes(new ValidationPipe({whitelist: true}))
    @Post()
    create(@Body() dto: CreateUsuarioDto) {
        return this.usuarioService.create(dto);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    edit(@Param('id') id: number, @Body() dto: UpdateUsuarioDto) {
       return this.usuarioService.edit(id, dto);
}


@Put(':id/roles')
async asignarRol(@Param('id') id: number, @Body() dto: AsignarRolesDto): Promise<{ message: string, usuario: UsuarioEntity }>{
  try {
    const usuario = await this.usuarioService.asignarRol(id, dto)
    return { message: 'Roles asignados correctamente', usuario };
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    } else {
      throw new InternalServerErrorException('No se pudieron asignar los roles al usuario');
    }
  }
}

}