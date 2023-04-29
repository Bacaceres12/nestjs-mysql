import { Module } from '@nestjs/common';
import { AsignaturasService } from './asignaturas.service';
import { AsignaturasController } from './asignaturas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignaturaEntity } from './asignaturas.entity';
import { AsignacionEntity } from 'src/asignacion/asignacion.entity';
import { AsignacionService } from 'src/asignacion/asignacion.service';

@Module({
  imports: [TypeOrmModule.forFeature([AsignaturaEntity, AsignacionEntity])],
  providers: [AsignaturasService, AsignacionService],
  controllers: [AsignaturasController]
})
export class AsignaturasModule {}




