import { RolModule } from './../rol/rol.module';
import { ConsultaDto } from './dto/consulta.dto';
import { TramitesService } from './../tramites/tramites.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsultaEntity } from './consulta.entity';
import { TramitesEntity } from 'src/tramites/tramites.entity';
import { TramitesDto } from 'src/tramites/dto/tramites.dto';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { RolNombre } from 'src/rol/rol.enum';


  @Injectable()
  export class ConsultaService {
    constructor(
      @InjectRepository(ConsultaEntity) private consultaRepository: Repository<ConsultaEntity>,
    ) {}
  

    async findAll(usuario: UsuarioEntity): Promise<ConsultaEntity[]> {
      return this.consultaRepository.find({
        where: { tramitesEntity: { usuario: usuario } },
        relations: ['tramitesEntity'],
      });
    }

    async findAllForDirector(): Promise<ConsultaEntity[]> {
      return await this.consultaRepository.find({
        relations: ['tramitesEntity'],
      });
    }

    async updateConsulta(usuario: UsuarioEntity, consultaId: number, ConsultaDto: ConsultaDto): Promise<void> {
      const consulta = await this.consultaRepository.findOne(consultaId);
      if (!consulta) {
        throw new NotFoundException(`La consulta con ID ${consultaId} no existe`);
      }
    
      consulta.estado = ConsultaDto.estado || consulta.estado;
      consulta.Respuesta = ConsultaDto.Respuesta || consulta.Respuesta;
    
      await this.consultaRepository.save(consulta);
    }
    
  }
  
