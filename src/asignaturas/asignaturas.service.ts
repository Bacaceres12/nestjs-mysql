import { AsignaturaEntity } from './asignaturas.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AsignaturasService {
  constructor(
    @InjectRepository(AsignaturaEntity)
    private readonly asignaturaRepository: Repository<AsignaturaEntity>,
  ) {}

  async crearAsignatura(nombre: string, semestre:number, horario:string, descripcion:string, creditos:number): Promise<AsignaturaEntity> {
    const asignatura = new AsignaturaEntity();
    asignatura.nombre = nombre;
    asignatura.semestre = semestre;
    asignatura.horario = horario;
    asignatura.descripcion =descripcion;
    asignatura.creditos =creditos;
    return await this.asignaturaRepository.save(asignatura);
  }

  async actualizarAsignatura(id: number, nombre: string): Promise<AsignaturaEntity> {
    const asignatura = await this.asignaturaRepository.findOne(id);
    console.log(asignatura); // Agrega esta línea
    asignatura.nombre = nombre;
    return await this.asignaturaRepository.save(asignatura);
  }

  async eliminarAsignatura(id: number): Promise<void> {
    await this.asignaturaRepository.delete(id);
  }

  async obtenerTodasLasAsignaturas(): Promise<AsignaturaEntity[]> {
    return await this.asignaturaRepository.find();
  }
}