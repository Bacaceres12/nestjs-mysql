import { TramitesService } from './../tramites/tramites.service';
import { AuthService } from './../auth/auth.service';
import { Controller, Post, Body, Param, Put, UseGuards, Req, Get, UnauthorizedException } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { ConsultaDto } from './dto/consulta.dto';
import { ConsultaEntity } from './consulta.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { JwtAuthGuard } from './../guards/jwt.guard';
import { RolDecorator } from './../decorators/rol.decorator';
import { RolNombre } from './../rol/rol.enum';
import { RolesGuard } from './../guards/rol.guard';


@Controller('consulta')
export class ConsultaController {
  constructor(private readonly consultaService: ConsultaService) {}

  @RolDecorator(RolNombre.ADMIN, RolNombre.DIRECTOR, RolNombre.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async getAll(@Req() req): Promise<ConsultaEntity[]> {
    const usuario: UsuarioEntity = req.user;
    return await this.consultaService.findAll(usuario);
  }


  @RolDecorator(RolNombre.ADMIN, RolNombre.DIRECTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/todas')
  async getAllForDirector(): Promise<ConsultaEntity[]> {
    return await this.consultaService.findAllForDirector();
  }

@RolDecorator(RolNombre.DIRECTOR)
@UseGuards(JwtAuthGuard, RolesGuard)
@Put(':id')
async updateConsulta(@Req() req, @Param('id') consultaId: number, @Body() consultaDto: ConsultaDto): Promise<void> {
  const usuario: UsuarioEntity = req.user;
  await this.consultaService.updateConsulta(usuario, consultaId, consultaDto);
}
}
