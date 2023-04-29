import { RolService } from './../rol/rol.service';
import { RolEntity } from './../rol/rol.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { UsuarioService } from './../usuario/usuario.service';
import { ConsultaEntity } from './../consulta/consulta.entity';
import { TramitesEntity } from './tramites.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TramitesService } from './tramites.service';
import { TramitesController } from './tramites.controller';
import { ConsultaService } from 'src/consulta/consulta.service';

@Module({
  imports: [TypeOrmModule.forFeature([TramitesEntity, ConsultaEntity, UsuarioEntity, RolEntity, ])],
  providers: [TramitesService, UsuarioService, RolService, ConsultaService],
  controllers: [TramitesController]
})
export class TramitesModule {}
