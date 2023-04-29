import { Module } from '@nestjs/common';
import { AsignacionService } from './asignacion.service';
import { AsignacionController } from './asignacion.controller';
import { AsignaturaEntity } from 'src/asignaturas/asignaturas.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignaturasService } from 'src/asignaturas/asignaturas.service';
import { AsignacionEntity } from './asignacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AsignaturaEntity, AsignacionEntity])],
  providers: [AsignaturasService, AsignacionService],
  controllers: [AsignacionController]
})
export class AsignacionModule {}
