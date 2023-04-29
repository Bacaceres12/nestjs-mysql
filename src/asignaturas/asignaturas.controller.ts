import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AsignaturasService } from './asignaturas.service';
import { RolNombre } from './../rol/rol.enum';
import { RolDecorator } from './../decorators/rol.decorator';
import { RolesGuard } from './../guards/rol.guard';
import { JwtAuthGuard } from './../guards/jwt.guard';
import { UseGuards } from '@nestjs/common/decorators';


@Controller('asignaturas')
export class AsignaturasController {
  constructor(private readonly asignaturasService: AsignaturasService) {}


  @RolDecorator(RolNombre.ADMIN, RolNombre.DIRECTOR, RolNombre.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async crearAsignatura(
    @Body('nombre') nombre: string,
    @Body('semestre') semestre: number,
    @Body('horario') horario: string,
    @Body('descripcion') descripcion: string,
    @Body('creditos') creditos: number
  ) {
    return await this.asignaturasService.crearAsignatura(nombre, semestre, horario, descripcion, creditos);
  }


  @RolDecorator(RolNombre.ADMIN, RolNombre.DIRECTOR, RolNombre.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  async actualizarAsignatura(@Param('id') id: string, @Body('nombre') nombre: string) {
    return await this.asignaturasService.actualizarAsignatura(+id, nombre);
  }

  @RolDecorator(RolNombre.ADMIN, RolNombre.DIRECTOR, RolNombre.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async eliminarAsignatura(@Param('id') id: string) {
    return await this.asignaturasService.eliminarAsignatura(+id);
  }

  @RolDecorator(RolNombre.ADMIN, RolNombre.DIRECTOR, RolNombre.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ Get()
  async obtenerTodasLasAsignaturas() {
    return await this.asignaturasService.obtenerTodasLasAsignaturas();
  }
}