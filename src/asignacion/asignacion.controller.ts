import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { AsignacionService } from './asignacion.service';
import { AsignacionEntity } from './asignacion.entity';
import { RolNombre } from './../rol/rol.enum';
import { RolDecorator } from './../decorators/rol.decorator';
import { RolesGuard } from './../guards/rol.guard';
import { JwtAuthGuard } from './../guards/jwt.guard';
import { UseGuards } from '@nestjs/common/decorators';

@Controller('asignacion')
export class AsignacionController {
  constructor(private readonly asignacionService: AsignacionService) {}

  @RolDecorator(RolNombre.ADMIN, RolNombre.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async asignar(
    @Req() req,
    @Body('asignaturaId') asignaturaId: number,
    @Body('semestre') semestre: number,
  ): Promise<AsignacionEntity> {
    const usuarioId = req.user.id;
    return await this.asignacionService.asignar(usuarioId, asignaturaId, semestre);
  }

@RolDecorator(RolNombre.USER, RolNombre.DIRECTOR)
@UseGuards(JwtAuthGuard, RolesGuard)
@Get()
async verAsignaciones(@Req() req): Promise<AsignacionEntity[]> {
  const usuarioId = req.user.id;
  return await this.asignacionService.verAsignaciones(usuarioId);
}
}