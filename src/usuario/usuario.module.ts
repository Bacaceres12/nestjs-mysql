import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolEntity } from 'src/rol/rol.entity';
import { UsuarioEntity } from './usuario.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UsuarioEntity,RolEntity])],
  providers: [UsuarioService],
  controllers: [UsuarioController]
})
export class UsuarioModule {}
