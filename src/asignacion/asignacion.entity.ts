import { AsignaturaEntity } from "src/asignaturas/asignaturas.entity";
import { UsuarioEntity } from "src/usuario/usuario.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'asignacion' })

export class AsignacionEntity {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(type => UsuarioEntity, usuario => usuario.asignaciones)
  usuario: UsuarioEntity;

  @ManyToOne(type => AsignaturaEntity, asignatura => asignatura.asignaciones)
  asignatura: AsignaturaEntity;

  @Column({ type: 'int' })
  semestre: number;
}