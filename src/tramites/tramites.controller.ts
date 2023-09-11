import { ConsultaService } from 'src/consulta/consulta.service';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { RolNombre } from './../rol/rol.enum';
import { RolDecorator } from './../decorators/rol.decorator';
import { RolesGuard } from './../guards/rol.guard';
import { JwtAuthGuard } from './../guards/jwt.guard';
import { TramitesDto } from './dto/tramites.dto';
import { TramitesService } from './tramites.service';
import { Controller, Get, Param, Req, ParseIntPipe, Body, Post, Put, UsePipes, ValidationPipe, InternalServerErrorException } from '@nestjs/common';
import { Delete, UseGuards } from '@nestjs/common/decorators';
import { randomBytes } from 'crypto';
import { TramitesEntity } from './tramites.entity';
import { MessageDto } from 'src/common/message.dto';


@Controller('tramites')
export class TramitesController {

    constructor(private readonly tramitesService: TramitesService,
    private readonly consultaService: ConsultaService
    ){}

@RolDecorator(RolNombre.ADMIN, RolNombre.DIRECTOR, RolNombre.USER)
@UseGuards(JwtAuthGuard, RolesGuard)
@Get()
async getAll(@Req() req): Promise<TramitesEntity[]> {
  const usuario: UsuarioEntity = req.user;
  console.log(usuario); // agregar log aquí
  return await this.tramitesService.getAll(usuario);
}

    
    @RolDecorator(RolNombre.ADMIN, RolNombre.DIRECTOR, RolNombre.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':idSolicitud')
    async getOne(@Param('idSolicitud', ParseIntPipe) idSolicitud: number, @Req() req){
        const usuario: UsuarioEntity = req.user;
        return await this.tramitesService.findById(idSolicitud,usuario);
    }
    

    @RolDecorator(RolNombre.ADMIN, RolNombre.DIRECTOR, RolNombre.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    @Post()
    async create(@Req() req, @Body() dto: TramitesDto) {
        const usuario: UsuarioEntity = req.user;
        const randomNumber = randomBytes(5).toString('hex');
        dto.numerosd = randomNumber;
        return await this.tramitesService.create(dto, usuario);
        
  }

  @RolDecorator(RolNombre.ADMIN, RolNombre.DIRECTOR, RolNombre.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({whitelist: true}))
  @Put(':idSolicitud')
  async update(@Req() req, @Param('idSolicitud', ParseIntPipe) idSolicitud: number, @Body() dto: TramitesDto) {
  const usuario: UsuarioEntity = req.user;
  return await this.tramitesService.update(idSolicitud, dto, usuario);
  }
    
  @RolDecorator(RolNombre.ADMIN, RolNombre.DIRECTOR, RolNombre.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':idSolicitud')
  async delete(@Req() req, @Param('idSolicitud', ParseIntPipe) idSolicitud: number){
    const usuario: UsuarioEntity = req.user;
    try {
      await this.tramitesService.delete(idSolicitud, usuario);
      return new MessageDto('Trámite eliminado con éxito.');
    } catch (error) {
      throw new InternalServerErrorException('No se pudo eliminar el trámite.');
    }
   
  }


  }