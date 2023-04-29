import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsignacionEntity } from './asignacion.entity';
import { Repository } from 'typeorm';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { AsignaturaEntity } from 'src/asignaturas/asignaturas.entity';

@Injectable()
export class AsignacionService {
  constructor(
    @InjectRepository(AsignacionEntity)
    private readonly asignacionRepository: Repository<AsignacionEntity>,
  ) {}

  async asignar(usuarioId: number, asignaturaId: number, semestre: number): Promise<AsignacionEntity> {
    const asignacion = new AsignacionEntity();
    asignacion.usuario = { id: usuarioId } as UsuarioEntity;
    asignacion.asignatura = { id: asignaturaId } as AsignaturaEntity;
    asignacion.semestre = semestre;
    return await this.asignacionRepository.save(asignacion);
  }

  async verAsignaciones(usuarioId: number): Promise<any[]> {
    const asignaciones = await this.asignacionRepository
      .createQueryBuilder('asignacion')
      .leftJoinAndSelect('asignacion.asignatura', 'asignatura')
      .where('asignacion.usuario = :usuarioId', { usuarioId })
      .getMany();
  
    return asignaciones.map((asignacion) => {
      return {
        ...asignacion,
        nombreAsignatura: asignacion.asignatura.nombre,
      };
    });
  }
}