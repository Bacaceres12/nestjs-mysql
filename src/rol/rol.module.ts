import { TramitesRepository } from './../tramites/tramites.repository';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { ConsultaEntity } from './../consulta/consulta.entity';
import { TramitesEntity } from 'src/tramites/tramites.entity';
import { TramitesService } from './../tramites/tramites.service';
import { Module } from '@nestjs/common';
import { RolService } from './rol.service';
import { RolController } from './rol.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolEntity } from './rol.entity';
import { UsuarioService } from 'src/usuario/usuario.service';
import { ConsultaService } from 'src/consulta/consulta.service';

@Module({
  imports:[TypeOrmModule.forFeature([RolEntity, TramitesEntity, ConsultaEntity, UsuarioEntity,TramitesRepository])],
  providers: [RolService, TramitesService, ConsultaService, UsuarioService,],
  controllers: [RolController]
})
export class RolModule {}
