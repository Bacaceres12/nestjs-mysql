import { AsignacionEntity } from "src/asignacion/asignacion.entity";
import { UsuarioEntity } from "src/usuario/usuario.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'asignatura'})
export class AsignaturaEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false})
  nombre: string;

  @Column({ type: 'text', nullable: true})
  descripcion: string;

  @Column({ type: 'int', nullable: false})
  creditos: number;

  @Column({ type: 'varchar', length: 255, nullable: false})
  horario: string;
  
  @Column({ type: 'int' })
  semestre: number;

  @ManyToMany(type => UsuarioEntity, usuario => usuario.asignaturas)
  @JoinTable({
    name: 'usuario_asignatura',
    joinColumn: { name: 'asignatura_id' },
    inverseJoinColumn: { name: 'usuario_id' }
  })
  usuarios: UsuarioEntity[];


  @OneToMany(type => AsignacionEntity, asignacion => asignacion.asignatura)
  asignaciones: AsignacionEntity[];

}