import { TramitesRepository } from './../tramites/tramites.repository';
import { JwtStrategy } from './../auth/strategies/jwt.strategy';
import { UsuarioService } from './../usuario/usuario.service';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { AuthService } from './../auth/auth.service';
import { TramitesService } from './../tramites/tramites.service';
import { RolEntity } from './../rol/rol.entity';
import { TramitesEntity } from './../tramites/tramites.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultaEntity } from './consulta.entity';
import { Module } from '@nestjs/common';
import { ConsultaService } from './consulta.service';
import { ConsultaController } from './consulta.controller';
import { RolService } from 'src/rol/rol.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConsultaEntity, TramitesEntity, RolEntity, UsuarioEntity, TramitesRepository ])],
  providers: [ConsultaService, TramitesService,RolService, UsuarioService,],
  controllers: [ConsultaController]
})
export class ConsultaModule {}
