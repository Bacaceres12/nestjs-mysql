import { TramitesEntity } from 'src/tramites/tramites.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'consulta'})

export class ConsultaEntity{

  @PrimaryGeneratedColumn()
  idConsulta: number;
   
  @ManyToOne(() => TramitesEntity, tramitesEntity => tramitesEntity.consultaEntity)
  @JoinColumn({ name: 'tramite_id' })
  tramitesEntity: TramitesEntity;

  @Column({ type: 'date', nullable: false, default: null })
  fechaConsulta: Date;
  
    @Column({
        type: 'enum',
        enum: ["Aprobado", "Rechazado", "En tramite", "Solucionada"],
        default: "En tramite"
      })
    estado: string;


    
    @Column({type: 'varchar', nullable: false})
    Respuesta: string;

}